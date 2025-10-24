"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  BadgePercent,
  Megaphone,
  Plus,
  MessageSquare,
  Package,
  X,
} from "lucide-react";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/server/product";
import CartDrawer from "@/components/homepage/cart-drawer";
import { CartItem } from "@/types/cart";
import { CreateProductData, UpdateProductData, Size, Addon } from "@/types";
import {
  SearchFilters,
  userAddress
} from "@/types/homepage";
import ProductCard from "./components/ProductCard";
import { Product } from "@/types/product";
import Header from "./components/Header"
import AddToCartSheet from "./components/AddToCartSheet";
import FilterDialog from "./components/FilterDialog";
import StallHeader from "./components/StallHeader";
import AddProductDialog from "./components/AddProductDialog";
import CommentsSection from "./components/CommentSection";
import type { Comment } from "./components/CommentSection";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
type ResponseType = "success" | "error" | "warning" | "info";

interface ResponseState {
  show: boolean;
  type: ResponseType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const ResponseNotification: React.FC<{
  response: ResponseState;
  onClose: () => void;
}> = ({ response, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (response.show) {
      setIsVisible(true);
      setIsExiting(false);

      if (response.autoClose !== false) {
        const duration = response.duration || (response.type === "success" ? 5000 : 7000);
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [response.show, response.autoClose, response.duration, response.type, handleClose]);

  if (!response.show || !isVisible) return null;

  const getIcon = () => {
    switch (response.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "backdrop-blur-sm border shadow-xl";
    switch (response.type) {
      case "success":
        return `${baseStyles} bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200/50 dark:border-emerald-800/50`;
      case "error":
        return `${baseStyles} bg-red-50/95 dark:bg-red-950/95 border-red-200/50 dark:border-red-800/50`;
      case "warning":
        return `${baseStyles} bg-amber-50/95 dark:bg-amber-950/95 border-amber-200/50 dark:border-amber-800/50`;
      default:
        return `${baseStyles} bg-blue-50/95 dark:bg-blue-950/95 border-blue-200/50 dark:border-blue-800/50`;
    }
  };

  const getTextStyles = () => {
    switch (response.type) {
      case "success":
        return {
          title: "text-emerald-900 dark:text-emerald-100",
          message: "text-emerald-800 dark:text-emerald-200",
        };
      case "error":
        return {
          title: "text-red-900 dark:text-red-100",
          message: "text-red-800 dark:text-red-200",
        };
      case "warning":
        return {
          title: "text-amber-900 dark:text-amber-100",
          message: "text-amber-800 dark:text-amber-200",
        };
      default:
        return {
          title: "text-blue-900 dark:text-blue-100",
          message: "text-blue-800 dark:text-blue-200",
        };
    }
  };

  const textStyles = getTextStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-out ${isExiting
        ? "animate-out fade-out-0 slide-out-to-right-2 duration-300"
        : "animate-in fade-in-0 slide-in-from-top-2 duration-500"
        }`}
    >
      <div className={`p-4 rounded-xl ${getStyles()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 space-y-1 min-w-0">
            <h4 className={`font-semibold text-sm leading-tight ${textStyles.title}`}>
              {response.title}
            </h4>
            <p className={`text-sm leading-relaxed ${textStyles.message}`}>
              {response.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
          >
            <X className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {response.autoClose !== false && (
          <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ease-linear ${response.type === "success"
                ? "bg-emerald-500"
                : response.type === "error"
                  ? "bg-red-500"
                  : response.type === "warning"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              style={{
                animation: `shrink ${response.duration || (response.type === "success" ? 5000 : 7000)}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

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

interface StallClientProps {
  stallData: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    images: string[];
    area: string | null;
    city: string | null;
    state: string | null;
    landmark: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    rating: number;
    subscribers: number;
    revenue: number;
    totalOrders: number;
    createdAt: string;
  };
  products: ProductData[];
  comments: Comment[];
  userAddress: userAddress;
  accessToken: string;
  isOwner: boolean;
  isSubscribed?: boolean;
  userEmail: string | undefined;
}

export default function StallClient({
  stallData,
  products,
  comments,
  accessToken,
  isOwner,
  userAddress,
  userEmail,
  isSubscribed: initialIsSubscribed = false,
}: StallClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [response, setResponse] = useState<ResponseState>({
    show: false,
    type: "info",
    title: "",
    message: "",
    autoClose: true,
    duration: 5000,
  });
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Partial<ProductData> | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const productCount = products.length;
  const commentCount = comments.length;
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(
    new Set()
  );

  // New state for dialogs
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addToCartSheetOpen, setAddToCartSheetOpen] = useState(false);
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const response = await fetch(
        `${API_BASE_URL}/subscriptions/stalls/${stallData.id}/subscribe`,
        {
          method: isSubscribed ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setIsSubscribed(!isSubscribed);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const showResponse = (
    type: ResponseType,
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    setResponse({
      show: true,
      type,
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? (type === "success" ? 5000 : type === "error" ? 8000 : 6000),
    });
  };

  const closeResponse = () => {
    setResponse((prev) => ({ ...prev, show: false }));
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      showResponse(
        "error",
        "Not Supported",
        "Geolocation is not supported by this browser.",
        { duration: 6000 }
      );
      return;
    }

    setIsGeolocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
          const response = await fetch(
            `${API_BASE_URL}/stalls/${stallData.id}/location`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ latitude, longitude }),
            }
          );

          if (response.ok) {
            showResponse(
              "success",
              "Location Updated Successfully! 📍",
              "Your stall location has been set and saved.",
              { duration: 5000 }
            );
            router.refresh();
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update location");
          }
        } catch (error) {
          showResponse(
            "error",
            "Failed to Save Location",
            error instanceof Error ? error.message : "Unable to save your location. Please try again.",
            { duration: 8000 }
          );
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        setIsGeolocating(false);

        let errorMessage = "Unable to get your location.";

        if (error && typeof error === "object" && "code" in error) {
          switch (error.code) {
            case 1:
              errorMessage = "Location permission denied. Please enable location services in your browser settings.";
              break;
            case 2:
              errorMessage = "Location information is unavailable. Please check your connection.";
              break;
            case 3:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = `Unable to access location (Error ${error.code}). Please try again.`;
          }
        }

        showResponse("error", "Location Error", errorMessage, { duration: 8000 });
      }
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (
    productData: CreateProductData,
    updateFlag: boolean = false
  ): Promise<void> => {

    const accessToken = localStorage.getItem("accessToken") ?? undefined;

    const payload: CreateProductData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      payOnOrder: productData.payOnOrder,
      category: productData.category,
      stallId: stallData.id,
      sizes: productData.sizes,
      addons: productData.addons,
      images: productData.images,
      quantity: productData.quantity ?? 1,
    };

    console.log("Submitting product data:", payload);

    try {
      let result;
      if (updateFlag) {
        if (!productData.id)
          throw new Error("Product ID is required for update");

        const updatePayload: UpdateProductData = {
          ...productData,
          id: productData.id,
        };

        result = await updateProduct(
          productData.id,
          updatePayload,
          accessToken
        );
      } else {
        result = await createProduct(payload, accessToken);
      }
      console.log("Product created:", result);
      setAddProductOpen(false);
      setEditingProduct(null);
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setLoading(true);
    try {
      const result = await deleteProduct(productId, accessToken);

      if (result.success) {
        router.refresh();
      } else {
        console.error("Delete failed:", result.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderProduct = (product: ProductData) => {
    router.push(`/products/${product.id}/order`);
  };

  const handleAddComment = async (comment: string, rating?: number) => {
    setLoading(true);
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const response = await fetch(
        `${API_BASE_URL}/stalls/${stallData.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ content: comment, rating }),
        }
      );

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavoriteProduct = async (
    productId: string
  ): Promise<{ isFavorite: boolean }> => {
    try {
      const accessToken = localStorage.getItem("accessToken") ?? undefined;

      const response = await fetch(`${API_BASE_URL}/favourites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const data = await response.json();
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  };

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const handleClearCart = () => {
    setCart([]);
  };

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

  const openAddToCartSheet = (product: Product) => {
    setSelectedProduct(product);
    setAddToCartSheetOpen(true);
  };

  const handleApplyFilters = async (appliedFilters: SearchFilters) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/homepage/filters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(appliedFilters),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Filters applied",
          description: "Your preferences have been saved.",
        });
        setFilterDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to apply filters.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong while applying filters.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <CartDrawer
        open={cartDrawerOpen}
        onOpenChange={setCartDrawerOpen}
        cart={cart}
        customerEmail={userEmail}
        onClearCart={handleClearCart}
        onRemove={handleRemoveFromCart}
        accessToken={accessToken}
      />

      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
        accessToken={accessToken}
        loading={loading}
      />

      <AddToCartSheet
        open={addToCartSheetOpen}
        onOpenChange={setAddToCartSheetOpen}
        product={selectedProduct}
        userAddress={String(userAddress.addressRaw)}
        onAddToCart={handleAddToCart}
      />

      <Header
        router={router}
        accessToken={accessToken}
        onOpenFilter={() => setFilterDialogOpen(true)}
        cart={cart}
        onOpenCart={() => setCartDrawerOpen(true)}
      />
      <div className="container mx-auto mt-0 py-8 px-4 sm:px-6 pt-3 lg:px-8">

        <div className="space-y-8">

          {/* Stall Header */}
          <StallHeader
            stall={stallData}
            isOwner={isOwner}
            isSubscribed={isSubscribed}
            onSubscribe={handleSubscribe}
            onEditStall={() => router.push(`/stalls/${stallData.id}/edit`)}
            selectedImage={selectedImage}
            onImageUpload={() => fileInputRef.current?.click()}
            productCount={productCount}
            commentCount={commentCount}
            onGeolocate={handleGeolocate}
            isGeolocating={isGeolocating}
          />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3 bg-card/50 backdrop-blur-sm shadow-lg border border-border/40 rounded-xl">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Megaphone className="w-4 h-4 mr-2" />
                Promotion
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent
              value="products"
              className="space-y-6 border border-border/40 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-3">
                  <h2 className="text-2xl font-bold">Menu</h2>
                  <p className="text-muted-foreground">
                    {isOwner
                      ? "Manage your products and menu items"
                      : "Browse available products from this stall"}
                  </p>
                </div>

                {isOwner && (
                  <Button
                    onClick={() => {
                      setEditingProduct(null);
                      setAddProductOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl mr-2"
                  >
                    <Plus className="w-3 h-4 mr-1" />
                    Add Product
                  </Button>
                )}
              </div>

              {products.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-2">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isOwner={isOwner}
                      isFavorite={product.isFavorite}
                      onAddToCart={openAddToCartSheet}
                      onEdit={(product) => {
                        setEditingProduct(product);
                        setAddProductOpen(true);
                      }}
                      onDelete={handleDeleteProduct}
                      onOrder={handleOrderProduct}
                      onToggleFavorite={(productId, isFavorite) => {
                        if (favoriteProductIds) {
                          setFavoriteProductIds((prev) => {
                            const newSet = new Set(prev);
                            if (isFavorite) {
                              newSet.add(productId);
                            } else {
                              newSet.delete(productId);
                            }
                            return newSet;
                          });
                        }
                      }}
                      toggleFavoriteProduct={toggleFavoriteProduct}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
                  <CardContent className="text-center py-16">
                    <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {isOwner ? "No products yet" : "No products available"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {isOwner
                        ? "Start building your menu by adding your first product"
                        : "This stall hasn't added any products yet"}
                    </p>
                    {isOwner && (
                      <Button
                        onClick={() => {
                          setEditingProduct(null);
                          setAddProductOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Product
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-6">
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                loading={loading}
                isOwner={isOwner}
              />
            </TabsContent>

            {/* Promotions Tab */}
            <TabsContent value="promotions" className="space-y-6">
              {isOwner ? (
                <div className="space-y-6">
                  {/* Add Promotion */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Promotions</h2>
                    <Button
                      onClick={() => alert("Open create promotion dialog")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Promotion
                    </Button>
                  </div>

                  {/* List Promotions */}
                  {products.filter((p) => p.discount).length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {products
                        .filter((p) => p.discount)
                        .map((product) => (
                          <Card
                            key={product.id}
                            className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <Image
                                  src="/placeholder-product.jpg"
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-through">
                                    ₦{product.price?.toLocaleString()}
                                  </p>
                                  <p className="text-lg font-bold text-emerald-600">
                                    ₦
                                    {(
                                      (product.price ?? 0) *
                                      (1 - (product.discount ?? 0) / 100)
                                    ).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {product.discount}% off
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
                      <CardContent className="text-center py-16">
                        <BadgePercent className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No Promotions Yet
                        </h3>
                        <p className="text-muted-foreground">
                          {isOwner
                            ? "Create your first promotion to attract more customers"
                            : "This stall has no promotions at the moment"}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg border border-border/40 rounded-xl">
                  <CardContent className="text-center py-16">
                    <BadgePercent className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No Promotions
                    </h3>
                    <p className="text-muted-foreground">
                      This stall isn&apos;t running any promotions right now.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Add/Edit Product Dialog */}
          <AddProductDialog
            isOpen={addProductOpen}
            onOpenChange={setAddProductOpen}
            onSubmit={handleAddProduct}
            editingProduct={editingProduct}
            loading={loading}
          />

          <ResponseNotification response={response} onClose={closeResponse} />
        </div>
      </div>
    </div>
  );
}
