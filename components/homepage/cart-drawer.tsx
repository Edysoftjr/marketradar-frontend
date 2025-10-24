import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { usePaystack } from "@/hooks/usePaystack";
import { fetchWithTokenRefresh } from '@/lib/server/token-refresh';


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerEmail: string | undefined;
  cart: CartItem[];
  onRemove: (productId: string) => void;
  onClearCart: () => void; // Add this prop to clear the entire cart
  accessToken: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onOpenChange,
  cart,
  customerEmail,
  onRemove,
  onClearCart,
  accessToken,
}) => {
  const { pay } = usePaystack();
  const [isProcessing, setIsProcessing] = useState(false);

  // Helpers
  const getImageUrl = (item: CartItem): string =>
    item.images && item.images.length
      ? `${API_BASE_URL}${item.images[0]}`
      : "/rest1.jpg";

  const getSize = (item: CartItem) => item.selectedSize;
  const getAddons = (item: CartItem) => item.selectedAddons;

  const getProductTotal = (item: CartItem): number => {
    const size = getSize(item);
    const sizePrice =
      typeof size?.price === "number" && size.price > 0
        ? size.price
        : item.price ?? 0;
    const addonsTotal = getAddons(item).reduce(
      (sum, a) => sum + (a.price ?? 0),
      0
    );
    const quantity = item.quantity ?? 1;
    return (sizePrice + addonsTotal) * quantity;
  };

  const totalPrice = cart.reduce((sum, p) => sum + getProductTotal(p), 0);
  const itemCount = cart.reduce((sum, p) => sum + (p.quantity ?? 1), 0);

  // Check payment method - determine if all items are pay-on-order or pay-on-delivery
  const checkPaymentMethod = () => {
    const hasPayOnOrder = cart.some(item => item.payOnOrder === true);
    const hasPayOnDelivery = cart.some(item => item.payOnOrder === false);

    if (hasPayOnOrder && hasPayOnDelivery) {
      return 'mixed'; // Mixed payment types
    } else if (hasPayOnOrder) {
      return 'online'; // All items require online payment
    } else {
      return 'delivery'; // All items are pay on delivery
    }
  };

  // Create order without payment (for pay-on-delivery)
  const createOrderWithoutPayment = async () => {
    setIsProcessing(true);
    try {
      const data = JSON.stringify({
        // No reference for pay-on-delivery orders
        items: cart.map((c) => ({
          productId: c.id,
          quantity: c.quantity,
          price: getProductTotal(c) / (c.quantity ?? 1), // Price per unit
          size: c.selectedSize,
          addons: c.selectedAddons,
        })),
        total: totalPrice,
      });

      const response = await fetchWithTokenRefresh(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
        accessToken: accessToken,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Order creation failed: ${response.status}`);
      }

      const order = await response.json();
      console.log("✅ Order created (Pay on Delivery):", order);

      // TODO: Show success message to user
      // TODO: Navigate to order confirmation page or show QR code
      // if (order.qrCodeUrl) {
      //   // Show QR code for order tracking
      // }

      // Clear cart after successful order
      onClearCart();
      onOpenChange(false);

      return order;
    } catch (err) {
      console.error("❌ Failed to create order:", err);
      alert(err instanceof Error ? err.message : "Failed to create order. Please try again.");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Create order with Paystack payment (for pay-on-order)
  const createOrderWithPayment = () => {
    const reference = `FR-${Date.now()}`;

    pay({
      email: (customerEmail ? customerEmail : "customer@marketradar.com"),
      amount: totalPrice * 100,
      reference,
      onSuccess: async (res) => {
        setIsProcessing(true);
        const data = JSON.stringify({
          reference,
          items: cart.map((c) => ({
            productId: c.id,
            quantity: c.quantity,
            price: getProductTotal(c) / (c.quantity ?? 1), // Price per unit
            size: c.selectedSize,
            addons: c.selectedAddons,
          })),
          total: totalPrice,
        });

        try {
          const response = await fetchWithTokenRefresh(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
            accessToken: accessToken,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Order creation failed: ${response.status}`);
          }

          const order = await response.json();
          console.log("✅ Order created (Paid Online):", order);

          // TODO: Show success message
          // if (order.qrCodeUrl) {
          //   // Optionally show QR code in UI
          // }

          // Clear cart after successful order
          onClearCart();
          onOpenChange(false);
        } catch (err) {
          console.error("❌ Failed to confirm order:", err);
          alert("Payment successful but order confirmation failed. Please contact support.");
        } finally {
          setIsProcessing(false);
        }
      },
      onClose: () => {
        console.log("❌ Payment closed by user");
        setIsProcessing(false);
      },
    });
  };

  // Main checkout handler
  const handleCheckout = async () => {
    if (!cart.length) return;

    const paymentMethod = checkPaymentMethod();

    if (paymentMethod === 'mixed') {
      alert("Cannot mix pay-on-order and pay-on-delivery items in the same cart. Please create separate orders.");
      return;
    }

    if (paymentMethod === 'delivery') {
      // Pay on delivery - create order without payment
      await createOrderWithoutPayment();
    } else {
      // Pay online - initiate Paystack payment
      // Note: Cart will be cleared in the onSuccess callback
      onOpenChange(false);
      createOrderWithPayment();
    }
  };

  // Get payment method label for UI
  const getPaymentMethodLabel = () => {
    const method = checkPaymentMethod();
    if (method === 'mixed') return 'Mixed Payment (Not Allowed)';
    if (method === 'delivery') return 'Pay on Delivery';
    return 'Pay Now';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-3 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
          </div>
          <SheetDescription className="text-base">
            {cart.length === 0
              ? "Your shopping cart is empty."
              : `${itemCount} item${itemCount > 1 ? "s" : ""} ready for checkout`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-6 rounded-full bg-muted/50">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Your cart is empty
                </h3>
                <p className="text-sm text-muted-foreground/80">
                  Add some products to get started
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.map((item, index) => {
                  const image = getImageUrl(item);
                  const size = getSize(item);
                  const addons = getAddons(item);
                  const qty = item.quantity ?? 1;
                  const productTotal = getProductTotal(item);

                  return (
                    <div
                      key={`${item.id}-${item.selectedSize?.label || ""}-${item.selectedAddons?.map(a => a.id).join("-") || ""}-${index}`}
                      className="group bg-card rounded-xl border border-border/50 p-4 hover:shadow-md hover:border-border transition-all duration-200"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={image}
                            alt={item.name ?? "product image"}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm leading-tight truncate">
                                {item.name}
                              </h3>
                              {item.payOnOrder === false && (
                                <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Pay on Delivery
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemove(item.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>

                          <div className="text-xs space-y-1">
                            {size && (
                              <div className="flex justify-between">
                                <span>Size: {size.label}</span>
                                <span className="font-medium">
                                  ₦{size.price.toLocaleString()}
                                </span>
                              </div>
                            )}

                            {addons.length > 0 && (
                              <div className="space-y-1">
                                {addons.map((addon) => (
                                  <div
                                    key={addon.id}
                                    className="flex justify-between text-muted-foreground"
                                  >
                                    <span>+ {addon.label}</span>
                                    <span className="font-medium">
                                      ₦{(addon.price ?? 0).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="font-bold text-sm">
                              ₦{productTotal.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Qty: {qty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-6 mt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-medium">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className={`font-medium ${checkPaymentMethod() === 'mixed' ? 'text-red-600' : 'text-blue-600'}`}>
                      {getPaymentMethodLabel()}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-lg font-bold">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleCheckout}
                  disabled={isProcessing || checkPaymentMethod() === 'mixed'}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    checkPaymentMethod() === 'delivery' ? 'Place Order (Pay on Delivery)' : 'Place Order & Pay'
                  )}
                </Button>

                {checkPaymentMethod() === 'mixed' && (
                  <p className="text-xs text-red-600 text-center">
                    Cannot mix pay-on-order and pay-on-delivery items. Please remove items to continue.
                  </p>
                )}

                <Button
                  variant="outline"
                  className="w-full h-10 rounded-xl"
                  onClick={() => onOpenChange(false)}
                  disabled={isProcessing}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
