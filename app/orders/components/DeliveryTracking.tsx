"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import {
    CheckCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    Phone,
    Play,
    Pause,
    XCircle,
    DollarSign,
    MapPin,
    Navigation,
    ArrowLeft
} from "lucide-react"
import type { Order } from "../types/OrderTypes"

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "YOUR_GEOAPIFY_API_KEY"

// ==================== Delivery Tracking Component ====================

interface DeliveryTrackingProps {
    order: Order
    onClose: () => void
    accessToken: string
    onRefresh?: () => void
}

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = React.memo(({ order, onClose, accessToken, onRefresh }) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [routeData, setRouteData] = useState<any>(null)
    const [deliveryStatus, setDeliveryStatus] = useState<string>(order.deliveryStatus || "IDLE")
    const [actionLoading, setActionLoading] = useState<string>("")
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const initializeMap = useCallback(async () => {
        if (!mapRef.current || !order.geolocation) {
            setError("Location data not available")
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError("")

            const { vendorLatitude, vendorLongitude, userLatitude, userLongitude } = order.geolocation

            const L = (await import("leaflet")).default

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
            }

            const centerLat = (vendorLatitude + userLatitude) / 2
            const centerLng = (vendorLongitude + userLongitude) / 2

            const map = L.map(mapRef.current).setView([centerLat, centerLng], 13)
            mapInstanceRef.current = map

            L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`, {
                attribution: "© Geoapify | © OpenStreetMap",
                maxZoom: 20,
            }).addTo(map)

            const vendorIcon = L.divIcon({
                html: `<div style="background: hsl(var(--primary)); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg></div>`,
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            })

            const customerIcon = L.divIcon({
                html: `<div style="background: hsl(var(--accent)); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            })

            L.marker([vendorLatitude, vendorLongitude], { icon: vendorIcon })
                .addTo(map)
                .bindPopup("<strong>Vendor Location</strong><br>Order pickup point")

            L.marker([userLatitude, userLongitude], { icon: customerIcon })
                .addTo(map)
                .bindPopup("<strong>Customer Location</strong><br>Delivery destination")

            await fetchRoute(vendorLatitude, vendorLongitude, userLatitude, userLongitude, map, L)
        } catch (err: unknown) {
            console.error("[DeliveryTracking] Map error:", err)
            setError(err instanceof Error ? err.message : "Failed to load map")
        } finally {
            setLoading(false)
        }
    }, [order.geolocation])

    const fetchRoute = async (fromLat: number, fromLng: number, toLat: number, toLng: number, map: any, L: any) => {
        try {
            const response = await fetch(
                `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`,
            )

            if (!response.ok) throw new Error("Failed to fetch route")

            const data = await response.json()
            setRouteData(data)

            if (data.features && data.features.length > 0) {
                const route = data.features[0]
                const coordinates = route.geometry.coordinates[0]
                const latlngs = coordinates.map((coord: number[]) => [coord[1], coord[0]])

                L.polyline(latlngs, {
                    color: "hsl(var(--primary))",
                    weight: 5,
                    opacity: 0.7,
                    smoothFactor: 1,
                }).addTo(map)

                const bounds = L.latLngBounds(latlngs)
                map.fitBounds(bounds, { padding: [50, 50] })
            }
        } catch (err) {
            console.error("[DeliveryTracking] Route error:", err)
        }
    }

    const handleDeliveryAction = useCallback(
        async (action: string, status?: string) => {
            setActionLoading(action)
            setMessage(null)

            try {
                const endpoint =
                    action === "refund"
                        ? `${API_BASE_URL}/orders/${order.id}/refund`
                        : `${API_BASE_URL}/orders/${order.id}/delivery-status`

                const body = action === "refund" ? { reason: "Customer request" } : { deliveryStatus: status }

                const res = await fetch(endpoint, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body),
                })

                if (!res.ok) {
                    const errorText = await res.text()
                    throw new Error(`HTTP ${res.status}: ${errorText}`)
                }

                const actionMessages: Record<string, string> = {
                    start: "Delivery started successfully!",
                    pause: "Delivery paused",
                    resume: "Delivery resumed",
                    deliver: "Order delivered successfully!",
                    cancel: "Delivery cancelled",
                    refund: "Refund initiated successfully",
                }

                setMessage({ type: "success", text: actionMessages[action] || "Action completed" })

                if (status) setDeliveryStatus(status)

                setTimeout(() => {
                    if (action === "cancel" || action === "refund" || action === "deliver") {
                        onRefresh?.()
                        onClose()
                    }
                }, 1500)
            } catch (err: unknown) {
                console.error(`[DeliveryTracking] ${action} error:`, err)
                const errMsg = err instanceof Error ? err.message : `Failed to ${action} delivery`
                setMessage({ type: "error", text: errMsg })
            } finally {
                setActionLoading("")
            }
        },
        [order.id, accessToken, onRefresh, onClose],
    )

    const handleCall = useCallback(() => {
        if (order.user?.phoneNumber) {
            window.location.href = `tel:${order.user?.phoneNumber}`
        } else {
            setMessage({ type: "error", text: "Customer phone number not available" })
        }
    }, [order.user?.phoneNumber])

    const handleRefreshRoute = useCallback(() => {
        initializeMap()
        setMessage({ type: "success", text: "Route refreshed" })
    }, [initializeMap])

    useEffect(() => {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Wait for styles to load before initializing map
        link.onload = () => {
            setTimeout(() => {
                initializeMap()
            }, 100)
        }

        return () => {
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove()
                    mapInstanceRef.current = null
                } catch (e) {
                    console.error("Error removing map:", e)
                }
            }
            link.remove()
        }
    }, [initializeMap])

    const distance = routeData?.features?.[0]?.properties?.distance
        ? (routeData.features[0].properties.distance / 1000).toFixed(2)
        : "N/A"

    const duration = routeData?.features?.[0]?.properties?.time
        ? Math.round(routeData.features[0].properties.time / 60)
        : "N/A"

    const deliveryStatusColors: Record<string, string> = {
        IDLE: "bg-muted text-muted-foreground",
        IN_TRANSIT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        PAUSED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
            <div className="bg-card text-card-foreground rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[95vh] overflow-hidden border-0 sm:border border-border flex flex-col">
                {/* Header - Fixed height */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 flex-shrink-0">
                    <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <button
                                onClick={onClose}
                                className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                                aria-label="Close"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg sm:text-2xl font-bold text-primary-foreground truncate">Delivery Tracking</h2>
                                <p className="text-primary-foreground/80 text-xs sm:text-sm truncate">
                                    Order #{order.id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 ${deliveryStatusColors[deliveryStatus] || deliveryStatusColors.IDLE}`}
                        >
                            {deliveryStatus.replace("_", " ")}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                            <div className="flex items-center gap-1 sm:gap-2 text-primary-foreground/70 text-xs mb-0.5 sm:mb-1">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">Distance</span>
                            </div>
                            <p className="text-base sm:text-2xl font-bold text-primary-foreground truncate">{distance} km</p>
                        </div>
                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                            <div className="flex items-center gap-1 sm:gap-2 text-primary-foreground/70 text-xs mb-0.5 sm:mb-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">ETA</span>
                            </div>
                            <p className="text-base sm:text-2xl font-bold text-primary-foreground truncate">{duration} min</p>
                        </div>
                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                            <div className="flex items-center gap-1 sm:gap-2 text-primary-foreground/70 text-xs mb-0.5 sm:mb-1">
                                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">Amount</span>
                            </div>
                            <p className="text-base sm:text-2xl font-bold text-primary-foreground truncate">
                                ₦{order.total?.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
                        {error ? (
                            <div className="text-center py-8 sm:py-12">
                                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto mb-2 sm:mb-3" />
                                <p className="text-destructive mb-3 sm:mb-4 text-sm sm:text-base px-4">{error}</p>
                                <button
                                    onClick={initializeMap}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Map Container - Fixed height with proper containment */}
                                <div className="relative w-full">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-[280px] sm:h-[320px] md:h-[400px] rounded-lg sm:rounded-xl overflow-hidden border border-border sm:border-2 shadow-lg"
                                    />
                                    {loading && (
                                        <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm flex items-center justify-center rounded-lg sm:rounded-xl">
                                            <div className="text-center">
                                                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary mx-auto mb-2" />
                                                <p className="text-xs sm:text-sm text-muted-foreground">Loading map...</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleRefreshRoute}
                                        disabled={loading}
                                        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-card text-card-foreground p-1.5 sm:p-2 rounded-lg shadow-lg hover:bg-accent transition-colors disabled:opacity-50 z-[1000] border border-border"
                                        aria-label="Refresh route"
                                    >
                                        <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? "animate-spin" : ""}`} />
                                    </button>
                                </div>

                                {/* Message Alert */}
                                {message && (
                                    <div
                                        className={`p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${message.type === "success"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                    >
                                        {message.type === "success" ? (
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                        )}
                                        <span className="font-medium">{message.text}</span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    {(deliveryStatus === "IDLE" || deliveryStatus === "PAUSED") && (
                                        <button
                                            onClick={() => handleDeliveryAction(deliveryStatus === "IDLE" ? "start" : "resume", "IN_TRANSIT")}
                                            disabled={!!actionLoading}
                                            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base"
                                        >
                                            {actionLoading === "start" || actionLoading === "resume" ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                    <span className="hidden xs:inline">Processing...</span>
                                                    <span className="xs:hidden">...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="hidden xs:inline">
                                                        {deliveryStatus === "IDLE" ? "Begin Delivery" : "Resume"}
                                                    </span>
                                                    <span className="xs:hidden">{deliveryStatus === "IDLE" ? "Start" : "Resume"}</span>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {deliveryStatus === "IN_TRANSIT" && (
                                        <>
                                            <button
                                                onClick={() => handleDeliveryAction("pause", "PAUSED")}
                                                disabled={!!actionLoading}
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base"
                                            >
                                                {actionLoading === "pause" ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                        <span className="hidden xs:inline">Pausing...</span>
                                                        <span className="xs:hidden">...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        Pause
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleDeliveryAction("deliver", "DELIVERED")}
                                                disabled={!!actionLoading}
                                                className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base"
                                            >
                                                {actionLoading === "deliver" ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                        <span className="hidden xs:inline">Delivering...</span>
                                                        <span className="xs:hidden">...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        <span className="hidden xs:inline">Mark Delivered</span>
                                                        <span className="xs:hidden">Delivered</span>
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={handleCall}
                                        disabled={!order.user?.phoneNumber}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base"
                                    >
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden xs:inline">Call User</span>
                                        <span className="xs:hidden">Call</span>
                                    </button>

                                    <button
                                        onClick={() => handleDeliveryAction("cancel", "CANCELLED")}
                                        disabled={!!actionLoading || deliveryStatus === "CANCELLED" || deliveryStatus === "DELIVERED"}
                                        className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base"
                                    >
                                        {actionLoading === "cancel" ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                <span className="hidden xs:inline">Cancelling...</span>
                                                <span className="xs:hidden">...</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Cancel
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDeliveryAction("refund")}
                                        disabled={!!actionLoading || deliveryStatus === "DELIVERED"}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg col-span-2 text-sm sm:text-base"
                                    >
                                        {actionLoading === "refund" ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                <span className="hidden xs:inline">Processing...</span>
                                                <span className="xs:hidden">...</span>
                                            </>
                                        ) : (
                                            <>
                                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="hidden xs:inline">Refund Order</span>
                                                <span className="xs:hidden">Refund</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Route Information */}
                                {routeData && (
                                    <div className="bg-muted rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border">
                                        <h3 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            Route Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                            <div>
                                                <p className="text-muted-foreground mb-0.5 sm:mb-1">Total Distance</p>
                                                <p className="font-semibold text-foreground">{distance} km</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-0.5 sm:mb-1">Estimated Time</p>
                                                <p className="font-semibold text-foreground">{duration} minutes</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-0.5 sm:mb-1">Route Type</p>
                                                <p className="font-semibold text-foreground capitalize">
                                                    {routeData.features?.[0]?.properties?.mode || "Driving"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-0.5 sm:mb-1">Status</p>
                                                <p className="font-semibold text-foreground capitalize">
                                                    {deliveryStatus.replace("_", " ").toLowerCase()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
})

DeliveryTracking.displayName = "DeliveryTracking"