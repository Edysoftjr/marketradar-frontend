import { ProfileStall } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Star,
    MapPin,
    Users,
    Store,
    DollarSign,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessOverviewProps {
    userStalls: ProfileStall[];
}

function BusinessOverview({ userStalls }: BusinessOverviewProps) {
    const totalProducts =
        userStalls?.reduce((acc, stall) => acc + stall.products, 0) || 0;
    const totalRevenue =
        userStalls?.reduce((acc, stall) => acc + stall.revenue, 0) || 0;
    const totalSubscribers =
        userStalls?.reduce((acc, stall) => acc + stall.subscribers, 0) || 0;

    const businessStats = [
        {
            value: userStalls?.length || 0,
            label: "Active Stalls",
            icon: Store,
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
            textColor: "text-blue-600",
            borderColor: "border-blue-200/30",
        },
        {
            value: totalProducts,
            label: "Total Products",
            icon: Package,
            bgColor: "bg-gradient-to-br from-violet-50 to-violet-100/50",
            textColor: "text-violet-600",
            borderColor: "border-violet-200/30",
        },
        {
            value: `₦${totalRevenue.toLocaleString()}`,
            label: "Total Revenue",
            icon: DollarSign,
            bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
            textColor: "text-emerald-600",
            borderColor: "border-emerald-200/30",
        },
        {
            value: `${totalSubscribers}`,
            label: "Total Subscribers",
            icon: Users,
            bgColor: "bg-gradient-to-br from-amber-50 to-amber-100/50",
            textColor: "text-amber-600",
            borderColor: "border-amber-200/30",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Business Overview Card */}
            <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center border border-emerald-200/30">
                            <Store className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Business Overview
                            </CardTitle>
                            <CardDescription>
                                Your business performance metrics
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {businessStats.map((stat, index) => (
                            <div
                                key={index}
                                className={`p-4 sm:p-6 rounded-xl ${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 min-h-[6rem] flex`}
                            >
                                {/* Mobile: row | Desktop: column */}
                                <div className="flex flex-row lg:flex-col items-center lg:items-center gap-3 sm:gap-4 w-full">
                                    {/* Icon */}
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/50 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <stat.icon
                                            className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0 text-left lg:text-center">
                                        <p
                                            className={`text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform duration-300 leading-tight break-words`}
                                            title={
                                                typeof stat.value === "string"
                                                    ? stat.value
                                                    : stat.value.toString()
                                            }
                                        >
                                            {stat.value}
                                        </p>
                                        <p
                                            className={`text-xs sm:text-sm ${stat.textColor} font-medium opacity-80 leading-tight`}
                                        >
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Stalls List */}
            <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center border border-blue-200/30">
                                <Store className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">Your Stalls</CardTitle>
                                <CardDescription>
                                    Manage your business locations
                                </CardDescription>
                            </div>
                        </div>
                        <a href="/dashboard">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6">
                                Manage Stalls
                            </Button>
                        </a>
                    </div>
                </CardHeader>
                <CardContent>
                    {userStalls && userStalls.length > 0 ? (
                        <div className="space-y-6">
                            {userStalls.map((stall) => (
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
                                                        stall.status === "Active" ? "default" : "secondary"
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
                                                    {stall.orders}
                                                </p>
                                                <p className="text-sm text-violet-600 font-medium">
                                                    Orders
                                                </p>
                                            </div>
                                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/30 backdrop-blur-sm">
                                                <p className="text-2xl font-bold text-emerald-600 mb-1">
                                                    ₦{stall.revenue.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-emerald-600 font-medium">
                                                    Revenue
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
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
                            <p className="text-muted-foreground mb-6">
                                Create your first stall to start selling
                            </p>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                                Create First Stall
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default BusinessOverview