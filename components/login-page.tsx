"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { BrandHeader } from "@/components/common/brand-header";

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-4 md:py-8 gradient-bg px-4">
      <BrandHeader className="mb-6 md:mb-8" />

      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your MarketRadar account</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            Don&#39;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
