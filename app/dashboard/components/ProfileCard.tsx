import type { DashboardData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User } from "lucide-react";

export default function ProfileCard({
    user,
    stallLength,
}: {
    user: DashboardData["user"]
    stallLength: number
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

    return (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-inner">
                        <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg truncate">{user.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Role</span>
                        <Badge variant="outline" className="font-medium text-sm">
                            {getRoleDisplayName(user.role)}
                        </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Account Status</span>
                        <Badge variant="outline" className="font-medium text-sm">
                            {user.accountStatus}
                        </Badge>
                    </div>

                    {user.role === "VENDOR" && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Stall Count</span>
                            <div className="text-center px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50">
                                <span className="text-sm font-semibold text-blue-600">{stallLength}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Email Status</span>
                        <Badge variant={user.emailVerified ? "default" : "destructive"} className="font-medium text-sm">
                            {user.emailVerified ? "Verified" : "Pending"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Last Login</span>
                        <span className="text-sm font-medium text-foreground">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}