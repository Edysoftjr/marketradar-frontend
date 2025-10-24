"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import CartDrawer from "@/components/homepage/cart-drawer"
import { Badge } from "@/components/ui/badge"
import type { HomepageProps, SearchFilters, FilterDialogProps } from "@/types/homepage"
import type { StallWithDetails } from "@/types/stall"
import type { Product } from "@/types/product"
import type { CartItem } from "@/types/cart"
import { HomepageService } from "@/lib/services/homepage.service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  DollarSign,
  Star,
  Loader2,
  ChevronRight,
  Users,
  MapPin,
  AlertCircle,
  ShoppingBag,
  TrendingUp,
  Utensils,
  Store,
  Package,
  Home,
  LayoutDashboard,
  User,
  Filter,
  Sparkles,
  Eye,
  ShoppingCart,
  CreditCard,
  Truck,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import Cookies from "js-cookie"
import { getUserFavorites, toggleFavorite } from "@/lib/server/favorites"
import NotificationPanel from "@/components/notifications/notification-panel"
import { Slider } from "@/components/ui/slider"
import ProductCard from "@/components/product/product-client"
import { formatLabel } from "@/constants/stallTypes"

const COUNTDOWN_DAYS = 10

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const categoryIcons = {
  FOOD: Utensils,
  CLOTHING: Package,
  ELECTRONICS: Store,
  OTHER: ShoppingBag,
}

const FilterDialog = ({ open, onOpenChange, onApplyFilters, accessToken, loading }: FilterDialogProps) => {
  const [budget, setBudget] = useState([50])
  const [locationLoading, setLocationLoading] = useState(false)
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
    address?: string
  } | null>(null)

  const updateLocationOnServer = async (lat: number, lng: number) => {
    try {
      const controller = new AbortController()
      // Set a timeout for the request
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 seconds timeout

      await fetch("/api/save-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ lat, lng }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId) // Clear the timeout if the request completes
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("Location update request timed out")
      } else {
        console.error("Failed to update location on server:", error)
      }
    }
  }

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

    // Moved the fetch call inside the updateLocationOnServer function,
    // so it's no longer needed here.

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
  }, [location])

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

const AddToCartSheet = ({
  open,
  onOpenChange,
  product,
  userAddress = "",
  onAddToCart,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  userAddress?: string | null
  onAddToCart: (item: CartItem) => void
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState<string>("default")
  const [customAddress, setCustomAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize("")
      setSelectedAddons([])
      setDeliveryAddress("default")
      setCustomAddress("")
    }
  }, [product])

  if (!product) return null

  const sizes = product.sizes ?? []
  const addons = product.addons ?? []

  const selectedSizeObj = sizes.find((size) => size.id && size.id.toString() === selectedSize)

  const selectedAddonObjs = addons.filter((addon) => addon.id && selectedAddons.includes(addon.id.toString()))

  const basePrice = selectedSizeObj?.price || 0
  const addonsPrice = selectedAddonObjs.reduce((sum, addon) => sum + addon.price, 0)
  const totalPrice = basePrice + addonsPrice

  const handleAddonToggle = (addonId: string | number) => {
    const idStr = addonId.toString()
    setSelectedAddons((prev) => (prev.includes(idStr) ? prev.filter((id) => id !== idStr) : [...prev, idStr]))
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    const selectedSizeObj = sizes.find((size) => size.id && size.id.toString() === selectedSize)

    const selectedAddonObjs = addons.filter((addon) => addon.id && selectedAddons.includes(addon.id.toString()))

    if (!selectedSizeObj) return

    const cartItem: CartItem = {
      ...product,
      selectedSize: selectedSizeObj,
      selectedAddons: selectedAddonObjs,
      paymentMethod: product.payOnOrder ? "automatic" : "delivery",
    }

    // pass cartItem back to parent instead of raw product
    onAddToCart(cartItem)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl border-t-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <div>
              <SheetTitle className="text-xl">{product.name}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">Customize your order</SheetDescription>
            </div>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Product Image and Info */}
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={product.images?.[0] ? `${API_BASE_URL}${product.images[0]}` : "/rest1.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-1 gap-2">
                    {sizes.map((size) => (
                      <Label
                        key={size.id}
                        htmlFor={`size-${size.id}`}
                        className="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem id={`size-${size.id}`} value={String(size.id)} />
                          <span className="font-medium">{size.label}</span>
                        </div>
                        <span className="font-semibold">₦{size.price.toLocaleString()}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Addons */}
              {addons.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">Add-ons (Optional)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {addons.map((addon) => (
                      <div key={addon.id} className="relative">
                        <Label
                          htmlFor={`addon-${addon.id}`}
                          className="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`addon-${addon.id ?? "unknown"}`}
                              checked={addon.id ? selectedAddons.includes(addon.id.toString()) : false}
                              onChange={() => addon.id && handleAddonToggle(addon.id.toString())}
                              className="w-4 h-4 rounded border-2 text-primary focus:ring-primary"
                            />

                            <span className="font-medium">{addon.label}</span>
                          </div>
                          <span className="font-semibold">+₦{addon.price.toLocaleString()}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Delivery Address</Label>
                <RadioGroup value={deliveryAddress} onValueChange={setDeliveryAddress}>
                  <Label
                    htmlFor="default-address"
                    className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem id="default-address" value="default" />
                    <div>
                      <div className="font-medium">Default Address</div>
                      <div className="text-sm text-muted-foreground">{userAddress}</div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="custom-address"
                    className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem id="custom-address" value="custom" />
                    <Textarea
                      placeholder="Enter delivery address..."
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      className="rounded-lg min-h-[80px]"
                      onClick={() => setDeliveryAddress("custom")}
                    />
                  </Label>
                </RadioGroup>
              </div>

              {/* Payment Method - Conditional Display */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Payment Method</Label>
                {product.payOnOrder ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
                    <CreditCard className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Pay Now</div>
                      <div className="text-sm text-muted-foreground">Secure online payment</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
                    <Truck className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">Pay on Delivery</div>
                      <div className="text-sm text-muted-foreground">Cash payment when delivered</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-background">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">₦{totalPrice.toLocaleString()}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={isLoading || !selectedSize}
              className="w-full rounded-xl h-12 text-base"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const Header = ({
  router,
  accessToken,
  onOpenFilter,
  cart,
  onOpenCart,
}: {
  router: AppRouterInstance
  accessToken: string
  onOpenFilter: () => void
  cart: Product[]
  onOpenCart: () => void
}) => (
  <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
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
            <p className="text-xs text-muted-foreground font-medium">Discover local markets</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <NotificationPanel accessToken={accessToken} />

          {/* Cart Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 sm:p-2 hover:bg-muted/60 rounded-lg sm:rounded-xl transition-all duration-200"
              onClick={onOpenCart}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 sm:p-2 hover:bg-muted/60 rounded-lg sm:rounded-xl transition-all duration-200"
            onClick={onOpenFilter}
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  </header>
)

// Enhanced Stall Card with Add to Cart for products
const StallCard = ({
  stall,
  featured = false,
  router,
}: {
  stall: StallWithDetails
  featured?: boolean
  router: AppRouterInstance
}) => {
  const image = stall.images?.length ? `${API_BASE_URL}${stall.images[0]}` : "/rest1.jpg"
  const avgRating = stall.avgRating ?? 0
  const metrics = stall.metrics ?? {}

  return (
    <Card
      className={`group cursor-pointer transition-all duration-700 transform hover:-translate-y-2 sm:hover:-translate-y-4 ${
        featured ? "shadow-2xl shadow-primary/10" : "shadow-md sm:shadow-lg shadow-black/5 dark:shadow-black/20"
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

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
  handleSearch: (e: React.FormEvent) => void
  loading: boolean
}) => (
  <section className="pt-8 sm:pt-16 mb-0">
    <div className="container px-3 sm:px-4 mb-0 mx-auto">
      <div className="max-w-2xl mx-auto text-center">
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your Local{" "}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-purple-600 bg-clip-text text-transparent">
              Markets
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
            Explore stalls without wandering all over town
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-6 sm:mt-10">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative">
              <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                type="search"
                placeholder="Search for stalls, food, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-14 min-h-[50px] pr-20 sm:pr-32 py-4 sm:py-7 text-sm sm:text-lg rounded-xl sm:rounded-2xl border-0 shadow-lg shadow-black/5 dark:shadow-black/20 group-focus-within:shadow-xl group-focus-within:shadow-primary/10 transition-all bg-background/80 backdrop-blur-sm ring-1 ring-border/40 focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <Button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-4 sm:px-8 text-sm rounded-lg sm:rounded-xl bg-gradient-to-r from-primary via-primary/95 to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-medium hidden sm:inline">Searching...</span>
                    <span className="font-medium sm:hidden">...</span>
                  </div>
                ) : (
                  <span className="font-medium">Search</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
)

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  actionText,
  onAction,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  subtitle: string
  actionText?: string
  onAction?: () => void
}) => (
  <div className="flex items-center justify-between mb-6 sm:mb-12">
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="relative">
        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-primary/90 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-xl sm:rounded-2xl blur-sm -z-10" />
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <h2 className="text-xl sm:text-3xl font-bold">{title}</h2>
        <p className="text-xs sm:text-base text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    {actionText && onAction && (
      <Button
        variant="outline"
        size="sm"
        onClick={onAction}
        className="hidden sm:flex rounded-xl border-0 bg-muted/40 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20"
      >
        {actionText}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    )}
  </div>
)

const BottomNavigation = ({ router }: { router: AppRouterInstance }) => {
  const [open, setOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    let targetDate = Cookies.get("featureCountdown")
    if (!targetDate) {
      const future = new Date()
      future.setDate(future.getDate() + COUNTDOWN_DAYS)
      targetDate = future.toISOString()
      Cookies.set("featureCountdown", targetDate, { expires: COUNTDOWN_DAYS })
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = new Date(targetDate!).getTime()
      const diff = Math.max(end - now, 0)
      setTimeLeft(diff)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  const comingSoonDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe rounded-2xl shadow-xl p-4 sm:p-6 text-center max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Coming Soon!</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">Our new feature will launch in:</DialogDescription>
        </DialogHeader>
        <div className="text-xl sm:text-2xl font-bold mt-4">{formatTime(timeLeft)}</div>
        <Button className="mt-4 sm:mt-6 w-full" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {comingSoonDialog}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around px-2 sm:px-4 py-2 sm:py-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/home")}
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Home</span>
          </Button>

          {/* <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Chat</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <Radio className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Status</span>
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/profile")}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </>
  )
}

// Main Component
export function HomepageClient({ initialData, accessToken }: HomepageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters] = useState<SearchFilters>({
    location: null,
  })

  const userAddress: string | undefined = initialData?.userAddress?.addressRaw
  const email: string | undefined = initialData?.email

  const [data] = useState(() => ({
    featuredStalls: initialData?.featuredStalls ?? [],
    trendingProducts: initialData?.trendingProducts ?? [],
    stallsByCategory: initialData?.stallsByCategory ?? [],
    nearbyStalls: initialData?.nearbyStalls ?? [],
    userLocation: initialData?.userLocation ?? [],
    userAddress: initialData?.userAddress?.addressRaw ?? "",
    ...initialData,
  }))

  const [loading, setLoading] = useState(false)
  // const [favorites, setFavorites] = useState<ProductWithStall[]>([]);
  const [searchResults, setSearchResults] = useState<{
    stalls: StallWithDetails[]
    products: Product[]
  } | null>(null)

  // New state for dialogs
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [addToCartSheetOpen, setAddToCartSheetOpen] = useState(false)
  const [nearbyStalls, setNearbyStalls] = useState<StallWithDetails[]>([])
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  const openAddToCartSheet = (product: Product) => {
    setSelectedProduct(product)
    setAddToCartSheetOpen(true)
  }

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item])
  }

  // Handle filter application
  const handleApplyFilters = async (appliedFilters: SearchFilters) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/homepage/filters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(appliedFilters),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Filters applied",
          description: "Your preferences have been saved.",
        })
        setFilterDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to apply filters.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong while applying filters.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle toggling favorites
  const handleToggleFavorite = async (productId: string) => {
    try {
      const response = await toggleFavorite(productId, accessToken)
      if (response.success) {
        const updatedFavorites = await getUserFavorites(accessToken)
        if (updatedFavorites.success && updatedFavorites.data) {
          // setFavorites(updatedFavorites.data.favorites); // Removed: setFavorites is not defined
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  // Clear entire cart
  const handleClearCart = () => {
    setCart([])
  }

  // Remove product from cart
  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.id !== productId))
  }
  ;<CartDrawer
    open={cartDrawerOpen}
    onOpenChange={setCartDrawerOpen}
    cart={cart}
    customerEmail={email}
    onRemove={handleRemoveFromCart}
    onClearCart={handleClearCart}
    accessToken={accessToken}
  />

  // Load nearby stalls using preset coordinates
  useEffect(() => {
    const loadNearbyStalls = async () => {
      // Check if we have preset coordinates in initialData
      const userLatitude = initialData?.userLocation?.latitude
      const userLongitude = initialData?.userLocation?.longitude

      if (userLatitude && userLongitude) {
        try {
          const mileRadius = 10
          const nearby = await HomepageService.getNearbyStalls(userLatitude, userLongitude, mileRadius, accessToken)
          setNearbyStalls(nearby)
        } catch (error) {
          console.error("Error fetching nearby stalls:", error)
        }
      }
    }

    loadNearbyStalls()
  }, [initialData, accessToken])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await HomepageService.search(searchQuery, filters, accessToken)
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!data) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Alert className="border-red-200/50 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20 rounded-xl sm:rounded-2xl">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
            Error loading homepage data. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check if we should show nearby stalls section
  const hasLocationData = initialData?.userLocation?.latitude && initialData?.userLocation?.longitude

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 pb-16 sm:pb-20">
        <CartDrawer
          open={cartDrawerOpen}
          onOpenChange={setCartDrawerOpen}
          cart={cart}
          customerEmail={email}
          onRemove={handleRemoveFromCart}
          onClearCart={handleClearCart}
          accessToken={accessToken}
        />
        {/* Filter Dialog */}
        <FilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          onApplyFilters={handleApplyFilters}
          accessToken={accessToken}
          loading={loading}
        />
        {/* Add to Cart Sheet */}
        <AddToCartSheet
          open={addToCartSheetOpen}
          onOpenChange={setAddToCartSheetOpen}
          product={selectedProduct}
          userAddress={userAddress}
          onAddToCart={handleAddToCart}
        />
        {/* Header */}
        <Header
          router={router}
          accessToken={accessToken}
          onOpenFilter={() => setFilterDialogOpen(true)}
          cart={cart}
          onOpenCart={() => setCartDrawerOpen(true)}
        />
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          loading={loading}
        />
        {/* Search Results */}
        {searchResults && (
          <section className="py-8 sm:py-16">
            <div className="container px-3 sm:px-4 mx-auto">
              <SectionHeader icon={Search} title="Search Results" subtitle={`Found results for "${searchQuery}"`} />

              {searchResults.stalls.length === 0 && searchResults.products.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-muted/50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-black/5 dark:shadow-black/20">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">No results found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground/80 mb-1 sm:mb-2 px-4">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-xs sm:text-base text-muted-foreground/60 px-4">
                    Try adjusting your search terms or browse our categories
                  </p>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-16">
                  {searchResults.stalls.length > 0 && (
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <Store className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        Stalls ({searchResults.stalls.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {searchResults.stalls.map((stall) => (
                          <StallCard key={stall.id} stall={stall} router={router} />
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        Products ({searchResults.products.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                        {searchResults.products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isFavorite={product.isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                            onAddToCart={openAddToCartSheet}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
        {/* Main Content */}
        {!searchResults && (
          <>
            {/* Featured Stalls */}
            {data.featuredStalls && data.featuredStalls.length > 0 && (
              <section className="py-8 sm:py-16">
                <div className="container px-3 sm:px-4 mx-auto">
                  <SectionHeader
                    icon={Star}
                    title="Featured Stalls"
                    subtitle="Hand-picked favorites from your community"
                    actionText="View All"
                    onAction={() => router.push("/stalls")}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                    {data.featuredStalls.map((stall) => (
                      <StallCard key={stall.id} stall={stall} featured router={router} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Trending Products */}
            {data.trendingProducts && data.trendingProducts.length > 0 && (
              <section className="py-8 sm:py-16">
                <div className="container px-3 sm:px-4 mx-auto">
                  <SectionHeader
                    icon={TrendingUp}
                    title="Trending Now"
                    subtitle="Most popular items everyone's talking about"
                    actionText="View All"
                    onAction={() => router.push("/trending")}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {data.trendingProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={product.isFavorite}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={openAddToCartSheet}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Categories */}
            {data.stallsByCategory && data.stallsByCategory.length > 0 && (
              <section className="py-8 sm:py-16">
                <div className="container px-3 sm:px-4 mx-auto">
                  <div className="text-center mb-8 sm:mb-16">
                    <div className="inline-flex items-center gap-1 sm:gap-2 bg-primary/10 text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium mb-4 sm:mb-8 border border-primary/20 shadow-sm">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                      Categories
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6">Browse by Category</h2>
                    <p className="text-sm sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed px-4">
                      Explore different types of stalls and discover exactly what you&apos;re craving
                    </p>
                  </div>

                  <div className="space-y-10 sm:space-y-20">
                    {data.stallsByCategory
                      .filter(({ stalls }) => stalls.length >= 1)
                      .slice(0, 10)
                      .map(({ category, stalls }) => {
                        const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || ShoppingBag

                        return (
                          <div key={category}>
                            <SectionHeader
                              icon={IconComponent}
                              title={formatLabel(category)}
                              subtitle={`${stalls.length} stalls available`}
                              actionText="View All"
                              onAction={() => router.push(`/stalls?category=${category}`)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                              {stalls.slice(0, 4).map((stall) => (
                                <StallCard key={stall.id} stall={stall} router={router} />
                              ))}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </section>
            )}

            {/* Nearby Stalls - Only show if location data exists */}
            {hasLocationData && (
              <section className="py-8 sm:py-16">
                <div className="container px-3 sm:px-4 mx-auto">
                  <SectionHeader
                    icon={MapPin}
                    title="Nearby Stalls"
                    subtitle="Great food spots in your area"
                    actionText={nearbyStalls.length > 0 ? "View All" : undefined}
                    onAction={nearbyStalls.length > 0 ? () => router.push("/nearby") : undefined}
                  />

                  {nearbyStalls.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                      {nearbyStalls.map((stall) => (
                        <StallCard key={stall.id} stall={stall} router={router} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 sm:py-24">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-8 sm:mb-10 shadow-2xl shadow-black/10 dark:shadow-black/40 border border-border/40">
                        <MapPin className="h-12 w-12 sm:h-14 sm:w-14 text-muted-foreground" />
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl sm:rounded-3xl blur-xl -z-10" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">No Nearby Stalls</h3>
                      <p className="text-sm sm:text-base text-muted-foreground/80 max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                        No stalls found in your area. Try exploring other categories or check back later.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation router={router} />
    </>
  )
}
