/* eslint-disable */
"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Filter, Loader2, Search, X, ShoppingCart } from "lucide-react"
import StallCard from "@/app/home/components/StallCard"
import { getUserFavorites, toggleFavorite } from "@/lib/server/favorites"
import ProductCard from "@/components/product/product-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Size, Addon } from "@/types";
import { ViewAllFilters, ViewAllType, PaginatedResponse } from "@/types/viewAll"
import { StallWithDetails } from "@/types/stall"
import { Product } from "@/types/product"
import CartDrawer from "@/components/homepage/cart-drawer";
import { CartItem } from "@/types/cart";
import { useDebounce } from "@/hooks/use-debounce"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddToCartSheet from "../components/AddToCartSheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface ProductData {
    id: string;
    name: string;
    images: string[];
    description: string | null;
    category: string;
    payOnOrder: boolean;
    quantity: number;
    stallId: string;
    price?: number;
    sizes?: Size[];
    addons?: Addon[];
    discount?: number; // discount value (e.g., 20 means 20%)
    discountType?: "percentage" | "fixed"; // new field
    createdAt: string;
    isFavorite?: boolean;
}

interface ViewAllPageProps {
    type: ViewAllType
    accessToken: string;
    initialData?: PaginatedResponse<StallWithDetails | Product>
    category?: string
}

const ITEMS_PER_PAGE = 12

export default function ViewAllPage({ type, accessToken, initialData, category }: ViewAllPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const userEmail = initialData?.userLocation?.email
    // State
    const [items, setItems] = useState<(StallWithDetails | Product)[]>(initialData?.items || [])
    const [loading, setLoading] = useState(!initialData)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(initialData?.metadata.hasNextPage ?? true)
    const [nextCursor, setNextCursor] = useState<string | undefined>(initialData?.metadata.nextCursor)
    const [searchQuery, setSearchQuery] = useState(searchParams?.get("searchQuery") || "")
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

    const [filters, setFilters] = useState<ViewAllFilters>({
        category: category || searchParams?.get("category") || undefined,
        searchQuery: searchParams?.get("searchQuery") || undefined,
        sortBy: searchParams?.get("sortBy") || undefined,
        sortOrder: (searchParams?.get("sortOrder") as "asc" | "desc") || undefined,
        maxPrice: searchParams?.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
        maxDistance: searchParams?.get("maxDistance") ? parseFloat(searchParams.get("maxDistance")!) : undefined,
    })

    // Filter dialog state
    const [filterDialogOpen, setFilterDialogOpen] = useState(false)
    const [tempMaxPrice, setTempMaxPrice] = useState<number>(filters.maxPrice || 10000)
    const [tempMaxDistance, setTempMaxDistance] = useState<number>(filters.maxDistance || 50)

    // New state for dialogs
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [addToCartSheetOpen, setAddToCartSheetOpen] = useState(false);

    // Cart state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

    // Refs
    const observer = useRef<IntersectionObserver | null>(null)

    // Get user location from localStorage on mount
    useEffect(() => {
        const lat = initialData?.userLocation?.latitude
        const lng = initialData?.userLocation?.longitude

        if (initialData && lat && lng) {
            setUserLocation({
                latitude: lat,
                longitude: lng,
            })
        }
    }, [])

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchItems()
        }
    }, [loading, hasMore])

    const lastItemRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return

            if (observer.current) observer.current.disconnect()

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore()
                }
            })

            if (node) observer.current.observe(node)
        },
        [loading, hasMore, loadMore],
    )

    // Debounced search to trigger filter updates
    const debouncedSearch = useDebounce(searchQuery, 500)

    // Update filters when search changes
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            searchQuery: debouncedSearch || undefined
        }))
    }, [debouncedSearch])

    // Handlers
    const fetchItems = useCallback(async (reset = false) => {
        try {
            setLoading(true)
            setError(null)

            const queryParams = new URLSearchParams()
            if (filters.searchQuery) queryParams.set("searchQuery", filters.searchQuery)
            if (filters.category) queryParams.set("category", filters.category)
            if (filters.sortBy) queryParams.set("sortBy", filters.sortBy)
            if (filters.sortOrder) queryParams.set("sortOrder", filters.sortOrder)
            if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice.toString())
            if (filters.maxDistance && userLocation) {
                queryParams.set("maxDistance", filters.maxDistance.toString())
                queryParams.set("latitude", userLocation.latitude.toString())
                queryParams.set("longitude", userLocation.longitude.toString())
            }
            if (!reset && nextCursor) queryParams.set("cursor", nextCursor)
            queryParams.set("limit", ITEMS_PER_PAGE.toString())

            const accessToken = localStorage.getItem("accessToken")
            if (!accessToken) {
                router.push("/login")
                return
            }

            const res = await fetch(`${API_BASE_URL}/view-all/${type}?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (!res.ok) throw new Error("Failed to fetch items")

            const data = await res.json()
            if (!data.success) throw new Error(data.message || "Failed to fetch items")

            setItems((prev) => (reset ? data.data.items : [...prev, ...data.data.items]))
            setHasMore(data.data.metadata.hasNextPage)
            setNextCursor(data.data.metadata.nextCursor)
        } catch (err) {
            console.error("Error fetching items:", err)
            setError(err instanceof Error ? err.message : "Something went wrong")
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to load items",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [filters, nextCursor, router, toast, type, userLocation])

    useEffect(() => {
        fetchItems(true)
    }, [filters])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setFilters(prev => ({
            ...prev,
            searchQuery: searchQuery || undefined
        }))
    }

    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            maxPrice: tempMaxPrice < 10000 ? tempMaxPrice : undefined,
            maxDistance: tempMaxDistance < 50 ? tempMaxDistance : undefined,
        }))

        setFilterDialogOpen(false)

        toast({
            title: "Filters applied",
            description: "Results have been updated based on your filters",
        })
    }

    const handleClearFilters = () => {
        setTempMaxPrice(10000)
        setTempMaxDistance(50)

        setFilters(prev => ({
            ...prev,
            maxPrice: undefined,
            maxDistance: undefined,
        }))

        setFilterDialogOpen(false)

        toast({
            title: "Filters cleared",
            description: "Showing all results",
        })
    }

    const openAddToCartSheet = (product: Product) => {
        setSelectedProduct(product)
        setAddToCartSheetOpen(true)
    }

    const handleAddToCart = (item: CartItem) => {
        setCart((prev) => [...prev, item])
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

    const handleRemoveFromCart = (productId: string) => {
        setCart((prev) => prev.filter((p) => p.id !== productId));
    };
    {
        <CartDrawer
            open={cartDrawerOpen}
            onOpenChange={setCartDrawerOpen}
            cart={cart}
            customerEmail={userEmail}
            onRemove={handleRemoveFromCart}
            onClearCart={handleClearCart}
            accessToken={accessToken}
        />;
    }


    const hasActiveFilters = filters.maxPrice !== undefined || filters.maxDistance !== undefined

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-8">
                    {/* Title Row with Back Button */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => router.back()}
                            aria-label="Go back"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-3xl font-bold flex-1">
                            {type === "stalls" ? "All Stalls" : "All Products"}
                            {category && ` in ${category}`}
                        </h1>
                        {/* Cart Button - Positioned in header */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 relative hover:bg-muted/60 rounded-lg transition-all duration-200"
                            onClick={() => setCartDrawerOpen(true)}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Search and Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder={`Search ${type}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4"
                                />
                            </div>
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                        </form>

                        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="sm:w-auto relative">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Filter {type === "stalls" ? "Stalls" : "Products"}</DialogTitle>
                                    <DialogDescription>
                                        Adjust the filters below to refine your search results
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {/* Price Filter - Only for Products */}
                                    {type === "products" && (
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <Label>Maximum Price</Label>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-muted-foreground">₦0</span>
                                                    <span className="font-semibold">
                                                        {tempMaxPrice >= 10000 ? "Any price" : `₦${tempMaxPrice.toLocaleString()}`}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[tempMaxPrice]}
                                                    onValueChange={(value) => setTempMaxPrice(value[0])}
                                                    min={0}
                                                    max={10000}
                                                    step={100}
                                                    className="w-full"
                                                />
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-sm text-muted-foreground">₦</span>
                                                    <Input
                                                        type="number"
                                                        value={tempMaxPrice >= 10000 ? "" : tempMaxPrice}
                                                        onChange={(e) => {
                                                            const val = e.target.value === "" ? 10000 : Math.min(10000, Math.max(0, parseInt(e.target.value) || 0))
                                                            setTempMaxPrice(val)
                                                        }}
                                                        placeholder="Enter amount"
                                                        className="flex-1"
                                                        min={0}
                                                        max={10000}
                                                        step={100}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Distance Filter - Only for Stalls */}
                                    {type === "stalls" && (
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <Label>Maximum Distance</Label>
                                                {!userLocation && (
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        Location not available for distance filtering
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-muted-foreground">0 km</span>
                                                    <span className="font-semibold">
                                                        {tempMaxDistance >= 50 ? "Any distance" : `${tempMaxDistance} km`}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[tempMaxDistance]}
                                                    onValueChange={(value) => setTempMaxDistance(value[0])}
                                                    min={0}
                                                    max={50}
                                                    step={1}
                                                    className="w-full"
                                                    disabled={!userLocation}
                                                />
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        type="number"
                                                        value={tempMaxDistance >= 50 ? "" : tempMaxDistance}
                                                        onChange={(e) => {
                                                            const val = e.target.value === "" ? 50 : Math.min(50, Math.max(0, parseInt(e.target.value) || 0))
                                                            setTempMaxDistance(val)
                                                        }}
                                                        placeholder="Enter distance"
                                                        className="flex-1"
                                                        disabled={!userLocation}
                                                        min={0}
                                                        max={50}
                                                        step={1}
                                                    />
                                                    <span className="text-sm text-muted-foreground">km</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active Filters Summary */}
                                    {hasActiveFilters && (
                                        <div className="space-y-2 p-3 bg-muted rounded-lg">
                                            <p className="text-sm font-medium">Active Filters:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {filters.maxPrice && filters.maxPrice < 10000 && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded-md text-xs">
                                                        Price: ≤ ₦{filters.maxPrice.toLocaleString()}
                                                    </span>
                                                )}
                                                {filters.maxDistance && filters.maxDistance < 50 && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded-md text-xs">
                                                        Distance: ≤ {filters.maxDistance} km
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearFilters}
                                        className="flex-1"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>
                                    <Button
                                        onClick={handleApplyFilters}
                                        className="flex-1"
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <div className="text-center py-12">
                        <p className="text-destructive mb-4">{error}</p>
                        <Button onClick={() => fetchItems(true)}>Try Again</Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((item, index) => {
                                const isLastItem = index === items.length - 1
                                const ref = isLastItem ? lastItemRef : null

                                if (type === "stalls") {
                                    return (
                                        <div ref={ref} key={item.id}>
                                            <StallCard stall={item as StallWithDetails} router={router} />
                                        </div>
                                    )
                                }

                                return (
                                    <div ref={ref} key={item.id}>
                                        <ProductCard
                                            key={item.id}
                                            product={item}
                                            isFavorite={"isFavorite" in item ? item.isFavorite : false}
                                            onToggleFavorite={handleToggleFavorite}
                                            onAddToCart={openAddToCartSheet}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        {loading && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {!loading && !hasMore && items.length > 0 && (
                            <p className="text-center text-muted-foreground py-8">No more items to load</p>
                        )}

                        {!loading && items.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No items found</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CartDrawer
                open={cartDrawerOpen}
                onOpenChange={setCartDrawerOpen}
                cart={cart}
                customerEmail={userEmail}
                onClearCart={handleClearCart}
                onRemove={handleRemoveFromCart}
                accessToken={accessToken}
            />


            <AddToCartSheet
                open={addToCartSheetOpen}
                onOpenChange={setAddToCartSheetOpen}
                product={selectedProduct}
                userAddress={String(initialData?.userLocation?.addressRaw)}
                onAddToCart={handleAddToCart}
            />
        </div>
    )
}