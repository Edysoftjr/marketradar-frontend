import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import NotificationPanel from "@/components/notifications/notification-panel"
import type { DashboardData } from "@/types"
import { LogOut } from "lucide-react"

export default function DashboardHeader({
    onLogout,
    accessToken,
}: {
    onLogout: () => void
    accessToken: string
    userProfile: DashboardData["user"]
}) {
    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo & Brand */}
                    <Link href="/dashboard" className="flex items-center min-w-0 flex-1 sm:flex-none">
                        <div className="flex items-center space-x-3 group">
                            <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-200">
                                <Image
                                    alt="FoodRadar App"
                                    src="/foodrlogo.png"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                                    priority
                                />
                            </div>
                            <div className="">
                                <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                                    MarketRadar
                                </h1>
                            </div>
                        </div>
                    </Link>

                    {/* Action Items */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <NotificationPanel accessToken={accessToken} />
                        <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2 bg-transparent">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}