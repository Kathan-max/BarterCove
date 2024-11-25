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
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const loginFormSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange"
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setErrorMessage("");
      const { identifier, password } = values;
      
      let loginEmail = identifier;
      if (!identifier.includes('@')) {
        const response = await fetch(`http://localhost:3000/api/users/getUserByUsername/${identifier}`);
        if (!response.ok) {
          throw new Error('Invalid username or password');
        }
        const userData = await response.json();
        loginEmail = userData.email;
      }

      await signInWithEmailAndPassword(auth, loginEmail, password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error with Login: ", error);
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img src="/src/assets/BarterCove.png" alt="BarterCove image" className="mb-4 w-48 h-auto" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-left text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email/username and password to login.
          </CardDescription>
          {errorMessage && (
            <CardDescription className="mt-2 text-red-500">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter email or username"
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
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter password"
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
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/register")}
                className="w-full"
              >
                Need an account? Register
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;