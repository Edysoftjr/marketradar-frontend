import { ProfileUser } from "@/types/profile";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Shield, Settings } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface SecuritySectionProps {
    profileData: ProfileUser;
    setProfileData: (data: ProfileUser) => void;
    onChangePassword: (e: React.FormEvent) => void;
    loading: boolean;
}

function SecuritySection({
    profileData,
    setProfileData,
    onChangePassword,
    loading,
}: SecuritySectionProps) {
    // simple password strength checker
    const isStrongPassword = (pwd: string) =>
        pwd.length >= 8 &&
        /[A-Z]/.test(pwd) &&
        /[a-z]/.test(pwd) &&
        /\d/.test(pwd) &&
        /[^A-Za-z0-9]/.test(pwd);

    const passwordMatch =
        profileData.newPassword === profileData.confirmNewPassword;

    const canSubmit =
        profileData.currentPassword &&
        isStrongPassword(profileData.newPassword) &&
        passwordMatch;

    return (
        <div className="space-y-8">
            {/* Change Password Card */}
            <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 flex items-center justify-center border border-amber-200/30">
                            <Shield className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Update your account password for security
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onChangePassword} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="currentPassword"
                                className="text-sm font-semibold"
                            >
                                Current Password
                            </Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                required
                                value={profileData.currentPassword}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                            />
                        </div>

                        {/* New + Confirm Password */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-semibold">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    required
                                    value={profileData.newPassword}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                                {!isStrongPassword(profileData.newPassword) &&
                                    profileData.newPassword && (
                                        <p className="text-xs text-red-500">
                                            Must be 8+ chars, include upper, lower, number, symbol
                                        </p>
                                    )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmNewPassword"
                                    className="text-sm font-semibold"
                                >
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirmNewPassword"
                                    type="password"
                                    required
                                    value={profileData.confirmNewPassword}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            confirmNewPassword: e.target.value,
                                        })
                                    }
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                                {!passwordMatch && profileData.confirmNewPassword && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Change Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Account Security Card */}
            <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 flex items-center justify-center border border-red-200/30">
                            <Settings className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Account Security
                            </CardTitle>
                            <CardDescription>
                                Manage your account security settings
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/30">
                        <div className="space-y-2">
                            <p className="font-semibold text-red-800">Delete Account</p>
                            <p className="text-sm text-red-600">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                                >
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-0 bg-background/95 backdrop-blur-md shadow-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-red-600">
                                        Are you sure you want to delete your account?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. All your data, including
                                        orders, favorites, and business information will be
                                        permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            // Handle account deletion
                                        }}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Delete Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SecuritySection