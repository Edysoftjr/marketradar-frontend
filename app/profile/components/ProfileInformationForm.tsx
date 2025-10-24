import { Textarea } from "@/components/ui/textarea";
import { ProfileUser } from "@/types/profile";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, XCircle, User, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface ProfileInformationFormProps {
    profileData: ProfileUser;
    setProfileData: (data: ProfileUser) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    user: ProfileUser;
    followers: number;
    onVerifyEmail: () => void;
}

function ProfileInformationForm({
    profileData,
    setProfileData,
    onSubmit,
    loading,
    user,
    followers,
    onVerifyEmail,
}: ProfileInformationFormProps) {
    return (
        <Card className="border-0 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center border border-blue-200/30">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">
                            Profile Information
                        </CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Personal Details Section */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Personal Details
                        </h3>

                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={profileData.name}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, name: e.target.value })
                                    }
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone number"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone number"
                                    type="text"
                                    value={profileData?.phoneNumber ?? ""}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, phoneNumber: e.target.value })
                                    }
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        readOnly
                                        className="border-border/30 bg-muted text-muted-foreground cursor-not-allowed pr-20"
                                    />
                                    {!user.emailVerified && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={onVerifyEmail}
                                            disabled={loading}
                                            className="absolute right-1 top-1 h-8 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50/50"
                                        >
                                            Verify
                                        </Button>
                                    )}
                                </div>
                                {!user.emailVerified && (
                                    <p className="text-xs text-amber-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Email not verified
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="bio"
                                className="text-sm font-semibold text-foreground"
                            >
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                value={profileData.bio ?? ""}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, bio: e.target.value })
                                }
                                placeholder="Tell us a little about yourself..."
                                className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm min-h-[100px]"
                            />
                            <p className="text-xs text-muted-foreground">
                                This will appear on your profile and help others know you better.
                            </p>
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="space-y-6 pt-6 border-t border-border/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center border border-green-200/30">
                                <CreditCard className="w-4 h-4 text-green-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Bank Details
                            </h3>
                        </div>

                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label
                                    htmlFor="bankName"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Bank Name
                                </Label>
                                <Input
                                    id="bankName"
                                    type="text"
                                    value={profileData?.bankName ?? ""}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, bankName: e.target.value })
                                    }
                                    placeholder="e.g., First Bank, GTBank, Access Bank"
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="accountNumber"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Account Number
                                </Label>
                                <Input
                                    id="accountNumber"
                                    type="text"
                                    value={profileData?.accountNumber ?? ""}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, accountNumber: e.target.value })
                                    }
                                    placeholder="0123456789"
                                    maxLength={10}
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="accountName"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Account Name
                                </Label>
                                <Input
                                    id="accountName"
                                    type="text"
                                    value={profileData?.accountName ?? ""}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, accountName: e.target.value })
                                    }
                                    placeholder="Account holder name"
                                    className="border-border/30 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30 rounded-lg p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Your bank details are kept secure and will only be used for payment processing.</span>
                            </p>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="space-y-4 pt-6 border-t border-border/30">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Account Information
                        </h3>

                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label className="text-sm font-semibold text-foreground">
                                    Role
                                </Label>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {profileData.role}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-semibold text-foreground">
                                    Followers
                                </Label>
                                <p className="text-sm text-muted-foreground">{followers}</p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-semibold text-foreground">
                                    Joined
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(profileData.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-semibold text-foreground">
                                    Account Status
                                </Label>
                                <div className="flex items-center gap-2">
                                    {user.emailVerified ? (
                                        <Badge
                                            variant="secondary"
                                            className="bg-green-100 text-green-700 border border-green-300 flex items-center gap-1 px-2 py-0.5 rounded-full"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Verified
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="secondary"
                                            className="bg-red-100 text-red-700 border border-red-300 flex items-center gap-1 px-2 py-0.5 rounded-full"
                                        >
                                            <XCircle className="w-4 h-4" /> Unverified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default ProfileInformationForm