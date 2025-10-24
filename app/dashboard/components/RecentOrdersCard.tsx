"use client"
import { useState } from "react"
import Image from "next/image"
import {
    User,
    ShoppingCart,
    ChevronRight,
    Clock,
    Store,
    Package,
} from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RecentOrder, VendorRecentOrder, OrderStatus } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

type RecentOrdersCardProps = {
    orders: RecentOrder[]
    vendorOrders?: VendorRecentOrder[]
    isVendor?: boolean
    router: AppRouterInstance
}


const statusConfig: Record<OrderStatus, { color: string; bgColor: string; label: string }> = {
    PAID: { color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200", label: "Paid" },
    PENDING: { color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", label: "Pending" },
    PROCESSING: { color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200", label: "Processing" },
    COMPLETED: { color: "text-green-700", bgColor: "bg-green-50 border-green-200", label: "Delivered" },
    CANCELLED: { color: "text-red-700", bgColor: "bg-red-50 border-red-200", label: "Cancelled" },
}

export default function RecentOrdersCard({ orders, vendorOrders = [], isVendor = false, router }: RecentOrdersCardProps) {
    const viewOrders = (route: string) => router.push(route)
    const [viewMode, setViewMode] = useState<"my-orders" | "vendor-orders">("my-orders")

    const displayOrders = viewMode === "my-orders" ? orders : vendorOrders
    const hasVendorOrders = isVendor && vendorOrders.length > 0

    return (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Recent Orders</span>
                    </CardTitle>
                    {hasVendorOrders && (
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === "my-orders" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("my-orders")}
                                className="h-8 text-xs"
                            >
                                My Orders
                            </Button>
                            <Button
                                variant={viewMode === "vendor-orders" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("vendor-orders")}
                                className="h-8 text-xs"
                            >
                                Vendor Orders
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {displayOrders.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {viewMode === "my-orders" ? "No orders yet" : "No vendor orders yet"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayOrders.map((order) => {
                            const isVendorOrder = "customer" in order
                            const status = statusConfig[order.status]

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => {
                                        viewOrders("/orders")
                                    }}
                                    className="group relative p-3 sm:p-4 rounded-xl border bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted">
                                                {order.images[0] ? (
                                                    <Image
                                                        src={`${API_BASE_URL}${order.images[0]}`}
                                                        alt={order.productName}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            {order.images.length > 1 && (
                                                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-sm">
                                                    +{order.images.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors flex-1 leading-snug">
                                                    {order.productName}
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className={`${status.bgColor} ${status.color} text-[10px] sm:text-xs font-semibold shrink-0 whitespace-nowrap`}
                                                >
                                                    {status.label}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 mt-auto">
                                                {isVendorOrder ? (
                                                    <>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                                            <span className="truncate">{order.customer}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                                            <span className="truncate">{order.stall}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                                        <span className="truncate">{order.vendor}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                                        <span className="whitespace-nowrap">{order.date}</span>
                                                    </div>
                                                    <span className="text-sm sm:text-base font-bold text-foreground whitespace-nowrap">
                                                        {order.amount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}