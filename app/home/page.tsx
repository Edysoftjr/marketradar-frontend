import { HomepageClient } from "./homepage-client"
import { HomepageService } from "@/lib/services/homepage.service"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { HomepageLoadingSkeleton } from "@/components/ui/skeleton-loaders"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  // Get cookies for authentication
  const cookieStore = await cookies()
  const accessToken: string | undefined = cookieStore.get("accessToken")?.value

  // Redirect to login if no token
  if (!accessToken) {
    redirect("/login")
  }

  try {
    const initialData = await HomepageService.getHomepageData(undefined, undefined, accessToken)
    return (
      <Suspense fallback={<HomepageLoadingSkeleton />}>
        <HomepageClient initialData={initialData} accessToken={accessToken!} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching homepage data:", error)
    return (
      <Suspense fallback={<HomepageLoadingSkeleton />}>
        <HomepageClient accessToken={accessToken!} />
      </Suspense>
    )
  }
}
