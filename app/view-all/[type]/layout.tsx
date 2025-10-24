import { cookies } from "next/headers"
import ViewAllPage from "./page"
import { redirect } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface PageProps {
    params: Promise<{
        type: "stalls" | "products"
    }>
    searchParams?: Promise<{
        category?: string
        q?: string
        sortBy?: string
        sortOrder?: "asc" | "desc"
    }>
}

async function getInitialData(
    type: string,
    searchParams: {
        category?: string
        q?: string
        sortBy?: string
        sortOrder?: "asc" | "desc"
    },
    accessToken: string
) {
    const queryParams = new URLSearchParams()
    if (searchParams.q) queryParams.set("searchQuery", searchParams.q)
    if (searchParams.category) queryParams.set("category", searchParams.category)
    if (searchParams.sortBy) queryParams.set("sortBy", searchParams.sortBy)
    if (searchParams.sortOrder) queryParams.set("sortOrder", searchParams.sortOrder)
    queryParams.set("limit", "12")

    const url = `${API_BASE_URL}/view-all/${type}?${queryParams.toString()}`

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        const errorText = await res.text()
        if (res.status === 401) {
            redirect("/login")
        }
        throw new Error(`Failed to fetch initial data: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    return data
}

export default async function Page({ params, searchParams }: PageProps) {
    // Await params and searchParams with fallback
    const resolvedParams = await params
    const resolvedSearchParams = searchParams ? await searchParams : {}

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) {
        redirect("/login")
    }

    let initialData
    try {
        const response = await getInitialData(resolvedParams.type, resolvedSearchParams, accessToken)

        // Check if response has the expected structure
        if (response.success && response.data) {
            initialData = response.data
        } else if (response.items) {
            // In case the API returns items directly
            initialData = response
        } else {
            console.error("Unexpected response structure:", response)
        }
    } catch (error) {
        console.error("Error fetching initial data:", error)
    }

    return (
        <ViewAllPage
            type={resolvedParams.type}
            initialData={initialData}
            accessToken={accessToken}
            category={resolvedSearchParams?.category}
        />
    )
}