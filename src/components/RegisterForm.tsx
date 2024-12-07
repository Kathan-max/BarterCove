import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, PhoneAuthProvider, RecaptchaVerifier, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const registerFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  username: z.string().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  pincode: z.string().min(1, "Postal code is required").regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, "Invalid Canadian postal code format"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+1\d{10}$/, "Phone number must be in +1XXXXXXXXXX format"),
  otp: z.string().optional()
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [phoneNumberValue, setPhoneNumberValue] = useState("+1");
  const [avatarLink, setAvatarLink] = useState<string | null>(null);
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      pincode: "",
      phoneNumber: "+1",
      otp: ""
    },
    mode: "onChange"
  });

  useEffect(() => {
    // Cleanup function to destroy RecaptchaVerifier when component unmounts
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    try {
      // Ensure the recaptcha container exists
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error("Recaptcha container not found");
      }

      // Create RecaptchaVerifier only if it doesn't exist
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber
          }
        });
      }

      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber, 
        recaptchaVerifierRef.current
      );
      setVerificationId(verificationId);
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP: ", error);
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setErrorMessage("");
      const { email, username, pincode, password, phoneNumber } = values;
      
      // If OTP is not verified, send OTP
      if (!showOtpInput) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        setCurrentUser(user);
        setPhoneNumberValue(phoneNumber);

        await sendOtp(phoneNumber);

        const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email,
            username,
            pincode,
            phoneNumber,
            isPhoneVerified: false
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save user data');
        }
        const userResponse = await fetch(`http://localhost:3000/api/users/getUserByUsername/${username}`);
        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        setAvatarLink(userData.avatarLink); 
      } 
      // If OTP is verified, complete registration
      else if (isOtpVerified) {
        // Final registration steps or navigation
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error with Registration: ", error);
      setErrorMessage(error.message || "Registration failed. Please try again.");
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      if(!currentUser || !verificationId){
        throw new Error("No active user or verification in progress");
      }
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await auth.currentUser?.reload(); // Ensure we're using the current user
      const response = await fetch(`http://localhost:3000/api/users/verify-phone/${currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneNumberValue })
      });

      if (!response.ok) {
        throw new Error('Failed to verify phone number');
      }

      setIsOtpVerified(true);
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setErrorMessage("Invalid OTP. Please try again.");
      setIsOtpVerified(false);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div id="recaptcha-container" className="absolute top-0 left-0 opacity-0"></div>
      <img src="/src/assets/BarterCove.png" alt="BarterCove image" className="mb-4 w-48 h-auto" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-left text-2xl">Register</CardTitle>
          <CardDescription>
            Create your account to get started.
          </CardDescription>
          {errorMessage && (
            <CardDescription className="mt-2 text-red-500">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-4">
                    <FormLabel className="text-left">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-4">
                    <FormLabel className="text-left">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem className="grid gap-4">
                    <FormLabel className="text-left">Postal Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="N8X 3V1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-4">
                    <FormLabel className="text-left">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid gap-4">
                    <FormLabel className="text-left">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1XXXXXXXXXX"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showOtpInput && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="grid gap-4">
                      <FormLabel className="text-left">OTP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit OTP"
                          type="text"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value.length === 6) {
                              verifyOtp(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full"
              disabled={showOtpInput && !isOtpVerified}>
                {!showOtpInput ? "Send OTP" : 
                 !isOtpVerified ? "Verify OTP" : 
                 "Register"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Already have an account? Login
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;