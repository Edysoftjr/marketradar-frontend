/* eslint-disable */
import React from "react"
import { StatusBadge } from "./StatusBadge"
import type { Order, ViewMode } from "../types/OrderTypes"

interface OrderCardProps {
    order: Order
    onClick: () => void
    isVendor: boolean
    viewMode: ViewMode
}

export const OrderCard: React.FC<OrderCardProps> = React.memo(({ order, onClick, isVendor, viewMode }) => {
    const itemCount = order.items?.length ?? 0

    return (
        <div
            onClick={onClick}
            className="bg-card text-card-foreground rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-border hover:border-primary group"
            role="article"
            aria-label={`Order ${order.id.slice(-8)}`}
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-foreground mb-1">Order #{order.id.slice(-8).toUpperCase()}</h3>
                        <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {viewMode === "detailed" && (
                    <div className="mb-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment:</span>
                            <span className="font-medium text-foreground capitalize">{order.paymentStatus.toLowerCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Items:</span>
                            <span className="font-medium text-foreground">{itemCount}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="text-2xl font-bold text-foreground">
                        ₦{order.total?.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    )
})

OrderCard.displayName = "OrderCard"
