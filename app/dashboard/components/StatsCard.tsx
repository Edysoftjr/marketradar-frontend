import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardData } from "@/types"
import { TrendingUp } from "lucide-react"

export default function StatsCard({
    stats,
    orderCount,
    isVendor,
}: {
    stats: DashboardData["stats"]
    orderCount: number
    isVendor: boolean
}) {
    return (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    <span>Your Stats</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="text-3xl font-bold text-blue-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                            {orderCount ? orderCount : stats.orders}
                        </div>
                        <div className="text-sm font-semibold text-blue-700/80">Orders</div>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="text-3xl font-bold text-emerald-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                            {stats.favorites}
                        </div>
                        <div className="text-sm font-semibold text-emerald-700/80">Favorites</div>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="text-center p-5 bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-xl border border-violet-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="text-3xl font-bold text-violet-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                            {stats.stallSubscribers}
                        </div>
                        <div className="text-sm font-semibold text-violet-700/80">
                            {isVendor ? "Stall Subscribers" : "Followers"}
                        </div>

                        <div className="w-8 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="text-3xl font-bold text-amber-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                            {stats.reviews}
                        </div>
                        <div className="text-sm font-semibold text-amber-700/80">Reviews</div>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2 rounded-full"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}