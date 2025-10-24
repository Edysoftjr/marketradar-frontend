"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
    Search,
    Star,
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
} from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Cookies from "js-cookie"
import CartDrawer from "@/components/homepage/cart-drawer"
import { HomepageService } from "@/lib/services/homepage.service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { HomepageProps, SearchFilters } from "@/types/homepage"
import type { StallWithDetails } from "@/types/stall"
import type { Product } from "@/types/product"
import type { CartItem } from "@/types/cart"
import { getUserFavorites, toggleFavorite } from "@/lib/server/favorites"
import { formatLabel } from "@/constants/stallTypes"
import ProductCard from "@/components/product/product-client"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import SectionHeader from "./components/SectionHeader"
import StallCard from "./components/StallCard"
import FilterDialog from "./components/FilterDialog"
import AddToCartSheet from "./components/AddToCartSheet"

const COUNTDOWN_DAYS = 10

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const categoryIcons = {
    FOOD: Utensils,
    CLOTHING: Package,
    ELECTRONICS: Store,
    OTHER: ShoppingBag,
}

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
        ; <CartDrawer
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
                                        viewAllHref="/view-all/stalls"
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
                                        viewAllHref="/view-all/products"
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
