"use client"

import type React from "react"
import Image from "next/image"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StallWithDetails } from "@/types/stall"
import {
    Star,
    Users,
    MapPin,
    Sparkles,
    Eye
} from "lucide-react"
import { formatLabel } from "@/constants/stallTypes"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const StallCard = ({
    stall,
    featured = false,
    router,
}: {
    stall: StallWithDetails
    featured?: boolean
    router: AppRouterInstance
}) => {
    const image = (stall.images[0] == "/defaults/stall.png") ? `${API_BASE_URL}/uploads/defaults/stall.png` : stall.images?.length
        ? `${API_BASE_URL}${stall.images[0]}`
        : "/rest1.jpg";
    const avgRating = stall.avgRating ?? 0
    const metrics = stall.metrics ?? {}

    return (
        <Card
            className={`group cursor-pointer transition-all duration-700 transform hover:-translate-y-2 sm:hover:-translate-y-4 ${featured ? "shadow-2xl shadow-primary/10" : "shadow-md sm:shadow-lg shadow-black/5 dark:shadow-black/20"
                } hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/15 bg-card/60 backdrop-blur-xl overflow-hidden border border-border/50 sm:border-0 rounded-2xl sm:rounded-3xl`}
        >
            <div className="relative">
                {/* Image Container */}
                <div className={`aspect-[4/3] relative overflow-hidden ${featured ? "sm:aspect-[16/10]" : ""}`}>
                    <Image
                        src={image || "/placeholder.svg"}
                        alt={stall.name}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/rest1.jpg"
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />

                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                        {featured && (
                            <Badge className="bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white border-0 shadow-lg shadow-amber-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 text-xs">
                                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                Featured
                            </Badge>
                        )}
                        <Badge className="bg-black/30 text-white backdrop-blur-xl border-0 shadow-lg rounded-lg sm:rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 font-medium text-xs">
                            {formatLabel(stall.type)}
                        </Badge>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Button
                            onClick={() => {
                                router.push(`/stall/${stall.id}`)
                            }}
                            size="sm"
                            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transform scale-0 group-hover:scale-100 transition-all duration-300 delay-100 rounded-xl sm:rounded-2xl shadow-xl text-xs sm:text-sm"
                        >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                        </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
                        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                            {avgRating > 0 && (
                                <div className="flex items-center gap-1 sm:gap-2 bg-black/20 backdrop-blur-xl px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10">
                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 sm:gap-2 bg-black/20 backdrop-blur-xl px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="font-semibold">{metrics.subscribers || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-3 sm:p-6 space-y-2 sm:space-y-4">
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start justify-between">
                            <h3 className="font-bold text-base sm:text-xl group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                {stall.name}
                            </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                            {stall.description || "Discover amazing food at this local stall"}
                        </p>

                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground p-2 sm:p-3 bg-muted/30 rounded-xl sm:rounded-2xl border border-border/30">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                            <span className="truncate font-medium">
                                {stall.area}, {stall.city}, {stall.state}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-4">
                        <div className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 border border-blue-200/30 dark:border-blue-800/30">
                            <div className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                                {metrics.products || 0}
                            </div>
                            <div className="text-[10px] sm:text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">Products</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10 border border-green-200/30 dark:border-green-800/30">
                            <div className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                                {metrics.reviews || 0}
                            </div>
                            <div className="text-[10px] sm:text-xs text-green-600/70 dark:text-green-400/70 font-medium">Reviews</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-800/10 border border-amber-200/30 dark:border-amber-800/30">
                            <div className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                                {avgRating.toFixed(1)}
                            </div>
                            <div className="text-[10px] sm:text-xs text-amber-600/70 dark:text-amber-400/70 font-medium">Rating</div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

export default StallCard