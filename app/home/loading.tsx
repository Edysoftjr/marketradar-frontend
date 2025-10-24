import { HomepageClient } from "@/components/homepage/homepage-client";
import { HomepageService } from "@/lib/services/homepage.service";
import { HomepageData } from "@/types/homepage";
import { Suspense } from "react";
import { cookies } from "next/headers";

// Loading component with theme-consistent backgrounds
function HomepageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/60 rounded-2xl animate-pulse" />
              <div className="hidden sm:block space-y-1">
                <div className="h-4 w-20 bg-muted/60 rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted/40 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-muted/60 rounded-xl animate-pulse" />
              <div className="w-10 h-10 bg-muted/60 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Title skeleton */}
            <div className="space-y-4">
              <div className="h-12 sm:h-16 bg-muted/60 rounded-2xl animate-pulse mx-auto max-w-xl" />
              <div className="h-12 sm:h-16 bg-muted/40 rounded-2xl animate-pulse mx-auto max-w-lg" />
            </div>

            {/* Subtitle skeleton */}
            <div className="space-y-2 mt-6">
              <div className="h-5 bg-muted/50 rounded-xl animate-pulse mx-auto max-w-md" />
              <div className="h-5 bg-muted/30 rounded-xl animate-pulse mx-auto max-w-sm" />
            </div>

            {/* Search bar skeleton */}
            <div className="mt-10">
              <div className="relative max-w-2xl mx-auto">
                <div className="h-16 bg-card/60 backdrop-blur-xl rounded-2xl animate-pulse shadow-lg border border-border/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stalls Section Skeleton */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          {/* Section header skeleton */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted/60 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 w-40 bg-muted/60 rounded-xl animate-pulse" />
                <div className="h-4 w-56 bg-muted/40 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="hidden sm:block h-10 w-24 bg-muted/50 rounded-xl animate-pulse" />
          </div>

          {/* Featured stalls grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden border-0 animate-pulse"
              >
                <div className="aspect-[16/10] bg-muted/60" />
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted/60 rounded-xl max-w-[80%]" />
                    <div className="h-4 bg-muted/40 rounded-lg" />
                    <div className="h-4 bg-muted/30 rounded-lg max-w-[60%]" />
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl">
                      <div className="h-4 w-4 bg-muted/60 rounded" />
                      <div className="h-3 bg-muted/50 rounded flex-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div
                        key={j}
                        className="text-center p-3 rounded-2xl bg-muted/30"
                      >
                        <div className="h-5 w-8 bg-muted/60 rounded mx-auto mb-1" />
                        <div className="h-3 w-12 bg-muted/40 rounded mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section Skeleton */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          {/* Section header skeleton */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted/60 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 w-36 bg-muted/60 rounded-xl animate-pulse" />
                <div className="h-4 w-64 bg-muted/40 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="hidden sm:block h-10 w-24 bg-muted/50 rounded-xl animate-pulse" />
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden border-0 animate-pulse"
              >
                <div className="aspect-square bg-muted/60" />
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/60 rounded-lg" />
                    <div className="h-3 bg-muted/40 rounded-lg max-w-[80%]" />
                  </div>
                  <div className="h-5 w-20 bg-muted/60 rounded-lg" />
                  <div className="flex items-center justify-between pt-3">
                    <div className="h-6 w-12 bg-muted/50 rounded-full" />
                    <div className="h-6 w-12 bg-muted/50 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-xl">
                    <div className="w-6 h-6 bg-muted/60 rounded-full" />
                    <div className="h-3 bg-muted/50 rounded flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          {/* Categories header skeleton */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-muted/40 px-6 py-3 rounded-2xl mb-8 animate-pulse">
              <div className="h-4 w-20 bg-muted/60 rounded" />
            </div>
            <div className="h-10 w-72 bg-muted/60 rounded-xl mx-auto mb-6 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 bg-muted/50 rounded-xl mx-auto max-w-2xl animate-pulse" />
              <div className="h-5 bg-muted/30 rounded-xl mx-auto max-w-xl animate-pulse" />
            </div>
          </div>

          {/* Category sections skeleton */}
          <div className="space-y-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted/60 rounded-2xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-7 w-28 bg-muted/60 rounded-xl animate-pulse" />
                      <div className="h-4 w-36 bg-muted/40 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="hidden sm:block h-10 w-24 bg-muted/50 rounded-xl animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden border-0 animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-muted/60" />
                      <div className="p-6 space-y-4">
                        <div className="space-y-3">
                          <div className="h-6 bg-muted/60 rounded-xl max-w-[80%]" />
                          <div className="h-4 bg-muted/40 rounded-lg" />
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl">
                            <div className="h-4 w-4 bg-muted/60 rounded" />
                            <div className="h-3 bg-muted/50 rounded flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around px-4 py-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-col gap-1 h-auto p-3 animate-pulse">
              <div className="w-5 h-5 bg-muted/60 rounded mx-auto mb-1" />
              <div className="w-8 h-2 bg-muted/40 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Error component with theme consistency
function HomepageError({
  error,
  retry,
}: {
  error: string;
  retry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-red-100/50 to-red-200/50 dark:from-red-900/20 dark:to-red-800/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="text-4xl">🍽️</div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-muted-foreground/80 mb-6 leading-relaxed">
          We&apos;re having trouble loading the homepage. Please try again.
        </p>
        <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200/30 dark:border-red-800/30 mb-8">
          <p className="text-sm text-red-700 dark:text-red-300 font-mono">
            Error: {error}
          </p>
        </div>
        {retry && (
          <button
            onClick={retry}
            className="bg-gradient-to-r from-primary via-primary/95 to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Main page component
export default async function HomePage() {
  // Get cookies for authentication
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let homepageData: HomepageData | null = null;
  let error: string | null = null;

  try {
    // Try to get homepage data
    homepageData = await HomepageService.getHomepageData(
      undefined,
      undefined,
      accessToken
    );
  } catch (err) {
    console.error("Failed to load homepage data:", err);
    error = err instanceof Error ? err.message : "Unknown error occurred";

    // Provide fallback data for development or when API is down
    homepageData = {
      featuredStalls: [],
      trendingProducts: [],
      stallsByCategory: [],
      nearbyStalls: undefined,
      distance: 0,
      email: "",
      userAddress: {},
    };

  }

  // If we have an error and no fallback data, show error page
  if (error && !homepageData) {
    return <HomepageError error={error} />;
  }

  return (
    <Suspense fallback={<HomepageLoading />}>
      <HomepageClient initialData={homepageData} accessToken={accessToken!} />
    </Suspense>
  );
}

// Optional: Add metadata
export const metadata = {
  title: "Find Your Perfect Spot",
  description:
    "Discover amazing local stalls, track your favorites, and help boost the local economy",
};
