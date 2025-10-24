import {
    MapPin,
    Navigation,
    UserCheck,
    Loader2,
    Star,
    Users,
    Package,
    Bell
} from "lucide-react";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface StallHeaderProps {
    stall: {
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
    isOwner: boolean;
    isSubscribed: boolean;
    onSubscribe: () => void;
    onEditStall: () => void;
    selectedImage: string | null;
    onImageUpload: () => void;
    onGeolocate: () => void;
    productCount: number;
    commentCount: number;
    isGeolocating: boolean; // Add this prop
}

export default function StallHeader({
    stall,
    isOwner,
    isSubscribed,
    onSubscribe,
    onGeolocate,
    productCount,
    commentCount,
    isGeolocating,
}: StallHeaderProps) {
    const image = (stall.images[0] == "/defaults/stall.png") ? `${API_BASE_URL}/uploads/defaults/stall.png` : stall.images?.length
        ? `${API_BASE_URL}${stall.images[0]}`
        : "/rest1.jpg";
    return (
        <Card className="border border-border/40 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
            {/* Banner */}
            <div className="relative h-56 sm:h-64 md:h-80">
                <Image src={image} alt={stall.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating action buttons (desktop) */}
                {isOwner && (
                    <div className="sm:flex absolute top-6 right-6 gap-3">
                        <Button
                            size="sm"
                            className="rounded-full bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onGeolocate}
                            disabled={isGeolocating}
                        >
                            {isGeolocating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Setting Location...
                                </>
                            ) : (
                                <>
                                    <Navigation className="w-4 h-4 mr-1" />
                                    Set Stall Location
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-4">
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 w-full sm:w-auto">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                            {stall.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-white/90 text-sm">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {stall.area}, {stall.city}, {stall.state}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <CardContent className="p-4 sm:p-6">
                {/* Description & Subscribe */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <p className="text-sm sm:text-base text-muted-foreground mb-3">
                            {stall.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{stall.subscribers.toLocaleString()} subscribers</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <Button
                            onClick={onSubscribe}
                            className={`w-full sm:w-auto transition-all duration-300 ${isSubscribed
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-primary hover:bg-primary/90"
                                } text-white shadow-lg`}
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Reviews */}
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/40 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <UserCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{commentCount}</p>
                        <p className="text-xs text-blue-600 font-medium">Reviews</p>
                        <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-600 mt-2" />
                    </div>

                    {/* Products */}
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/40 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Package className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-emerald-600">
                            {productCount}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">Products</p>
                        <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 mt-2" />
                    </div>

                    {/* Rating */}
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/40 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-amber-600">{stall.rating}</p>
                        <p className="text-xs text-amber-600 font-medium">Rating</p>
                        <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-2" />
                    </div>

                    {/* Subscribers */}
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/40 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Users className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-violet-600">
                            {stall.subscribers}
                        </p>
                        <p className="text-xs text-violet-600 font-medium">Subscribers</p>
                        <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-violet-400 to-violet-600 mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}