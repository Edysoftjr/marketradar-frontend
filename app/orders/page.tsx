/* eslint-disable */
"use client"

import React, { useEffect, useState, useCallback } from "react"
import {
  Clock,
  Package,
  AlertCircle,
  RefreshCw,
  Grid3x3,
  List
} from "lucide-react"
import type { Order, ViewMode } from "./types/OrderTypes"
import { OrderCard } from "./components/OrderCard"
import { OrderDetails } from "./components/OrderDetails"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function OrdersPage() {
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [vendorOrders, setVendorOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isVendor, setIsVendor] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string>("")
  const [viewMode, setViewMode] = useState<ViewMode>("detailed")
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const fetchOrders = useCallback(async (token: string) => {
    setLoading(true)
    setError("")

    try {
      const userRes = await fetch(`${API_BASE_URL}/orders/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!userRes.ok) {
        if (userRes.status === 401) {
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to fetch orders")
      }

      if (userRes.ok) {
        const userOrdersData: Order[] = await userRes.json()
        setUserOrders(Array.isArray(userOrdersData) ? userOrdersData : [])
        setIsVendor(userOrdersData.length > 0)
      }

      try {
        const vendorRes = await fetch(`${API_BASE_URL}/orders/vendor/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (vendorRes.ok) {
          const vendorOrdersData: Order[] = await vendorRes.json()
          const vendorOrdersList = Array.isArray(vendorOrdersData) ? vendorOrdersData : []
          setVendorOrders(vendorOrdersList)
          setIsVendor(vendorOrdersList.length > 0)
        } else {
          setVendorOrders([])
          setIsVendor(false)
        }
      } catch (vendorErr) {
        console.log("[OrdersPage] User is not a vendor")
        setVendorOrders([])
        setIsVendor(false)
      }
    } catch (err: unknown) {
      console.error("[OrdersPage] Fetch error:", err)
      const errMsg = err instanceof Error ? err.message : "Failed to fetch orders. Please try again."
      setError(errMsg)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || ""
    setAccessToken(token)

    if (token) {
      fetchOrders(token)
    } else {
      setLoading(false)
      setError("Please login to view orders")
    }
  }, [fetchOrders])

  const handleRefresh = useCallback(() => {
    if (accessToken && !refreshing) {
      setRefreshing(true)
      fetchOrders(accessToken)
    }
  }, [accessToken, refreshing, fetchOrders])

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "detailed" ? "compact" : "detailed"))
  }, [])

  const totalUserOrders = userOrders.length
  const totalVendorOrders = vendorOrders.length
  const hasOrders = totalUserOrders > 0 || totalVendorOrders > 0
  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        accessToken={accessToken}
        isUserOrder={selectedOrder.isUser}
        isVendorOrder={selectedOrder.isVendor}
        onRefresh={handleRefresh}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Orders</h1>
            {hasOrders && !loading && (
              <p className="text-muted-foreground mt-1">
                {totalUserOrders > 0 && `${totalUserOrders} personal order${totalUserOrders !== 1 ? "s" : ""}`}
                {totalUserOrders > 0 && totalVendorOrders > 0 && " • "}
                {totalVendorOrders > 0 && `${totalVendorOrders} vendor order${totalVendorOrders !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {hasOrders && (
              <button
                onClick={toggleViewMode}
                className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
                aria-label={`Switch to ${viewMode === "detailed" ? "compact" : "detailed"} view`}
              >
                {viewMode === "detailed" ? <Grid3x3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                <span className="hidden sm:inline">{viewMode === "detailed" ? "Compact" : "Detailed"}</span>
              </button>
            )}

            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh orders"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-12 h-12 mb-4 text-destructive" />
            <p className="text-destructive text-center mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !hasOrders ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Your orders will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {userOrders.length > 0 && (
              <section aria-label="Personal orders">
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Your Orders ({userOrders.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onClick={() => setSelectedOrder(order)}
                      isVendor={false}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {isVendor && vendorOrders.length > 0 && (
              <section aria-label="Vendor orders">
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Vendor Orders ({vendorOrders.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vendorOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onClick={() => setSelectedOrder(order)}
                      isVendor={true}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
    </div>
  )
}