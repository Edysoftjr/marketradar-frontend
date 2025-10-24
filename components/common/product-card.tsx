"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Store, MoreVertical, ShoppingCart } from "lucide-react";
import { Size, Addon, Product, Category } from "@/types";

interface ProductData {
  id: string;
  name: string;
  images: string[];
  description: string | null;
  category: string;
  quantity: number;
  stallId: string;
  price?: number;
  payOnOrder: boolean;
  sizes?: Size[];
  addons?: Addon[];
  discount?: number;
  discountType?: "percentage" | "fixed";
  createdAt?: string;
  isFavorite?: boolean;
  stallName: string;
}

interface ProductCardProps {
  product: ProductData;
  isOwner?: boolean;
  onEdit?: (product: Partial<ProductData> | null) => void;
  onDelete?: (productId: string) => void;
  onOrder?: (product: ProductData) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => Promise<void>;
  showStallInfo?: boolean;
  onAddToCart: (product: Product) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ProductCard({
  product,
  isOwner = false,
  onEdit,
  isFavorite = false,
  onToggleFavorite,
  showStallInfo = true,
  onAddToCart,
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

    if (isOwner || isLoadingFavorite || !onToggleFavorite) return;

    setIsLoadingFavorite(true);
    setFavoriteError(null);

    // Optimistic update
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
    const productForCart: Product = {
      ...product,
      category: product.category as Category,
      price: product.price ?? 0
    }
    onAddToCart(productForCart);
  };

  const isOutOfStock = product.quantity <= 0;
  const price = product.sizes?.[0]?.price || product.price || 0;
  const sizesCount = product.sizes?.length || 0;

  return (
    <Card className="group relative hover:shadow-xl transition-all duration-300 border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden hover:-translate-y-1">
      {isOutOfStock && (
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
          <p className="text-white font-semibold px-4 py-2 bg-red-500/20 backdrop-blur rounded-lg border border-red-500/30">
            Out of Stock
          </p>
        </div>
      )}

      <div className="relative">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={
              product.images[0]?.startsWith("http")
                ? product.images[0]
                : `${API_BASE_URL}${product.images[0]}` || "/placeholder.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 rounded-full w-9 h-9 p-0 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
          onClick={handleToggleFavorite}
          disabled={isLoadingFavorite}
        >
          <Heart
            className={`w-4 h-4 ${localIsFavorite
              ? "text-rose-500 fill-current"
              : "text-muted-foreground"
              }`}
          />
        </Button>

        {isOwner && (
          <div className="absolute top-3 right-14">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-9 h-9 p-0 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(product);
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          {showStallInfo && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Store className="w-4 h-4" />
              <p className="text-sm line-clamp-1">{product.stallName}</p>
            </div>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-lg text-emerald-600">
              ₦{price.toLocaleString()}
            </p>
            {sizesCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {sizesCount} size{sizesCount > 1 ? "s" : ""} available
              </p>
            )}
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
      </CardContent>
    </Card>
  );
}
