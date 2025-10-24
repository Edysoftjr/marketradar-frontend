"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatJoinDate, getRoleDisplayName, getRoleColor } from "@/utils/profileUtils"
import { Mail, MessageCircle, Calendar, Bell, CheckCircle, Users, Shield, AlertCircle, MapPin } from "lucide-react"
import { ProfileUser, Stats, ProfileStall } from "@/types/profile";
import ProfileAvatar from "./ProfileAvater";

interface EnhancedProfileCardProps {
    user: ProfileUser;
    subscriberCount: number;
    isSubscribed: boolean;
    selectedImage: string | null;
    onImageUpload?: () => void;
    onSubscribe: () => void;
    onChat: () => void;
    userStalls: ProfileStall[];
    stats: Stats;
}

function EnhancedProfileCard({
    user,
    subscriberCount,
    isSubscribed,
    selectedImage,
    onImageUpload,
    onSubscribe,
    onChat,
    userStalls,
}: EnhancedProfileCardProps & { onChat: () => void }) {
    const Bio = user.bio;

    return (
        <Card className="border-0 min-w-72 bg-card/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader className="text-center pb-4">
                <ProfileAvatar
                    userName={user.name}
                    selectedImage={selectedImage}
                    onImageUpload={user.isOwner ? onImageUpload : undefined}
                    isOwner={user.isOwner}
                />

                <div className="space-y-3">
                    <CardTitle className="text-xl md:text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        {user.name}
                    </CardTitle>
                    <div className="flex items-center justify-center">
                        <Badge
                            variant="outline"
                            className={`${getRoleColor(
                                user.role
                            )} border font-medium px-3 py-1 shadow-sm`}
                        >
                            <Shield className="w-3 h-3 mr-1.5" />
                            {getRoleDisplayName(user.role)}
                        </Badge>
                    </div>
                </div>

                {/* Bio Section */}
                {Bio && (
                    <div className="mt-6 px-2">
                        <div className="relative p-4 rounded-xl bg-gradient-to-br from-background/60 via-background/40 to-muted/30 border border-border/40 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl"></div>
                            <div className="relative">
                                <p className="text-sm leading-relaxed text-muted-foreground text-center max-w-md mx-auto">
                                    {Bio}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subscription + Chat Section */}
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{subscriberCount} followers</span>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 w-full max-w-sm mx-auto">
                        {/* Subscribe button only for visitors */}
                        <Button
                            onClick={onSubscribe}
                            className={`flex-1 transition-all duration-300 shadow-md hover:shadow-lg ${isSubscribed
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                }`}
                        >
                            <Bell className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                            <span className="truncate">
                                {isSubscribed ? "Following" : "Follow"}
                            </span>
                        </Button>

                        {/* Chat button hidden for owners */}
                        {!user.isOwner && (
                            <Button
                                onClick={onChat}
                                variant="outline"
                                className="flex-1 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <MessageCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                <span className="truncate">Chat</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* User Info */}
                <div className="space-y-4">
                    {/* Email section visible only to owner */}
                    {user.isOwner && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background/50 to-muted/20 border border-border/30">
                            <div className="min-w-8 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shadow-sm">
                                <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-foreground font-medium text-sm">
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {user.emailVerified ? (
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                        <AlertCircle className="w-3 h-3 text-amber-500" />
                                    )}
                                    <span
                                        className={`text-xs font-medium ${user.emailVerified ? "text-emerald-600" : "text-amber-600"
                                            }`}
                                    >
                                        {user.emailVerified ? "Verified" : "Unverified"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background/50 to-muted/20 border border-border/30">
                        <div className="min-w-8 w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center shadow-sm">
                            <Calendar className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-foreground font-medium text-sm">
                            {formatJoinDate(user.createdAt)}
                        </span>
                    </div>

                    {userStalls?.[0] && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background/50 to-muted/20 border border-border/30">
                            <div className="min-w-8 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-foreground font-medium text-sm">
                                    {userStalls[0].area}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {userStalls[0].city}, {userStalls[0].state}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default EnhancedProfileCard