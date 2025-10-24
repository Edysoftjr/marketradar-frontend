"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { DashboardErrorProps } from "@/types";

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We encountered an error while loading your dashboard. This might be
            a temporary issue.
          </p>

          <div className="space-y-2">
            <Button onClick={reset} className="w-full" variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>

            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full"
              variant="outline"
            >
              Go to Login
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error details (development only)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
