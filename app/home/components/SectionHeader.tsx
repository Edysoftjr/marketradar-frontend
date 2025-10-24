import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface SectionHeaderProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    title: string
    subtitle: string
    actionText?: string
    onAction?: () => void
    viewAllHref?: string
    viewAllCategory?: string
}

const SectionHeader = ({
    icon: Icon,
    title,
    subtitle,
    actionText,
    onAction,
    viewAllHref,
    viewAllCategory,
}: SectionHeaderProps) => (
    <div className="flex items-center justify-between mb-6 sm:mb-12">
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-primary/90 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-xl sm:rounded-2xl blur-sm -z-10" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
                <h2 className="text-xl sm:text-3xl font-bold">{title}</h2>
                <p className="text-xs sm:text-base text-muted-foreground">{subtitle}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {viewAllHref && (
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-primary"
                >
                    <Link
                        href={`${viewAllHref}${viewAllCategory ? `?category=${viewAllCategory}` : ""}`}
                        className="flex items-center gap-1"
                    >
                        View All
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            )}
            {actionText && onAction && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAction}
                    className="hidden sm:flex rounded-xl border-0 bg-muted/40 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20"
                >
                    {actionText}
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            )}
        </div>
    </div>
)

export default SectionHeader