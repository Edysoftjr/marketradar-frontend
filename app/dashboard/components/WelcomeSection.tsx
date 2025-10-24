import {
    Clock,
    Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function WelcomeSection({
    userName,
    role,
    emailVerified,
}: {
    userName: string
    role: string
    emailVerified: boolean
}) {
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Administrator"
            case "VENDOR":
                return "Vendor"
            case "USER":
                return "Customer"
            default:
                return "User"
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "bg-red-50 text-red-700 border-red-200"
            case "VENDOR":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "USER":
                return "bg-emerald-50 text-emerald-700 border-emerald-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    const getWelcomeText = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Oversee the platform, manage users, and keep everything running smoothly."
            case "VENDOR":
                return "Manage your stalls, track orders, and grow your business with ease."
            case "USER":
                return "Browse stalls, place orders, and enjoy delicious meals from your favorite vendors."
            default:
                return "Explore and enjoy everything our platform has to offer."
        }
    }

    return (
        <div className="relative">
            <div className="space-y-4">
                <div className="space-y-3">
                    <h1 className="text-3xl sm:text-5xl font-bold text-balance leading-tight">
                        <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                            Welcome back,
                        </span>
                        <br />
                        <span className="text-2xl sm:text-4xl text-primary">{userName}! 👋</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl text-pretty">{getWelcomeText(role)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className={`${getRoleColor(role)} px-4 py-2 text-sm font-medium border`}>
                        <Award className="h-4 w-4 mr-2" />
                        {getRoleDisplayName(role)}
                    </Badge>
                    {!emailVerified && (
                        <Badge variant="destructive" className="px-4 py-2 text-sm">
                            <Clock className="h-4 w-4 mr-2" />
                            Email Not Verified
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}