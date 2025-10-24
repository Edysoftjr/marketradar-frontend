import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Skeleton */}
      <header className="bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center rounded-xl p-1 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10">
                  <Image
                    alt="FoodRadar App"
                    src="/foodrlogo.png"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
                <span className="text-xl font-bold text-foreground">
                  MarketRadar
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-11 w-20" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">

            <div className="block items-center justify-start space-x-3">
              <Skeleton className="h-11 w-56 m-2" />
              <Skeleton className="h-16 w-52 m-2" />
              <Skeleton className="h-6 w-20 m-2" />
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-16" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-20" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center p-3 rounded-lg">
                      <Skeleton className="h-8 w-8 mx-auto mb-1" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>

            {/* Recommended Vendors Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center space-x-1">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-16" />
                        <div className="flex items-center space-x-1">
                          <Skeleton className="h-3 w-3" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
