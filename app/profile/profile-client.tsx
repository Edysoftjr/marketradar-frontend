"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { changePassword } from "@/lib/server/password";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User
} from "lucide-react";
import { ProfileData, ProfileUser } from "@/types/profile";
import CartDrawer from "@/components/homepage/cart-drawer";
import { updateProfile } from "@/lib/server/profile";
import { ProductWithStall, Product } from "@/types/product";
import { getUserFavorites, toggleFavorite } from "@/lib/server/favorites";
import { Home, LayoutDashboard } from "lucide-react";
import Cookies from "js-cookie";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CartItem } from "@/types/cart";
import {
  SearchFilters,
  userAddress,
} from "@/types/homepage";
import AddToCartSheet from "./components/AddToCartSheet";
import FilterDialog from "./components/FilterDialog";
import Header from "./components/Header"
import EnhancedProfileCard from "./components/EnhancedProfileCard";
import UserAccountStatistics from "./components/UserAccountStatistics";
import ProfileInformationForm from "./components/ProfileInformationForm";
import FavoriteProducts from "./components/FavoriteProducts";
import SecuritySection from "./components/SecuritySection";
import BusinessOverview from "./components/BusinessOverview";
import ImagePreviewDialog from "./components/ImagePreviewDialog";

const COUNTDOWN_DAYS = 10;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const BottomNavigation = ({ router }: { router: AppRouterInstance }) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize countdown
  useEffect(() => {
    let targetDate = Cookies.get("featureCountdown");
    if (!targetDate) {
      const future = new Date();
      future.setDate(future.getDate() + COUNTDOWN_DAYS);
      targetDate = future.toISOString();
      Cookies.set("featureCountdown", targetDate, { expires: COUNTDOWN_DAYS });
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(targetDate!).getTime();
      const diff = Math.max(end - now, 0);
      setTimeLeft(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const comingSoonDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe rounded-2xl shadow-xl p-6 text-center max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Coming Soon!</DialogTitle>
          <DialogDescription>Our new feature will launch in:</DialogDescription>
        </DialogHeader>
        <div className="text-2xl font-bold mt-4">{formatTime(timeLeft)}</div>
        <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {comingSoonDialog}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/home")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          {/* <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto p-3 text-muted-foreground hover:text-primary rounded-2xl transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Chat</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto p-3 text-muted-foreground hover:text-primary rounded-2xl transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <Radio className="h-5 w-5" />
            <span className="text-xs font-medium">Status</span>
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-primary hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </>
  );
};

interface ProfileClientProps {
  initialData: ProfileData;
  accessToken: string;
  userAddress: userAddress;
}

export default function ProfileClient({
  initialData,
  accessToken,
  userAddress,
}: ProfileClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userAddres: string | undefined = userAddress?.addressRaw
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    if (initialData.user.role === "VENDOR") {
      return initialData.stats.isVendorSubscribed ?? false;
    }
    if (initialData.user.role === "USER") {
      return initialData.stats.isSubscribed ?? false;
    }
    return initialData.stats.isSubscribed ?? false;
  });
  const [subscriberCount, setSubscriberCount] = useState(() => {
    if (initialData.user.role === "VENDOR") {
      return initialData.stats.vendorSubscribers ?? 0;
    }
    if (initialData.user.role === "USER") {
      return initialData.stats.subscribers ?? 0;
    }
    return initialData.stats.followers ?? 0;
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(
    (initialData.user.image[0] == "/defaults/user.png") ? API_BASE_URL + "/uploads/defaults/user.png" : API_BASE_URL + initialData.user.image[0]
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileUser>({
    name: initialData.user.name,
    image: initialData.user.image,
    isOwner: initialData.isOwner,
    email: initialData.user.email,
    address: initialData.user.address,
    phoneNumber: initialData.user.phoneNumber,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    bankName: initialData.user.bankName,
    accountName: initialData.user.accountName,
    accountNumber: initialData.user.accountNumber,
    id: initialData.user.id,
    role: initialData.user.role,
    emailVerified: initialData.user.emailVerified,
    createdAt: initialData.user.createdAt,
    stallSubscribers: initialData.stats.stallSubscribers,
    vendorSubscribers: initialData.stats.vendorSubscribers,
    subscribers: initialData.stats.subscribers,
    followers: subscriberCount,
    isSubscribed: initialData.stats.isSubscribed,
    bio: initialData.user.bio,
  });
  const [activeTab, setActiveTab] = useState("overview");

  // New state for dialogs
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addToCartSheetOpen, setAddToCartSheetOpen] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [favorites, setFavorites] = useState<ProductWithStall[]>([]);

  // Fetch favorites when component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await getUserFavorites(accessToken);
      if (response.success && response.data) {
        setFavorites(response.data.favorites);
      }
    };
    fetchFavorites();
  }, [accessToken]);

  // Handle toggling favorites
  const handleToggleFavorite = async (productId: string) => {
    try {
      const response = await toggleFavorite(productId, accessToken);
      if (response.success) {
        // Refresh favorites
        const updatedFavorites = await getUserFavorites(accessToken);
        if (updatedFavorites.success && updatedFavorites.data) {
          setFavorites(updatedFavorites.data.favorites);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setIsSubscribed(!isSubscribed);
    setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

      // decide endpoint based on role
      const isVendor = initialData.user.role === "VENDOR";
      const endpoint = isVendor
        ? `${API_BASE_URL}/subscriptions/vendors/${initialData.user.id}/subscribe`
        : `${API_BASE_URL}/subscriptions/users/${initialData.user.id}/subscribe`;

      const response = await fetch(endpoint, {
        method: isSubscribed ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setIsSubscribed(!isSubscribed);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file); // store the actual file
      setSelectedImage(URL.createObjectURL(file)); // store preview
      setIsImageDialogOpen(true);
    }
  };

  async function handleImageConfirm() {
    if (!selectedImageFile) return;

    const res = await updateProfile({}, selectedImageFile, accessToken);

    if (res.success) {
      setIsImageDialogOpen(false);
    } else {
      console.error("Upload failed:", res.message);
    }
  }

  const handleImageCancel = () => {
    setIsImageDialogOpen(false);
    setSelectedImage(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile(
        {
          name: profileData.name,
          bio: profileData.bio,
          phoneNumber: profileData.phoneNumber,
          bankName: profileData.bankName,
          accountNumber: profileData.accountNumber,
          accountName: profileData.accountName,
        },
        undefined,
        accessToken
      );

      if (response.success && response.data) {
        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev,
            name: response.data?.user?.name ?? prev.name,
            bio: response.data?.user?.bio ?? prev.bio,
            phoneNumber: response.data?.user?.phoneNumber ?? prev.phoneNumber,
            bankName: response.data?.user?.bankName ?? prev.bankName,
            accountNumber: response.data?.user?.accountNumber ?? prev.accountNumber,
            accountName: response.data?.user?.accountName ?? prev.accountName,
          },
        }));

        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile:", response.message);
        alert(
          response.message || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !profileData.currentPassword ||
      !profileData.newPassword ||
      !profileData.confirmNewPassword
    ) {
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (profileData.newPassword !== profileData.confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(
        profileData.currentPassword,
        profileData.newPassword,
        accessToken
      );

      if (result.success) {
        setProfileData({
          ...profileData,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    try {
      router.push("/verify-email");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function handleChat() {
    const res = await fetch("/api/chat/start", {
      method: "POST",
      body: JSON.stringify({ recipientId: initialData.user.id }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/chat/${data.chatId}`);
    }
  }

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
      onClearCart={handleClearCart}
      customerEmail={profileData.email}
      onRemove={handleRemoveFromCart}
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

  const isVendor = initialData.user.role === "VENDOR";
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <CartDrawer
        open={cartDrawerOpen}
        onOpenChange={setCartDrawerOpen}
        cart={cart}
        onClearCart={handleClearCart}
        customerEmail={profileData.email}
        onRemove={handleRemoveFromCart}
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
        userAddress={String(userAddres)}
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
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid gap-y-8 gap-x-64 lg:grid-cols-4 mb-[4rem]">
          {/* Enhanced Profile Card */}
          <div className="lg:col-span-1">
            <EnhancedProfileCard
              user={profileData}
              subscriberCount={subscriberCount}
              isSubscribed={isSubscribed}
              selectedImage={selectedImage}
              onImageUpload={() => fileInputRef.current?.click()}
              onSubscribe={handleSubscribe}
              onChat={handleChat}
              userStalls={initialData.userStalls || []}
              stats={initialData.stats}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList
                className="
    w-full 
    max-w-[20rem] sm:max-w-full 
    mb-1 sm:mb-1 
    bg-card/40 backdrop-blur-md border-0 shadow-lg 
    rounded-xl overflow-hidden
  "
              >
                <div
                  className={`
    w-full gap-1 scrollbar-hide
    flex overflow-x-auto
    sm:grid sm:overflow-visible
    ${initialData.isOwner
                      ? isVendor
                        ? "sm:grid-cols-4"
                        : "sm:grid-cols-3"
                      : "sm:grid-cols-1"
                    }
  `}
                >

                  {/* Always visible */}
                  <TabsTrigger
                    value="overview"
                    className="flex-1 sm:flex-shrink-0 sm:min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 
        data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
        rounded-lg transition-all duration-300 font-medium text-sm sm:text-base text-center whitespace-nowrap"
                  >
                    Overview
                  </TabsTrigger>

                  {/* Only show these if owner */}
                  {initialData.isOwner && (
                    <>
                      <TabsTrigger
                        value="favorites"
                        className="flex-1 sm:flex-shrink-0 sm:min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
            rounded-lg transition-all duration-300 font-medium text-sm sm:text-base text-center whitespace-nowrap"
                      >
                        Favorites
                      </TabsTrigger>

                      <TabsTrigger
                        value="security"
                        className="flex-1 sm:flex-shrink-0 sm:min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
            rounded-lg transition-all duration-300 font-medium text-sm sm:text-base text-center whitespace-nowrap"
                      >
                        Security
                      </TabsTrigger>

                      {isVendor && (
                        <TabsTrigger
                          value="business"
                          className="flex-1 sm:flex-shrink-0 sm:min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
              rounded-lg transition-all duration-300 font-medium text-sm sm:text-base text-center whitespace-nowrap"
                        >
                          Business
                        </TabsTrigger>
                      )}
                    </>
                  )}
                </div>
              </TabsList>

              {/* Always show overview */}
              <TabsContent value="overview" className="space-y-8">
                {initialData.isOwner && (
                  <ProfileInformationForm
                    profileData={profileData} // ✅ use state
                    setProfileData={setProfileData}
                    onSubmit={handleUpdateProfile}
                    loading={loading}
                    followers={subscriberCount}
                    user={initialData.user} // this can stay as the immutable reference
                    onVerifyEmail={handleVerifyEmail}
                  />
                )}

                <UserAccountStatistics
                  stats={initialData.stats}
                  isOwner={initialData.isOwner}
                  userStalls={initialData.userStalls || []}
                  userRole={initialData.user.role}
                />
              </TabsContent>

              {/* Only show these if owner */}
              {initialData.isOwner && (
                <>
                  <TabsContent value="favorites" className="space-y-8">
                    <FavoriteProducts
                      favoriteProducts={favorites}
                      onToggleFavorite={handleToggleFavorite}
                      openAddToCart={openAddToCartSheet}
                    />
                  </TabsContent>

                  <TabsContent value="security" className="space-y-8">
                    <SecuritySection
                      profileData={profileData}
                      setProfileData={setProfileData}
                      onChangePassword={handleChangePassword}
                      loading={loading}
                    />
                  </TabsContent>

                  {isVendor && (
                    <TabsContent value="business" className="space-y-8">
                      <BusinessOverview
                        userStalls={initialData.userStalls || []}
                      />
                    </TabsContent>
                  )}
                </>
              )}
            </Tabs>
          </div>
        </div>

        {/* Image Preview Dialog */}
        <ImagePreviewDialog
          isOpen={isImageDialogOpen}
          onOpenChange={setIsImageDialogOpen}
          selectedImage={selectedImage}
          onConfirm={handleImageConfirm}
          onCancel={handleImageCancel}
        />
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation router={router} />
    </div>
  );
}
