import React, { useState } from "react";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const registerFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  username: z.string().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  pincode: z.string().min(1, "Postal code is required").regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, "Invalid Canadian postal code format"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      pincode: "",
    },
    mode: "onChange"
  });

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setErrorMessage("");
      const { email, username, pincode, password } = values;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error with Registration: ", error);
      setErrorMessage(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
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
                        value={field.value}
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
                        value={field.value}
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
                        value={field.value}
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
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Register
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