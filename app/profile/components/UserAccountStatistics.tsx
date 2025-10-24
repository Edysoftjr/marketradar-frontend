import { Stats, ProfileStall } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, MessageSquare, TrendingUp, CreditCard, Heart, Star, Users, Store, MapPin } from "lucide-react";


interface UserAccountStatisticsProps {
    stats: Stats;
    isOwner: boolean;
    userStalls: ProfileStall[];
    userRole: string;
}

function UserAccountStatistics({
    stats,
    userStalls,
    userRole,
    isOwner,
}: UserAccountStatisticsProps) {
    const isVendor = userRole === "VENDOR";

    const userStatItems = [
        {
            value: stats.orders || 0,
            label: "Orders",
            icon: ShoppingBag,
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
            textColor: "text-blue-600",
            borderColor: "border-blue-200/30",
        },
        {
            value: stats.reviews || 0,
            label: "Reviews",
            icon: MessageSquare,
            bgColor: "bg-gradient-to-br from-violet-50 to-violet-100/50",
            textColor: "text-violet-600",
            borderColor: "border-violet-200/30",
        },
        {
            value: `₦${(stats.spent || 0).toLocaleString()}`,
            label: "Spent",
            icon: CreditCard,
            bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
            textColor: "text-emerald-600",
            borderColor: "border-emerald-200/30",
        },
        {
            value: stats.favorites || 0,
            label: "Favorites",
            icon: Heart,
            bgColor: "bg-gradient-to-br from-rose-50 to-rose-100/50",
            textColor: "text-rose-600",
            borderColor: "border-rose-200/30",
        },
    ];

    const vendorStatItems = [
        {
            value: stats.rating || "0.0",
            label: "Rating",
            icon: Star,
            bgColor: "bg-gradient-to-br from-amber-50 to-amber-100/50",
            textColor: "text-amber-600",
            borderColor: "border-amber-200/30",
        },
        {
            value: stats.stallSubscribers || 0,
            label: "Subscribers",
            icon: Users,
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
            textColor: "text-blue-600",
            borderColor: "border-blue-200/30",
        },
        {
            value: stats.reviews || 0,
            label: "Reviews",
            icon: MessageSquare,
            bgColor: "bg-gradient-to-br from-violet-50 to-violet-100/50",
            textColor: "text-violet-600",
            borderColor: "border-violet-200/30",
        },
        {
            value:
                userStalls?.filter((stall) => stall.status === "Active").length || 0,
            label: "Active Stalls",
            icon: Store,
            bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
            textColor: "text-emerald-600",
            borderColor: "border-emerald-200/30",
        },
    ];

    const statItems = isVendor ? vendorStatItems : userStatItems;

    return (
        <div className="space-y-6">
            <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center border border-emerald-200/30">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Account Statistics
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {isVendor
                                    ? "Your business performance metrics"
                                    : "Your activity overview"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {statItems.map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 sm:p-6 rounded-xl ${item.bgColor} ${item.borderColor} border backdrop-blur-sm group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 min-h-[6rem] flex`}
                            >
                                <div className="flex flex-row lg:flex-col items-center lg:items-center gap-3 sm:gap-4 w-full">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/50 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <item.icon
                                            className={`w-5 h-5 sm:w-6 sm:h-6 ${item.textColor} group-hover:scale-110 transition-transform duration-300`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left lg:text-center">
                                        <p
                                            className={`text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-bold ${item.textColor} group-hover:scale-105 transition-transform duration-300 leading-tight break-words`}
                                            title={
                                                typeof item.value === "string"
                                                    ? item.value
                                                    : item.value.toString()
                                            }
                                        >
                                            {item.value}
                                        </p>
                                        <p
                                            className={`text-xs sm:text-sm ${item.textColor} font-medium opacity-80 leading-tight`}
                                        >
                                            {item.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {!isOwner && isVendor && (
                <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center border border-blue-200/30">
                                    <Store className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Stalls</CardTitle>
                                    <CardDescription>
                                        Explore this vendor’s stalls
                                    </CardDescription>
                                </div>
                            </div>
                            <a href="/stalls">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6">
                                    View All Stalls
                                </Button>
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {userStalls && userStalls.length > 0 ? (
                            <div className="space-y-6">
                                {userStalls.map((stall) => (
                                    <a href={`/stall/${stall.id}`} key={stall.id}>
                                        <Card
                                            key={stall.id}
                                            className="border-0 bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                                    <div>
                                                        <h3 className="font-bold text-xl mb-2 text-foreground">
                                                            {stall.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>
                                                                {stall.area}, {stall.city}, {stall.state}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                stall.status === "Active"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={`${stall.status === "Active"
                                                                ? "bg-emerald-500 text-white border-0 shadow-sm"
                                                                : ""
                                                                } px-3 py-1`}
                                                        >
                                                            {stall.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/30">
                                                        <Star className="w-5 h-5 text-amber-500 fill-current" />
                                                        <span className="font-bold text-amber-700 text-lg">
                                                            {stall.rating}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/30 backdrop-blur-sm">
                                                        <p className="text-2xl font-bold text-blue-600 mb-1">
                                                            {stall.products}
                                                        </p>
                                                        <p className="text-sm text-blue-600 font-medium">
                                                            Products
                                                        </p>
                                                    </div>
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/30 backdrop-blur-sm">
                                                        <p className="text-2xl font-bold text-violet-600 mb-1">
                                                            {stall.subscribers}
                                                        </p>
                                                        <p className="text-sm text-violet-600 font-medium">
                                                            Subscribers
                                                        </p>
                                                    </div>
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/30 backdrop-blur-sm">
                                                        <p className="text-2xl font-bold text-emerald-600 mb-1">
                                                            {stall.reviews}
                                                        </p>
                                                        <p className="text-sm text-emerald-600 font-medium">
                                                            Reviews
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center mx-auto mb-6">
                                    <Store className="w-10 h-10 text-muted-foreground/50" />
                                </div>
                                <p className="text-foreground font-semibold text-lg mb-2">
                                    No stalls found
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UserAccountStatistics