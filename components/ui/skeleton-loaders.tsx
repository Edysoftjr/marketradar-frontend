import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function StallCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="relative">
        <Skeleton className="aspect-[4/3] w-full" />
        <CardContent className="p-3 sm:p-6 space-y-2 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl sm:rounded-2xl">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-2 sm:p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function HomepageLoadingSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-8 space-y-12">
      {/* Hero Skeleton */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>

      {/* Featured Stalls Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <StallCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Trending Products Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-10 w-32" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </Card>
      </div>
    </div>
  )
}

export function ProfileLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 text-center space-y-2">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </Card>
        ))}
      </div>
    </div>
  )
}
