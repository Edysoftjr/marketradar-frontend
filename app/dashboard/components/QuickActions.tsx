import {
    User,
    Heart,
    ShoppingCart,
    ChevronRight,
    Store,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function QuickActions() {
    const router = useRouter()
    const actions = [
        {
            icon: User,
            title: "Profile",
            description: "View and edit your profile",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            path: "/profile",
        },
        {
            icon: ShoppingCart,
            title: "My Orders",
            description: "Track your orders",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            path: "/orders",
        },
        {
            icon: Heart,
            title: "Favorites",
            description: "Items added to your favourites",
            bgColor: "bg-rose-50",
            iconColor: "text-rose-600",
            path: "/profile",
        },
        {
            icon: Store,
            title: "MarketRadar",
            description: "Get to know more about us",
            bgColor: "bg-amber-50",
            iconColor: "text-amber-600",
            path: "/about",
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => (
                <Card
                    key={index}
                    className="group hover:shadow-lg hover:shadow-black/5 transition-all duration-300 cursor-pointer border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                    onClick={() => router.push(action.path)}
                >
                    <CardContent className="p-6">
                        <div className="flex flex-col items-start space-y-3">
                            <div
                                className={`p-3 ${action.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                            >
                                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-foreground group-hover:text-foreground/90 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground text-pretty">{action.description}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}