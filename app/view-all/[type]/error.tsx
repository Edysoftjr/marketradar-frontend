"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorPageProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center px-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong!</h2>
                <p className="text-muted-foreground mb-6">{error.message}</p>
                <Button onClick={reset}>Try again</Button>
            </div>
        </div>
    )
}