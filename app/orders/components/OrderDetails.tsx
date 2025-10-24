/* eslint-disable */
"use client"

import React, { useState, useCallback, useMemo } from "react"
import {
    Camera,
    CheckCircle,
    Clock,
    Package,
    AlertCircle,
    RefreshCw,
    ChevronRight,
    Scan,
    Phone,
    MapPin,
    Navigation,
    Info,
    CreditCard,
    Store,
    User,
} from "lucide-react"
import type { Order } from "../types/OrderTypes"
import { InfoCard } from "../components/InfoCard"
import { StatusBadge } from "./StatusBadge"
import { DeliveryTracking } from "./DeliveryTracking"
import { QrScanner } from "./QrScanner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface OrderDetailsProps {
    order: Order
    onBack: () => void
    accessToken: string
    isVendorOrder: boolean
    isUserOrder: boolean
    onRefresh?: () => void
}

export const OrderDetails: React.FC<OrderDetailsProps> = React.memo(
    ({ order, onBack, accessToken, isVendorOrder, isUserOrder, onRefresh }) => {
        const [qrCode, setQrCode] = useState<string | null>(null)
        const [showQR, setShowQR] = useState<boolean>(false)
        const [confirming, setConfirming] = useState<boolean>(false)
        const [manualConfirming, setManualConfirming] = useState<boolean>(false)
        const [showScanner, setShowScanner] = useState<boolean>(false)
        const [showDeliveryTracking, setShowDeliveryTracking] = useState<boolean>(false)
        const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

        const fetchQrCode = useCallback(async () => {
            setShowQR(true)
            if (qrCode) return

            try {
                const res = await fetch(`${API_BASE_URL}/orders/${order.id}/qr`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })

                if (!res.ok) throw new Error("Failed to fetch QR")

                const data = await res.json()
                const qr = data?.qrCode ?? data?.qr ?? null
                if (qr) {
                    setQrCode(qr)
                } else {
                    throw new Error("No QR code in response")
                }
            } catch (err: unknown) {
                const errMsg = err instanceof Error ? err.message : "Failed to fetch QR code"
                setMessage({ type: "error", text: errMsg })
            }
        }, [order.id, accessToken, qrCode])

        const handleConfirmOrder = useCallback(
            async (qrData?: string) => {
                setConfirming(true)
                setMessage(null)

                try {
                    const body: { status: string; qrData?: string } = { status: "COMPLETED" }
                    if (qrData) body.qrData = qrData

                    const res = await fetch(`${API_BASE_URL}/orders/${order.id}/status`, {
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

                    setMessage({ type: "success", text: "Order confirmed successfully!" })
                    setShowScanner(false)

                    setTimeout(() => {
                        onRefresh?.()
                    }, 1500)
                } catch (err: unknown) {
                    const errMsg = err instanceof Error ? err.message : "Failed to confirm order"
                    setMessage({ type: "error", text: errMsg })
                } finally {
                    setConfirming(false)
                }
            },
            [order.id, accessToken, onRefresh],
        )

        const manualConfirm = useCallback(async () => {
            if (order.status === "COMPLETED") return

            setManualConfirming(true)
            setMessage(null)

            try {
                const res = await fetch(`${API_BASE_URL}/orders/${order.id}/qr`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })

                if (!res.ok) throw new Error("Failed to fetch QR code")

                const data = await res.json()
                const qrUrl = data?.qrCode ?? data?.qr ?? null
                if (!qrUrl) throw new Error("No QR code available")

                const { BrowserQRCodeReader } = await import("@zxing/browser")
                const reader = new BrowserQRCodeReader()
                const result = await reader.decodeFromImageUrl(qrUrl)
                const qrData = result.getText()

                await handleConfirmOrder(qrData)
            } catch (err: unknown) {
                const errMsg = err instanceof Error ? err.message : "Failed to confirm order manually"
                setMessage({ type: "error", text: errMsg })
            } finally {
                setManualConfirming(false)
            }
        }, [order.id, accessToken, order.status, handleConfirmOrder])

        const totalItems = useMemo(
            () => order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0,
            [order.items],
        )

        const stallInfo = useMemo(() => {
            const firstItem = order.items?.[0]
            return firstItem?.product?.stall || null
        }, [order.items])

        const cardInfo = useMemo(() => {
            if (order.paymentChannel === "card" && order.paymentMeta?.authorization) {
                const auth = order.paymentMeta.authorization
                return {
                    brand: auth.brand?.toUpperCase(),
                    last4: auth.last4,
                    bank: auth.bank,
                }
            }
            return null
        }, [order.paymentChannel, order.paymentMeta])

        const isDelivered = order.status === "COMPLETED"
        const isConfirming = confirming || manualConfirming

        return (
            <div className="max-w-2xl mt-4 mx-auto animate-fadeIn">
                <div className="bg-card text-card-foreground rounded-2xl shadow-lg overflow-hidden border border-border">
                    {/* Header */}
                    <div className="bg-primary p-6 text-primary-foreground">
                        <h2 className="text-2xl font-bold mb-2">Order #{order.id.slice(-8).toUpperCase()}</h2>

                        <button
                            onClick={onBack}
                            className="flex text-white items-center gap-2 hover:underline mb-6 font-medium transition-colors"
                        >
                            <ChevronRight className="text-white w-4 h-4 rotate-180" />
                            Back to Orders
                        </button>

                        <div className="flex items-center gap-3 flex-wrap">
                            <StatusBadge status={order.status} />
                            <span className="text-sm opacity-90">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Customer Information - Show for vendors */}
                        {isVendorOrder && order.user && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-teal-950/20 rounded-xl shadow-lg p-4">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InfoCard
                                        icon={User}
                                        label="Customer Name"
                                        className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                        value={order.user.name}
                                    />
                                    <InfoCard
                                        icon={Phone}
                                        label="Phone Number"
                                        className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                        value={order.user.phoneNumber || "Not provided"}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Stall/Vendor Information - Show for users */}
                        {isUserOrder && stallInfo && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-teal-950/20 rounded-xl shadow-lg p-4">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    Vendor Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InfoCard
                                        icon={Store}
                                        label="Stall Name"
                                        className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                        value={stallInfo.name}
                                    />
                                    {stallInfo.landmark && (
                                        <InfoCard
                                            icon={MapPin}
                                            label="Landmark"
                                            className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                            value={stallInfo.landmark}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment & Order Info */}
                        <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-teal-950/20 rounded-xl shadow-lg p-4">
                            <InfoCard
                                icon={Info}
                                label="Payment Status"
                                value={order.paymentStatus.toLowerCase().replace(/_/g, " ")}
                                className="capitalize bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                            />
                            <InfoCard
                                icon={Package}
                                className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                label="Total Amount"
                                value={`₦${order.total?.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`}
                            />
                            <InfoCard
                                icon={CreditCard}
                                label="Payment Method"
                                className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                value={order.paymentStatus == "SUCCESS" ? order.paymentChannel?.toUpperCase() : "Pay on Delivery"}
                            />
                            <InfoCard
                                icon={Clock}
                                label="Delivery Status"
                                className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3"
                                value={order.deliveryStatus || "IDLE"}
                            />
                        </div>

                        {/* Payment Details */}
                        {cardInfo && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-teal-950/20 rounded-xl shadow-lg p-4">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    Payment Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground mb-1">Card Brand</p>
                                        <p className="font-semibold text-foreground">{cardInfo.brand}</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground mb-1">Card Number</p>
                                        <p className="font-semibold text-foreground">**** {cardInfo.last4}</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground mb-1">Bank</p>
                                        <p className="font-semibold text-foreground text-sm">{cardInfo.bank}</p>
                                    </div>
                                </div>
                                {order.reference && (
                                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                                        <p className="text-xs text-muted-foreground">Reference: {order.reference}</p>
                                        {order.transactionId && (
                                            <p className="text-xs text-muted-foreground">Transaction ID: {order.transactionId}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-teal-950/20 rounded-xl shadow-lg p-4">
                                <Package className="w-4 h-4" />
                                Order Items ({totalItems})
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto ">
                                {order.items?.map((item: any, index: number) => (
                                    <div
                                        key={item.id}
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-teal-950/20 rounded-xl shadow-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-foreground">{item.product?.name || `Item ${index + 1}`}</h4>
                                                {item.product?.description && (
                                                    <p className="text-xs text-muted-foreground mt-1">{item.product.description}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.size && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{item.size.label}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-foreground">
                                                    ₦
                                                    {(item.size ? item.size.price : item.price * item.quantity).toLocaleString("en-NG", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ₦{item.size?.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })} each
                                                </p>
                                            </div>
                                        </div>

                                        {item.addons && item.addons.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-border">
                                                <p className="text-sm text-muted-foreground font-medium mb-1">Addons:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.addons.map((a: any, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md"
                                                        >
                                                            <span>{a.label}</span>
                                                            <span>₦{a.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-3">
                            {isUserOrder ? (
                                <div>
                                    <button
                                        onClick={fetchQrCode}
                                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" />
                                        {showQR ? "Hide" : "View"} QR Code
                                    </button>
                                    <button
                                        onClick={manualConfirm}
                                        disabled={isConfirming}
                                        className="w-full my-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl disabled:opacity-50 font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        {manualConfirming ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Confirm Delivery
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : isVendorOrder ? (
                                <div className="space-y-3">
                                    {order.geolocation && (
                                        <button
                                            onClick={() => setShowDeliveryTracking(true)}
                                            disabled={isDelivered}
                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl disabled:opacity-50 font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <Navigation className="w-5 h-5" />
                                            Begin Delivery
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setShowScanner(true)}
                                        disabled={isConfirming || isDelivered}
                                        className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isConfirming ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Confirming...
                                            </>
                                        ) : isDelivered ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Already Delivered
                                            </>
                                        ) : (
                                            <>
                                                <Scan className="w-5 h-5" />
                                                Scan QR to Confirm Payment
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : null}

                            {showQR && qrCode && (
                                <div className="flex justify-center p-6 bg-muted rounded-xl border border-border">
                                    <div className="bg-white p-4 rounded-lg">
                                        <img src={qrCode || "/placeholder.svg"} alt="Order QR Code" className="w-48 h-48" />
                                        <p className="text-xs text-center text-black mt-2 text-muted-foreground">Show this to vendor</p>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div
                                    className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === "success"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                >
                                    {message.type === "success" ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4" />
                                    )}
                                    {message.text}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* QR Scanner Modal */}
                {showScanner && (
                    <QrScanner
                        onResult={(result) => {
                            console.log("[OrderDetails] QR scan result:", result)
                            handleConfirmOrder(result)
                        }}
                        onClose={() => setShowScanner(false)}
                    />
                )}

                {/* Delivery Tracking Modal */}
                {showDeliveryTracking && (
                    <DeliveryTracking
                        order={order}
                        onClose={() => setShowDeliveryTracking(false)}
                        accessToken={accessToken}
                        onRefresh={onRefresh}
                    />
                )}
            </div>
        )
    },
)

OrderDetails.displayName = "OrderDetails"
