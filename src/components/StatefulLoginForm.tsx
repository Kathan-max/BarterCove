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
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const StatefulLoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuth = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration Successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful!");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error with the Authentication: ", error);
      setErrorMessage("Username or password is not valid.");
    }
  };

  return (
    <div className="flex flex-col items-center">
        <img src="/src/assets/BarterCove.png" alt="BarterCove image" className="mb-4 w-48 h-auto" />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAuth)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-left text-2xl">
              {isRegistering ? "Register" : "Login"}
            </CardTitle>
            <CardDescription>
              Enter your email below to {isRegistering ? "register" : "login"} to your account.
            </CardDescription>
            {errorMessage && (
                <CardDescription className="mt-2 text-red-500">
                    {errorMessage}    
                </CardDescription>
            )}
          </CardHeader>
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
              name="password"
              render={({ field }) => (
                  <FormItem className="grid gap-4">
                  <FormLabel className="text-left">
                    {isRegistering ? "Set Password" : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {/* flex flex-row space-x-2 */}
            <Button type="submit" className="w-full">
              {isRegistering ? "Register" : "Login"}
            </Button>
            <Button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full"
              >
              {isRegistering
                ? "Already have an account? Login"
                : "Need an account? Register"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
    </div>
  );
};

export default StatefulLoginForm;
