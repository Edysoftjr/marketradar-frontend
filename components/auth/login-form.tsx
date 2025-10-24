"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useAuthContext } from "./auth-provider";

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// Types for response handling
type ResponseType = "success" | "error" | "warning" | "info";

interface ResponseState {
  show: boolean;
  type: ResponseType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const ResponseNotification: React.FC<{
  response: ResponseState;
  onClose: () => void;
}> = ({ response, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (response.show) {
      setIsVisible(true);
      setIsExiting(false);

      if (response.autoClose !== false) {
        const duration =
          response.duration || (response.type === "success" ? 5000 : 7000);
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [
    response.show,
    response.autoClose,
    response.duration,
    response.type,
    handleClose,
  ]);

  if (!response.show || !isVisible) return null;

  const getIcon = () => {
    switch (response.type) {
      case "success":
        return (
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        );
      case "error":
        return (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        );
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "backdrop-blur-sm border shadow-xl";
    switch (response.type) {
      case "success":
        return `${baseStyles} bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200/50 dark:border-emerald-800/50`;
      case "error":
        return `${baseStyles} bg-red-50/95 dark:bg-red-950/95 border-red-200/50 dark:border-red-800/50`;
      case "warning":
        return `${baseStyles} bg-amber-50/95 dark:bg-amber-950/95 border-amber-200/50 dark:border-amber-800/50`;
      default:
        return `${baseStyles} bg-blue-50/95 dark:bg-blue-950/95 border-blue-200/50 dark:border-blue-800/50`;
    }
  };

  const getTextStyles = () => {
    switch (response.type) {
      case "success":
        return {
          title: "text-emerald-900 dark:text-emerald-100",
          message: "text-emerald-800 dark:text-emerald-200",
        };
      case "error":
        return {
          title: "text-red-900 dark:text-red-100",
          message: "text-red-800 dark:text-red-200",
        };
      case "warning":
        return {
          title: "text-amber-900 dark:text-amber-100",
          message: "text-amber-800 dark:text-amber-200",
        };
      default:
        return {
          title: "text-blue-900 dark:text-blue-100",
          message: "text-blue-800 dark:text-blue-200",
        };
    }
  };

  const textStyles = getTextStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-out ${isExiting
        ? "animate-out fade-out-0 slide-out-to-right-2 duration-300"
        : "animate-in fade-in-0 slide-in-from-top-2 duration-500"
        }`}
    >
      <div className={`p-4 rounded-xl ${getStyles()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 space-y-1 min-w-0">
            <h4
              className={`font-semibold text-sm leading-tight ${textStyles.title}`}
            >
              {response.title}
            </h4>
            <p className={`text-sm leading-relaxed ${textStyles.message}`}>
              {response.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
          >
            <X className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {/* Progress bar for auto-close */}
        {response.autoClose !== false && (
          <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ease-linear ${response.type === "success"
                ? "bg-emerald-500"
                : response.type === "error"
                  ? "bg-red-500"
                  : response.type === "warning"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              style={{
                animation: `shrink ${response.duration ||
                  (response.type === "success" ? 5000 : 7000)
                  }ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { login, isLoading, clearError } = useAuthContext();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [response, setResponse] = useState<ResponseState>({
    show: false,
    type: "info",
    title: "",
    message: "",
    autoClose: true,
    duration: 5000,
  });

  const showResponse = (
    type: ResponseType,
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    setResponse({
      show: true,
      type,
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration:
        options?.duration ??
        (type === "success" ? 5000 : type === "error" ? 8000 : 6000),
    });
  };

  const closeResponse = () => {
    setResponse((prev) => ({ ...prev, show: false }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

      // Clear field-specific error when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear any auth error when user starts typing
      clearError();

      // Close any existing response notification
      if (response.show) {
        closeResponse();
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Close any existing notifications
    if (response.show) {
      closeResponse();
    }

    if (!validateForm()) return;

    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        showResponse(
          "success",
          "Welcome back!",
          "You have been successfully logged in. Redirecting...",
          { duration: 3000 }
        );

        // Wait a moment to show success message before redirecting
        setTimeout(() => {
          onSuccess?.();
          router.push("/home");
        }, 1500);
      } else {
        // Handle specific error cases with appropriate messaging
        const errorTitle = result.message?.toLowerCase().includes("password")
          ? "Incorrect Password"
          : result.message?.toLowerCase().includes("email") ||
            result.message?.toLowerCase().includes("user")
            ? "Account Not Found"
            : result.message?.toLowerCase().includes("verified")
              ? "Email Not Verified"
              : "Login Failed";

        showResponse(
          "error",
          errorTitle,
          result.message ||
          "Invalid email or password. Please check your credentials and try again.",
          { duration: 8000 }
        );
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      let errorMessage = "An unexpected error occurred during login.";
      let errorTitle = "Login Failed";

      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.toLowerCase().includes("network")) {
          errorTitle = "Connection Error";
          errorMessage =
            "Unable to connect to the server. Please check your internet connection and try again.";
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      showResponse("error", errorTitle, errorMessage, { duration: 10000 });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-xs text-red-600 dark:text-red-400">
              {formErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="rounded-full"
            value={formData.password}
            onChange={handleInputChange("password")}
            disabled={isLoading}
          />
          {formErrors.password && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {formErrors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <ResponseNotification response={response} onClose={closeResponse} />
    </>
  );
}
