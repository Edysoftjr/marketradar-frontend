import type { CreateProductData, UpdateProductData, ProductFilters } from "@/types"
import { fetchWithTokenRefresh } from "./token-refresh"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg" // extract mime type
  const bstr = atob(arr[1]) // decode base64
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export async function createProduct(
  data: CreateProductData,
  accessToken?: string,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const formData = new FormData()

  // Append scalar fields
  if (data.name) formData.append("name", data.name)
  if (data.description) formData.append("description", data.description)
  if (data.category) formData.append("category", data.category)
  if (data.quantity !== undefined) formData.append("quantity", String(data.quantity))
  if (data.price !== undefined) formData.append("price", String(data.price))
  if (data.stallId !== undefined) formData.append("stallId", data.stallId)
  if (data.payOnOrder !== undefined) formData.append("payOnOrder", String(data.payOnOrder))

  // Append structured fields as JSON
  if (data.sizes) formData.append("sizes", JSON.stringify(data.sizes))
  if (data.addons) formData.append("addons", JSON.stringify(data.addons))

  if (data.images && data.images.length > 0) {
    data.images.forEach((img, index) => {
      if (img instanceof File) {
        console.log("File type")
        formData.append("images", img)
      } else if (typeof img === "string" && img.startsWith("data:image")) {
        console.log("string type")
        const file = base64ToFile(img, `image_${index}.jpg`)
        formData.append("images", file)
      }
    })
  }

  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/products`, {
    method: "POST",
    body: formData,
    accessToken,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create product")
  }

  return response.json()
}

export async function updateProduct(
  productId: string,
  data: UpdateProductData,
  accessToken?: string,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const formData = new FormData()

  // Append scalar fields
  if (data.name) formData.append("name", data.name)
  if (data.description) formData.append("description", data.description ?? "")
  if (data.category) formData.append("category", data.category ?? "")
  if (data.quantity !== undefined) formData.append("quantity", String(data.quantity))
  if (data.price !== undefined) formData.append("price", String(data.price))
  if (data.stallId !== undefined) formData.append("stallId", data.stallId)
  if (data.payOnOrder !== undefined) formData.append("payOnOrder", String(data.payOnOrder))

  // Append structured fields as JSON
  if (data.sizes) formData.append("sizes", JSON.stringify(data.sizes))
  if (data.addons) formData.append("addons", JSON.stringify(data.addons))

  const existingImageUrls: string[] = []

  if (data.images && data.images.length > 0) {
    data.images.forEach((img, index) => {
      if (img instanceof File) {
        formData.append("images", img)
      } else if (typeof img === "string" && img.startsWith("data:image")) {
        const file = base64ToFile(img, `image_${index}.jpg`)
        formData.append("images", file)
      } else if (typeof img === "string" && img.startsWith("/uploads")) {
        // Keep track of existing images that should be preserved
        existingImageUrls.push(img)
      }
    })
  }

  // Send existing image URLs as a JSON array so the backend knows to keep them
  if (existingImageUrls.length > 0) {
    formData.append("existingImages", JSON.stringify(existingImageUrls))
  }

  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    body: formData,
    accessToken,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update product")
  }

  return response.json()
}

export async function deleteProduct(
  productId: string,
  accessToken?: string,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    accessToken: accessToken,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete product")
  }

  return response.json()
}

export async function getProductsByStall(stallId: string, accessToken?: string): Promise<unknown[]> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/products/stall/${stallId}`, {
    cache: "no-store",
    accessToken: accessToken,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function getProductById(
  productId: string,
  accessToken?: string,
): Promise<{ success: boolean; data: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/products/${productId}`, {
    cache: "no-store",
    accessToken: accessToken,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }

  return response.json()
}

export async function searchProducts(
  query: string,
  filters?: ProductFilters,
  accessToken?: string,
): Promise<unknown[]> {
  const params = new URLSearchParams()
  params.append("query", query)
  if (filters?.category) params.append("category", filters.category)
  if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString())
  if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString())
  if (filters?.stallId) params.append("stallId", filters.stallId)

  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/products/search?${params.toString()}`, {
    cache: "no-store",
    accessToken: accessToken,
  })

  if (!response.ok) {
    throw new Error("Failed to search products")
  }

  return response.json()
}
