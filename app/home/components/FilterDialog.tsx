"use client"

import { useState, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { FilterDialogProps } from "@/types/homepage"
import { DollarSign, MapPin, Loader2, Filter } from "lucide-react"
import { Label } from "@/components/ui/label"

const FilterDialog = ({ open, onOpenChange, onApplyFilters, accessToken, loading }: FilterDialogProps) => {
    const [budget, setBudget] = useState([50])
    const [locationLoading, setLocationLoading] = useState(false)
    const [location, setLocation] = useState<{
        latitude: number
        longitude: number
        address?: string
    } | null>(null)

    const updateLocationOnServer = useCallback(async (lat: number, lng: number) => {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 15000)

            await fetch("/api/save-location", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: JSON.stringify({ lat, lng }),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                console.error("Location update request timed out")
            } else {
                console.error("Failed to update location on server:", error)
            }
        }
    }, [accessToken])

    const handleGeolocate = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.")
            return
        }

        // Check permission state first (if available)
        if (navigator.permissions) {
            try {
                const permissionStatus = await navigator.permissions.query({ name: "geolocation" })
                if (permissionStatus.state === "denied") {
                    alert(
                        "Location access is blocked. Please enable location permissions in your browser settings and reload the page.",
                    )
                    return
                }
            } catch (e) {
                console.log(e)
                // Permission API not supported, continue anyway
            }
        }

        setLocationLoading(true)

        // First attempt with cached position for faster response
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                setLocation({ latitude, longitude })
                setLocationLoading(false)

                if (accessToken) {
                    await updateLocationOnServer(latitude, longitude)
                }
            },
            (error) => {
                // If first attempt fails with timeout, retry with fresh position
                if (error.code === error.TIMEOUT) {
                    console.log("First attempt timed out, trying again without cache...")

                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords
                            setLocation({ latitude, longitude })
                            setLocationLoading(false)

                            if (accessToken) {
                                await updateLocationOnServer(latitude, longitude)
                            }
                        },
                        (retryError) => {
                            setLocationLoading(false)

                            let message = "Unable to get your location. "
                            switch (retryError.code) {
                                case retryError.PERMISSION_DENIED:
                                    message += "Please enable location permissions in your browser settings and reload the page."
                                    break
                                case retryError.POSITION_UNAVAILABLE:
                                    message +=
                                        "Your device's location service is unavailable. Please ensure GPS/Location Services are enabled in your device settings."
                                    break
                                case retryError.TIMEOUT:
                                    message +=
                                        "Location request timed out. Please ensure you have a clear view of the sky (for GPS) or are connected to WiFi."
                                    break
                                default:
                                    message += "An unknown error occurred. Please try again."
                            }
                            alert(message)
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 45000, // 45 seconds for GPS to acquire lock
                            maximumAge: 0, // Force fresh position
                        },
                    )
                } else {
                    setLocationLoading(false)

                    let message = "Unable to get your location. "
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message += "Please enable location permissions in your browser settings and reload the page."
                            break
                        case error.POSITION_UNAVAILABLE:
                            message +=
                                "Your device's location service is unavailable. Please ensure GPS/Location Services are enabled in your device settings."
                            break
                        default:
                            message += "An unknown error occurred. Please try again."
                    }
                    alert(message)
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 20000, // 20 seconds first attempt
                maximumAge: 60000, // Accept 1 minute old cached position for speed
            },
        )
    }

    const clearLocation = () => setLocation(null)
    const clearAllFilters = () => {
        setBudget([50])
        setLocation(null)
    }

    const applyFilters = async () => {
        const cleanLocation = location ? { latitude: location.latitude, longitude: location.longitude } : null

        onApplyFilters({
            budget: budget[0],
            location: cleanLocation,
            maxPrice: budget[0],
        })
    }

    useEffect(() => {
        if (location) {
            updateLocationOnServer(location.latitude, location.longitude)
        }
    }, [location, updateLocationOnServer])


    const hasActiveFilters = budget[0] !== 50 || location !== null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Filter className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">Filter & Preferences</span>
                    </DialogTitle>
                    <DialogDescription>
                        Customize your search to find the perfect stalls for your taste and budget.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4 px-6">
                    {/* Budget Range */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                            Budget Range
                        </Label>
                        <div className="space-y-3">
                            <div className="px-2">
                                <Slider value={budget} onValueChange={setBudget} max={5000} min={10} step={10} className="w-full" />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-200 px-2 gap-2">
                                <span className="text-xs sm:text-sm whitespace-nowrap">₦10</span>
                                <div className="text-center flex-shrink-0">
                                    <div className="text-lg font-semibold text-gray-200">₦{budget[0]}</div>
                                    <div className="text-xs whitespace-nowrap">Max per meal</div>
                                </div>
                                <span className="text-xs sm:text-sm whitespace-nowrap">₦5000</span>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            Location Settings
                        </Label>

                        <div className="space-y-3">
                            <Button
                                onClick={handleGeolocate}
                                disabled={locationLoading}
                                variant="outline"
                                className="w-full rounded-xl justify-start h-12 bg-transparent"
                            >
                                {locationLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 flex-shrink-0 animate-spin" />
                                ) : (
                                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                )}
                                <span className="flex-1 text-left truncate">
                                    {locationLoading
                                        ? "Getting your location..."
                                        : location
                                            ? "Update current location"
                                            : "Use my current location"}
                                </span>
                            </Button>

                            {location && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm font-medium text-green-800 truncate">📍 Location Set</div>
                                        <Button
                                            onClick={clearLocation}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-green-600 hover:text-green-800 flex-shrink-0"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                    <div className="text-xs text-green-700 break-all">
                                        {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 px-6 pb-6 border-t">
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={clearAllFilters} className="text-gray-600 hover:text-gray-900">
                            Clear All
                        </Button>
                    )}
                    <div className="flex gap-3 ml-auto flex-wrap">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-6">
                            Cancel
                        </Button>
                        <Button onClick={applyFilters} className="rounded-xl px-4 sm:px-6" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span className="font-medium hidden sm:inline">Applying...</span>
                                    <span className="font-medium sm:hidden">...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="whitespace-nowrap">Apply Filters</span>
                                    {hasActiveFilters && (
                                        <Badge className="bg-white/20 text-white text-xs px-1.5">
                                            {[budget[0] !== 50 && "₦", location && "📍"].filter(Boolean).join("")}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FilterDialog