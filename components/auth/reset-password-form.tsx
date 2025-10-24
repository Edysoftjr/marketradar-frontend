"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100)
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain a number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordForm) {
    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setError(
        "Failed to reset password. The link may have expired. Please request a new reset link."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Invalid reset token. Please request a new password reset link.
        </AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert>
        <AlertDescription className="text-center">
          Password has been reset successfully! Redirecting to login...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Button
          variant="link"
          className="px-2 text-muted-foreground"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}
