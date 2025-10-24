"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import {
    X,
    AlertCircle,
    RefreshCw,
    Scan
} from "lucide-react"

const MAX_SCAN_RETRIES = 3

interface QrScannerProps {
    onResult: (result: string) => void
    onClose: () => void
}

export const QrScanner: React.FC<QrScannerProps> = ({ onResult, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [error, setError] = useState<string>("")
    const [isScanning, setIsScanning] = useState<boolean>(false)
    const [isVideoReady, setIsVideoReady] = useState<boolean>(false)
    const [retryCount, setRetryCount] = useState<number>(0)

    const activeRef = useRef<boolean>(true)
    const readerRef = useRef<any>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const getPreferredDeviceId = useCallback(async (): Promise<string | undefined> => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true })
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter((device) => device.kind === "videoinput")

            if (videoDevices.length === 0) {
                throw new Error("No camera devices found")
            }

            const rearCamera = videoDevices.find((device) => /back|rear|environment/i.test(device.label))

            return rearCamera?.deviceId || videoDevices[0].deviceId
        } catch (err) {
            console.error("[QR Scanner] Device enumeration failed:", err)
            return undefined
        }
    }, [])

    const stopAllStreams = useCallback(() => {
        if (readerRef.current) {
            try {
                readerRef.current.reset()
                readerRef.current = null
            } catch (e) {
                console.warn("[QR Scanner] Reader cleanup failed:", e)
            }
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }

        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.srcObject = null
        }
    }, [])

    const handleScanError = useCallback(
        (err: unknown) => {
            let errorMessage = "Failed to start camera"
            const errorObj = err as Error

            if (errorObj.name === "NotAllowedError" || errorObj.name === "PermissionDeniedError") {
                errorMessage = "Camera permission denied. Please allow camera access and try again."
            } else if (errorObj.name === "NotFoundError" || errorObj.name === "DevicesNotFoundError") {
                errorMessage = "No camera found. Please ensure your device has a camera."
            } else if (errorObj.name === "NotReadableError" || errorObj.name === "TrackStartError") {
                errorMessage = "Camera is in use by another application."
            } else if (errorObj.name === "OverconstrainedError") {
                errorMessage = "Camera configuration not supported."

                if (retryCount < MAX_SCAN_RETRIES) {
                    setRetryCount((prev) => prev + 1)
                    // Note: We can't call startScanning here directly due to circular dependency
                    // This will be handled by the retry button instead
                    return
                }
            }

            setError(errorMessage)
            setIsScanning(false)
            setIsVideoReady(false)
        },
        [retryCount],
    )

    const startScanning = useCallback(async () => {
        if (!activeRef.current || !videoRef.current) return

        setError("")
        setIsScanning(false)
        setIsVideoReady(false)

        try {
            const { BrowserQRCodeReader } = await import("@zxing/browser")
            if (!activeRef.current) return

            const reader = new BrowserQRCodeReader()
            readerRef.current = reader

            const deviceId = await getPreferredDeviceId()

            const handleVideoReady = () => {
                if (!activeRef.current) return
                setIsVideoReady(true)
            }

            videoRef.current.addEventListener("playing", handleVideoReady, { once: true })

            await reader.decodeFromVideoDevice(deviceId, videoRef.current, (result, error) => {
                if (!activeRef.current) return

                if (result) {
                    activeRef.current = false
                    stopAllStreams()
                    onResult(result.getText())
                    return
                }

                if (
                    error &&
                    error.name !== "NotFoundException" &&
                    error.name !== "ChecksumException" &&
                    error.name !== "FormatException"
                ) {
                    console.error("[QR Scanner] Decoding error:", error)
                }
            })

            if (videoRef.current.srcObject) {
                streamRef.current = videoRef.current.srcObject as MediaStream
            }

            setIsScanning(true)
        } catch (err: unknown) {
            console.error("[QR Scanner] Scanner initialization failed:", err)
            handleScanError(err)
        }
    }, [getPreferredDeviceId, stopAllStreams, onResult, handleScanError])

    const handleRetry = useCallback(() => {
        setRetryCount(0)
        setError("")
        stopAllStreams()
        setTimeout(() => startScanning(), 100)
    }, [stopAllStreams, startScanning])

    const handleClose = useCallback(() => {
        activeRef.current = false
        stopAllStreams()
        onClose()
    }, [stopAllStreams, onClose])

    useEffect(() => {
        activeRef.current = true
        startScanning()

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose()
        }

        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("keydown", handleEscape)
            activeRef.current = false
            stopAllStreams()
        }
    }, [startScanning, handleClose, stopAllStreams])

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-border">
                <div className="bg-primary p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-foreground">
                        <Scan className="w-5 h-5" />
                        <h3 className="font-semibold">Scan QR Code</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
                            <p className="text-destructive mb-4">{error}</p>
                            <div className="space-x-2">
                                <button
                                    onClick={handleRetry}
                                    disabled={retryCount >= MAX_SCAN_RETRIES}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className="w-4 h-4 inline mr-2" />
                                    Retry
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-4">
                                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                                        <div className="absolute inset-0 border-2 border-primary rounded-xl" />
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
                                        {isScanning && isVideoReady && (
                                            <div className="absolute inset-x-0 top-0 h-0.5 bg-primary animate-pulse" />
                                        )}
                                    </div>
                                </div>
                                {!isVideoReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <RefreshCw className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <p className={`text-center text-sm ${isVideoReady ? "text-muted-foreground" : "text-primary"} mb-4`}>
                                {isVideoReady ? "Position the QR code within the frame" : "Initializing camera..."}
                            </p>
                            <button
                                onClick={handleClose}
                                className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}