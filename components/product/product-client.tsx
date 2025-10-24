//product-client.tsx - general product component to be reused across pages
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Loader2,
    Heart,
    ShoppingBag,
    Store,
    ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { formatLabel } from '@/constants/stallTypes';


const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const ProductCard = ({
    product,
    isFavorite,
    onToggleFavorite,
    onAddToCart,
}: {
    product: Product;
    isFavorite?: boolean;
    onToggleFavorite: (productId: string) => Promise<void>;
    onAddToCart: (product: Product) => void;
}) => {
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

        setIsLoadingFavorite(true);
        setFavoriteError(null);

        const previousState = localIsFavorite;
        setLocalIsFavorite(!previousState);

        try {
            await onToggleFavorite(product.id);
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            setLocalIsFavorite(previousState);
            setFavoriteError("Failed to update favorite");
            setTimeout(() => setFavoriteError(null), 3000);
        } finally {
            setIsLoadingFavorite(false);
        }
    };

    // Add to Cart handler
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart(product);
    };

    const image = product.images?.length
        ? `${API_BASE_URL}${product.images[0]}`
        : "/rest1.jpg";
    const favCount = product._count?.favouritedBy ?? 0;
    const orderCount = product._count?.orders ?? 0;

    // Determine price display based on sizes
    const sizes = product.sizes ?? [];
    let priceDisplay = "Price not available";

    if (sizes.length === 1) {
        priceDisplay = `₦${sizes[0].price.toLocaleString()}`;
    } else if (sizes.length > 1) {
        const minPrice = Math.min(...sizes.map((size) => size.price));
        const maxPrice = Math.max(...sizes.map((size) => size.price));
        priceDisplay =
            minPrice === maxPrice
                ? `₦${minPrice.toLocaleString()}`
                : `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`;
    }

    return (
        <Card className="group cursor-pointer hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 transform hover:-translate-y-1 sm:hover:-translate-y-3 bg-card/60 backdrop-blur-xl overflow-hidden border border-border/50 sm:border-0 shadow-md sm:shadow-lg shadow-black/5 dark:shadow-black/20 rounded-2xl sm:rounded-3xl">
            <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/rest1.jpg";
                        }}
                    />

                    {/* Enhanced gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-30 transition-all duration-700" />

                    {/* Floating category badge */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <Badge className="bg-black/20 text-white backdrop-blur-xl text-[10px] sm:text-xs border-0 shadow-lg rounded-lg sm:rounded-xl px-2 py-0.5 sm:px-3 sm:py-1">
                            {formatLabel(product.category)}
                        </Badge>
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

                    {/* Interactive overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Button
                            size="sm"
                            onClick={handleAddToCart}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transform scale-0 group-hover:scale-100 transition-all duration-300 rounded-xl sm:rounded-2xl shadow-xl text-xs"
                        >
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </div>

                    {/* Enhanced favorite button */}
                    <Button
                        variant="ghost"
                        onClick={handleToggleFavorite}
                        disabled={isLoadingFavorite}
                        size="sm"
                        title={
                            localIsFavorite ? "Remove from favorites" : "Add to favorites"
                        }
                        className={`
              absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300
              p-1 sm:p-2 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-md border transform
              ${localIsFavorite
                                ? "bg-red-500/95 hover:bg-red-600 border-red-300/50 text-white shadow-red-500/30"
                                : "bg-black/10 hover:bg-red-500/20 border-white/10 text-white hover:text-red-400 shadow-black/10"
                            }
              ${isLoadingFavorite
                                ? "animate-pulse cursor-not-allowed"
                                : "hover:scale-110 hover:shadow-xl"
                            }
              ${favoriteError ? "ring-2 ring-red-400 ring-opacity-50" : ""}
            `}
                    >
                        {isLoadingFavorite ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : localIsFavorite ? (
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white fill-white scale-110 transition-all duration-300 drop-shadow-sm" />
                        ) : (
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 hover:scale-110" />
                        )}
                    </Button>
                </div>

                <CardContent className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {product.name}
                        </h3>

                        <p className="text-[10px] sm:text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Enhanced price display */}
                    <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {priceDisplay}
                            </span>
                        </div>
                    </div>

                    {/* Enhanced engagement metrics */}
                    <div className="flex items-center justify-between pt-1.5 sm:pt-3">
                        <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-50/50 dark:bg-red-900/10 rounded-full border border-red-200/30 dark:border-red-800/30">
                            <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500" />
                            <span className="text-[10px] sm:text-xs font-medium text-red-600 dark:text-red-400">
                                {favCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50/50 dark:bg-green-900/10 rounded-full border border-green-200/30 dark:border-green-800/30">
                            <ShoppingBag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                            <span className="text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400">
                                {orderCount}
                            </span>
                        </div>
                    </div>

                    {/* Enhanced stall info */}
                    {product.stall && (
                        <div className="pt-1.5 sm:pt-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted/30 rounded-lg sm:rounded-xl border border-border/30">
                                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Store className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-muted-foreground/80 truncate font-medium">
                                    {product.stall.name}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </div>
        </Card>
    );
};

export default ProductCard;
