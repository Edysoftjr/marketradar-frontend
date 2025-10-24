import ProductCard from "./ProductCard";
import { ProductWithStall, Product } from "@/types/product";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

interface FavoriteProductsProps {
    favoriteProducts: ProductWithStall[];
    onToggleFavorite: (productId: string) => Promise<void>;
    openAddToCart: (product: Product) => void;
}

function FavoriteProducts({
    favoriteProducts,
    onToggleFavorite,
    openAddToCart,
}: FavoriteProductsProps) {
    return (
        <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 flex items-center justify-center border border-rose-200/30">
                        <Heart className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">
                            Favorite Products
                        </CardTitle>
                        <CardDescription>
                            Products you&apos;ve saved for later
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {favoriteProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {favoriteProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    stallName: product.stall?.name
                                }}
                                onAddToCart={openAddToCart}
                                onToggleFavorite={onToggleFavorite}
                                showStallInfo={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <p className="text-foreground font-semibold text-lg mb-2">
                            No favorite products yet
                        </p>
                        <p className="text-muted-foreground">
                            Start browsing to add products to your favorites
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default FavoriteProducts