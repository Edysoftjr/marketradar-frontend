"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Loader2,
    Edit,
    Trash2,
    Package,
    ShoppingBag,
    ShoppingCart,
} from "lucide-react";
import { Size, Addon, Product, Category } from "@/types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const userFavorites = await getUserFavorites();
            setFavorites(userFavorites);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = (productId: string, isFavorite: boolean) => {
        setFavorites((prev) =>
            isFavorite ? [...prev, productId] : prev.filter((id) => id !== productId)
        );
    };

    return {
        favorites,
        loading,
        fetchFavorites,
        handleToggleFavorite,
        isFavorite: (productId: string) => favorites.includes(productId),
    };
};

const getUserFavorites = async (): Promise<string[]> => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        return data.favorites || []; // Assuming the API returns { favorites: string[] }
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};


interface ProductData {
    id: string;
    name: string;
    images: string[];
    description: string | null;
    category: string;
    quantity: number;
    payOnOrder: boolean;
    stallId: string;
    price?: number;
    _count?: {
        orders: number;
        favouritedBy: number;
    };
    sizes?: Size[];
    addons?: Addon[];
    discount?: number; // discount value (e.g., 20 means 20%)
    discountType?: "percentage" | "fixed";
    updatedAt?: string;
    createdAt: string;
    isFavorite?: boolean;
}

interface ProductCardProps {
    product: ProductData;
    isOwner: boolean;
    onEdit?: (product: Partial<ProductData> | null) => void;
    onDelete?: (productId: string) => void;
    onOrder: (product: ProductData) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (productId: string, isFavorite: boolean) => void;
    toggleFavoriteProduct: (
        productId: string
    ) => Promise<{ isFavorite: boolean }>;
    onAddToCart: (product: Product) => void;
}


function ProductCard({
    product,
    isOwner,
    onEdit,
    onDelete,
    isFavorite = false,
    onToggleFavorite,
    toggleFavoriteProduct,
    onAddToCart
}: ProductCardProps) {
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
    const [localIsFavorite, setLocalIsFavorite] = useState(
        product.isFavorite ?? isFavorite
    );
    const [favoriteError, setFavoriteError] = useState<string | null>(null);

    useEffect(() => {
        setLocalIsFavorite(product.isFavorite ?? isFavorite);
    }, [isFavorite, product.isFavorite]);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOwner || isLoadingFavorite) return;

        setIsLoadingFavorite(true);
        setFavoriteError(null);

        // Optimistic update
        const previousState = localIsFavorite;
        setLocalIsFavorite(!previousState);

        try {
            const result = await toggleFavoriteProduct(product.id);

            // Update with server response
            setLocalIsFavorite(result.isFavorite);

            // Call the parent callback if provided
            if (onToggleFavorite) {
                onToggleFavorite(product.id, result.isFavorite);
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);

            // Revert optimistic update on error
            setLocalIsFavorite(previousState);
            setFavoriteError("Failed to update favorite");

            // Clear error after 3 seconds
            setTimeout(() => setFavoriteError(null), 3000);
        } finally {
            setIsLoadingFavorite(false);
        }
    };

    // Add to Cart handler
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const productForCart: Product = {
            ...product,
            category: product.category as Category,
            price: product.price ?? 0
        }
        onAddToCart(productForCart);
    };

    const isOutOfStock = product.quantity <= 0;
    const price = product.sizes?.[0]?.price || 0;
    const sizesCount = product.sizes?.length || 0;
    const favCount = product._count?.favouritedBy ?? 0;
    const orderCount = product._count?.orders ?? 0;

    return (
        <Card className="group relative hover:shadow-xl transition-all duration-300 border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden hover:-translate-y-1">
            {/* Out of stock overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                    <Badge variant="destructive" className="text-white shadow-lg">
                        Out of Stock
                    </Badge>
                </div>
            )}

            <div className="relative">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                        src={
                            product.images?.length > 0
                                ? `${API_BASE_URL}${product.images[0]}`
                                : "/rest1.jpg"
                        }
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Gradient overlay for better button visibility */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                </div>

                {/* Enhanced stats overlay */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-1 sm:gap-2 text-white text-[10px] sm:text-sm">
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-black/20 backdrop-blur-xl px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10">
                            <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-400" />
                            <span className="font-semibold">{favCount}</span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-black/20 backdrop-blur-xl px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10">
                            <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400" />
                            <span className="font-semibold">{orderCount}</span>
                        </div>
                    </div>
                </div>

                {/* Action buttons container */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                    {/* Favorites button - show for non-owners */}
                    {!isOwner && (
                        <div className="relative">
                            <Button
                                size="sm"
                                variant="ghost"
                                className={`
                  relative rounded-full w-9 h-9 p-0 shadow-lg backdrop-blur-md border transition-all duration-300 transform hover:scale-110
                  ${localIsFavorite
                                        ? "bg-red-500/95 hover:bg-red-600 border-red-300/50 text-white shadow-red-500/30"
                                        : "bg-white/90 hover:bg-white border-white/70 text-gray-600 hover:text-red-500 shadow-black/10"
                                    }
                  ${isLoadingFavorite
                                        ? "animate-pulse cursor-not-allowed"
                                        : "hover:shadow-xl"
                                    }
                  ${favoriteError ? "ring-2 ring-red-400 ring-opacity-50" : ""}
                `}
                                onClick={handleToggleFavorite}
                                disabled={isLoadingFavorite}
                                title={
                                    localIsFavorite ? "Remove from favorites" : "Add to favorites"
                                }
                            >
                                {isLoadingFavorite ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Heart
                                        className={`w-4 h-4 transition-all duration-300 ${localIsFavorite
                                            ? "fill-current scale-110 drop-shadow-sm"
                                            : "hover:scale-110"
                                            }`}
                                    />
                                )}
                            </Button>

                            {/* Error indicator */}
                            {favoriteError && (
                                <div className="absolute -bottom-8 right-0 text-xs text-red-500 bg-white/90 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    {favoriteError}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Owner action buttons */}
                    {isOwner && (
                        <div className="flex flex-col gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-full w-9 h-9 p-0 bg-blue-500/90 hover:bg-blue-600 shadow-lg backdrop-blur-md text-white border-blue-300/50 transition-all duration-200 hover:scale-110"
                                onClick={() => {
                                    if (onEdit) {
                                        onEdit(product)
                                    }
                                }}
                                title="Edit product"
                            >
                                <Edit className="w-3.5 h-3.5" />
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="rounded-full w-9 h-9 p-0 bg-red-500/90 hover:bg-red-600 shadow-lg backdrop-blur-md border-red-300/50 transition-all duration-200 hover:scale-110"
                                        title="Delete product"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="sm:max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2">
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                            Delete Product
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete &quot;{product.name}
                                            &quot;? This action cannot be undone and will permanently
                                            remove the product from your inventory.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                if (onDelete) {
                                                    onDelete(product.id)
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </div>

            <CardContent className="p-5 space-y-4">
                {/* Product title and rating */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-lg line-clamp-2 text-foreground leading-tight">
                        {product.name}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Product stats */}
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-medium">
                            {sizesCount} size{sizesCount !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-medium">
                            {orderCount}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span
                            className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"
                                }`}
                        />
                        <span className="font-medium">
                            {product.category.toLowerCase() === "MEAL"
                                ? isOutOfStock
                                    ? "Sold Out"
                                    : "Ready"
                                : isOutOfStock
                                    ? "Out of stock"
                                    : `${product.quantity} in stock`}
                        </span>
                    </div>

                </div>

                {/* Price and order button */}
                <div className="flex items-center justify-between pt-2">
                    {/* Price and order button */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="space-y-1">
                            <span className="text-2xl font-bold text-emerald-600">
                                ₦{price.toLocaleString()}
                            </span>
                            {sizesCount > 1 ? (
                                <p className="text-xs text-muted-foreground">Starting price</p>
                            ) : sizesCount === 1 ? (
                                <p className="text-xs text-muted-foreground">Base price</p>
                            ) : null}
                        </div>
                    </div>



                    {!isOwner && !isOutOfStock && (
                        <Button
                            size="sm"
                            onClick={handleAddToCart}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-sm font-medium"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add To Cart
                        </Button>
                    )}

                    {!isOwner && isOutOfStock && (
                        <Button
                            size="sm"
                            disabled
                            variant="outline"
                            className="cursor-not-allowed opacity-50"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Out of Stock
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default ProductCard;
