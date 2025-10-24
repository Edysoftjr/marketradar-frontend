/* eslint-disable */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { DashboardClientProps } from "@/types"
import { useAuthContext } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  User,
  Home,
  LayoutDashboard
} from "lucide-react"
import Cookies from "js-cookie"
import DashboardHeader from "./components/DashboardHeader"
import WelcomeSection from "./components/WelcomeSection"
import QuickActions from "./components/QuickActions"
import ProfileCard from "./components/ProfileCard"
import StatsCard from "./components/StatsCard"
import RecentOrdersCard from "./components/RecentOrdersCard"
import StallsManagementCard from "./components/StallsManagementCard"

const COUNTDOWN_DAYS = 10

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mb-[5rem] animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="h-32 bg-muted/50 rounded-xl"></div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div className="h-64 bg-muted/50 rounded-xl"></div>
          <div className="h-48 bg-muted/50 rounded-xl"></div>
        </div>
        <div className="xl:col-span-2 space-y-6">
          <div className="h-96 bg-muted/50 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
)

const BottomNavigation = ({ router }: { router: AppRouterInstance }) => {
  const [open, setOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Initialize countdown
  useEffect(() => {
    let targetDate = Cookies.get("featureCountdown")
    if (!targetDate) {
      const future = new Date()
      future.setDate(future.getDate() + COUNTDOWN_DAYS)
      targetDate = future.toISOString()
      Cookies.set("featureCountdown", targetDate, { expires: COUNTDOWN_DAYS })
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = new Date(targetDate!).getTime()
      const diff = Math.max(end - now, 0)
      setTimeLeft(diff)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  const comingSoonDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe rounded-2xl shadow-xl p-6 text-center max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Coming Soon!</DialogTitle>
          <DialogDescription>Our new feature will launch in:</DialogDescription>
        </DialogHeader>
        <div className="text-2xl font-bold mt-4">{formatTime(timeLeft)}</div>
        <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {comingSoonDialog}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/home")}
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Home</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-primary hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 sm:gap-1 h-auto p-2 sm:p-3 text-muted-foreground hover:text-primary rounded-xl sm:rounded-2xl transition-all duration-100"
            onClick={() => router.push("/profile")}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </>
  )
}

export function DashboardClient({ userProfile, dashboardData, accessToken }: DashboardClientProps) {
  const { logout } = useAuthContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const isVendor = userProfile.role === "VENDOR"
  const orderCount = dashboardData.recentOrders.length + dashboardData.vendorRecentOrders.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mb-[5rem]">
      <DashboardHeader onLogout={handleLogout} accessToken={accessToken} userProfile={userProfile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <WelcomeSection userName={userProfile.name} role={userProfile.role} emailVerified={userProfile.emailVerified} />
        <QuickActions />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <ProfileCard user={userProfile} stallLength={dashboardData.userStalls.length} />
            <StatsCard stats={dashboardData.stats} orderCount={orderCount} isVendor={isVendor} />
          </div>

          <div className="xl:col-span-2 space-y-6">
            <RecentOrdersCard
              orders={dashboardData.recentOrders}
              vendorOrders={dashboardData.vendorRecentOrders}
              isVendor={isVendor}
              router={router}
            />
            {isVendor && <StallsManagementCard stalls={dashboardData.userStalls} accessToken={accessToken} />}
          </div>
        </div>
      </div>

      <BottomNavigation router={router} />
    </div>
  )
}
