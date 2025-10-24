"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Settings, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import type { DashboardData } from "@/types";

// Add this type
type Notification = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
};

function DashboardHeader({
  notificationCount,
  onLogout,
  accessToken,
  userProfile,
}: {
  notificationCount: number;
  onLogout: () => void;
  accessToken: string;
  userProfile: DashboardData["user"];
}) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile.name,
    email: userProfile.email,
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (notifOpen && notifications.length === 0) {
      setLoading(true);
      fetch("/api/notifications?limit=10", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [notifOpen, accessToken, notifications]);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        setSettingsOpen(false);
        router.refresh();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center min-w-0 flex-1 sm:flex-none">
            <div className="flex items-center space-x-3">
              <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
                <Image
                  alt="FoodRadar App"
                  src="/foodrlogo.png"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <div className="min-w-0">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  FoodRadar
                </span>
                <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                  Discover • Order • Manage
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-muted/50"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="py-4 px-4">
                  <h4 className="font-medium text-lg mb-4">Notifications</h4>
                  {loading ? (
                    <p className="text-center text-muted-foreground">
                      Loading...
                    </p>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="font-medium text-foreground mb-1">
                        No notifications yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You&apos;re all caught up!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <p className="text-sm font-medium">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Separator />
                <Link
                  href="/notifications"
                  className="block py-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                  onClick={() => setNotifOpen(false)}
                >
                  View All
                </Link>
              </PopoverContent>
            </Popover>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Update your profile information here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSettingsOpen(false)}
                    disabled={saveLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saveLoading}>
                    {saveLoading ? "Saving..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
