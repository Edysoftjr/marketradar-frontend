import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewAllLinkProps {
    href: string
    className?: string
}

export function ViewAllLink({ href, className = "" }: ViewAllLinkProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={`text-muted-foreground hover:text-primary ${className}`}
            asChild
        >
            <Link href={href} className="flex items-center gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
            </Link>
        </Button>
    )
}