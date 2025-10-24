import type React from "react"
import Image from "next/image"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import { ShoppingCart, Filter } from "lucide-react"
import NotificationPanel from "@/components/notifications/notification-panel"


const Header = ({
    accessToken,
    onOpenFilter,
    cart,
    onOpenCart,
}: {
    router: AppRouterInstance;
    accessToken: string;
    onOpenFilter: () => void;
    cart: Product[];
    onOpenCart: () => void;
}) => (
    <header className="sticky top-0 z-40 bg-background/75 shadow-lg backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto mb-0 px-3 sm:px-4 py-3 sm:py-4">
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
                        <p className="text-xs text-muted-foreground font-medium">
                            Discover local markets
                        </p>
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
);

export default Header