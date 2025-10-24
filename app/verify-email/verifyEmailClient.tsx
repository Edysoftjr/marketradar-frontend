"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
type VerificationStatus = "loading" | "success" | "error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/auth";

const STATUS_CONFIG = {
    loading: {
        icon: Loader2,
        iconClass: "h-6 w-6 text-gray-600 animate-spin",
        title: "Verifying Email...",
        description: "Please wait while we verify your email address.",
    },
    success: {
        icon: CheckCircle,
        iconClass: "h-6 w-6 text-green-600",
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
    },
    error: {
        icon: XCircle,
        iconClass: "h-6 w-6 text-red-600",
        title: "Verification Failed",
        description: "We encountered an issue verifying your email.",
    },
} as const;

// API Functions
const verifyEmailToken = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/verify-email/${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    return result;
};

const resendVerificationEmail = async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();

    return result;
};

// Sub-components
interface StatusIconProps {
    status: VerificationStatus;
}

const StatusIcon = ({ status }: StatusIconProps) => {
    const config = STATUS_CONFIG[status];
    const IconComponent = config.icon;

    return (
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <IconComponent className={config.iconClass} />
        </div>
    );
};

interface StatusMessageProps {
    status: VerificationStatus;
    message: string;
}

const StatusMessage = ({ status, message }: StatusMessageProps) => {
    if (!message) return null;

    const getAlertClassName = () => {
        switch (status) {
            case "success":
                return "border-green-200 bg-green-50 text-green-800";
            case "error":
                return "border-red-200 bg-red-50 text-red-800";
            default:
                return "";
        }
    };

    return (
        <Alert className={getAlertClassName()}>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
};

const LoadingState = () => (
    <div className="text-center">
        <p className="text-sm text-gray-600">This may take a few moments...</p>
    </div>
);

interface SuccessStateProps {
    onGoToDashboard: () => void;
    onGoToLogin: () => void;
}

const SuccessState = ({ onGoToDashboard, onGoToLogin }: SuccessStateProps) => (
    <div className="space-y-3">
        <Button onClick={onGoToDashboard} className="w-full">
            Go to Dashboard
        </Button>
        <Button variant="outline" onClick={onGoToLogin} className="w-full">
            Go to Login
        </Button>
    </div>
);

interface ErrorStateProps {
    email: string;
    onEmailChange: (email: string) => void;
    onGoToLogin: () => void;
    onResendVerification: () => void;
    isResending: boolean;
}

const ErrorState = ({
    email,
    onEmailChange,
    onGoToLogin,
    onResendVerification,
    isResending,
}: ErrorStateProps) => (
    <div className="space-y-3">
        <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
            />
        </div>
        <Button onClick={onGoToLogin} className="w-full">
            Go to Login
        </Button>
        <Button
            variant="outline"
            onClick={onResendVerification}
            disabled={isResending}
            className="w-full"
        >
            {isResending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                </>
            ) : (
                <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                </>
            )}
        </Button>
    </div>
);

const PageHeader = () => (
    <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100">Email Verification</h1>
        <p className="mt-2 text-sm text-gray-200">Verifying your email address</p>
    </div>
);

const PageFooter = () => (
    <div className="text-center">
        <p className="text-xs text-gray-500">Need help? Contact our support team</p>
    </div>
);

// Custom Hook for verification logic
const useEmailVerification = () => {
    const searchParams = useSearchParams();
    const [verificationStatus, setVerificationStatus] =
        useState<VerificationStatus>("loading");
    const [message, setMessage] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setVerificationStatus("error");
            setMessage(
                "Invalid verification link. Please check your email for the correct link."
            );
            return;
        }

        const handleVerification = async () => {
            try {
                console.log("Attempting to verify email with token:", token);
                const result = await verifyEmailToken(token);

                if (result.success) {
                    setVerificationStatus("success");
                    setMessage(result.message || "Email verified successfully!");
                } else {
                    setVerificationStatus("error");
                    setMessage(result.message || "Email verification failed.");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setVerificationStatus("error");
                setMessage("An unexpected error occurred. Please try again.");
            }
        };

        handleVerification();
    }, [searchParams]);

    const handleResendVerification = async () => {
        if (!email) {
            setMessage("Please enter your email address to resend verification.");
            return;
        }

        setIsResending(true);
        try {
            const result = await resendVerificationEmail(email);

            if (result.success) {
                setMessage(
                    "Verification email sent successfully! Please check your inbox."
                );
                setVerificationStatus("loading");
            } else {
                setMessage(result.message || "Failed to resend verification email.");
            }
        } catch (error) {
            console.error("Resend error:", error);
            setMessage("An error occurred while resending the verification email.");
        } finally {
            setIsResending(false);
        }
    };

    return {
        verificationStatus,
        message,
        email,
        setEmail,
        isResending,
        handleResendVerification,
    };
};

// Main Component
export default function VerifyEmailPage() {
    const router = useRouter();
    const {
        verificationStatus,
        message,
        email,
        setEmail,
        isResending,
        handleResendVerification,
    } = useEmailVerification();

    const config = STATUS_CONFIG[verificationStatus];

    const handleGoToLogin = () => router.push("/login");
    const handleGoToDashboard = () => router.push("/home");

    const renderContent = () => {
        switch (verificationStatus) {
            case "loading":
                return <LoadingState />;
            case "success":
                return (
                    <SuccessState
                        onGoToDashboard={handleGoToDashboard}
                        onGoToLogin={handleGoToLogin}
                    />
                );
            case "error":
                return (
                    <ErrorState
                        email={email}
                        onEmailChange={setEmail}
                        onGoToLogin={handleGoToLogin}
                        onResendVerification={handleResendVerification}
                        isResending={isResending}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <PageHeader />

                <Card>
                    <CardHeader className="text-center">
                        <StatusIcon status={verificationStatus} />
                        <CardTitle className="mt-4">{config.title}</CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <StatusMessage status={verificationStatus} message={message} />
                        {renderContent()}
                    </CardContent>
                </Card>

                <PageFooter />
            </div>
        </div>
    );
}
