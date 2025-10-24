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
import MultiStageSignupForm from "@/components/auth/multi-stage-signup-form";
import { BrandHeader } from "@/components/common/brand-header";

export default function SignupPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-4 md:py-8 gradient-bg px-4">
      <BrandHeader className="mb-6 md:mb-8" />

      <Card className="w-full max-w-lg rounded-2xl shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-base text-muted-foreground">
            Discover stalls, shops, and experiences around you.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <MultiStageSignupForm />
        </CardContent>

        <CardFooter className="flex justify-center pt-6 pb-8 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
