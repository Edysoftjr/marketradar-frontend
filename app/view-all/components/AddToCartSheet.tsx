/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
    CreditCard,
    Truck,
    ShoppingCart,
    Loader2,
} from "lucide-react"
import type { Product } from "@/types/product"
import type { CartItem } from "@/types/cart"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

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

export default AddToCartSheet