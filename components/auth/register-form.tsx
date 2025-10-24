"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "./auth-provider";

interface RegisterFormProps {
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p) => /[0-9]/.test(p) },
  {
    label: "At least one special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthContext();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (
      !passwordRequirements.every((req) => req.test(formData.password))
    ) {
      errors.password = "Password does not meet all requirements";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      // Clear auth error when user starts typing
      if (error) {
        clearError();
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });

        onSuccess?.();
        router.push("/verify-email");
      } else {
        toast({
          title: "Registration failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);

      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    const passedRequirements = passwordRequirements.filter((req) =>
      req.test(password)
    );
    return (passedRequirements.length / passwordRequirements.length) * 100;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          className="rounded-full"
          value={formData.name}
          onChange={handleInputChange("name")}
          disabled={isLoading}
        />
        {formErrors.name && (
          <p className="text-xs text-destructive">{formErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="rounded-full"
          value={formData.email}
          onChange={handleInputChange("email")}
          disabled={isLoading}
        />
        {formErrors.email && (
          <p className="text-xs text-destructive">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          className="rounded-full"
          value={formData.password}
          onChange={handleInputChange("password")}
          disabled={isLoading}
        />
        {formData.password && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${passwordStrength < 40
                    ? "bg-red-500"
                    : passwordStrength < 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Password strength:{" "}
              {passwordStrength < 40
                ? "Weak"
                : passwordStrength < 80
                  ? "Medium"
                  : "Strong"}
            </div>
            <div className="space-y-1">
              {passwordRequirements.map((requirement, index) => {
                const isMet = requirement.test(formData.password);
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {isMet ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={isMet ? "text-green-600" : "text-red-600"}>
                      {requirement.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {formErrors.password && (
          <p className="text-xs text-destructive">{formErrors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          className="rounded-full"
          value={formData.confirmPassword}
          onChange={handleInputChange("confirmPassword")}
          disabled={isLoading}
        />
        {formErrors.confirmPassword && (
          <p className="text-xs text-destructive">
            {formErrors.confirmPassword}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
