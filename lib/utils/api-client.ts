const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface RequestOptions extends RequestInit {
  accessToken?: string
  params?: Record<string, string | number | boolean>
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  private getHeaders(accessToken?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { accessToken, params, ...fetchOptions } = options

    const url = this.buildURL(endpoint, params)
    const headers = this.getHeaders(accessToken)

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.data || data
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  async patch<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}

export const apiClient = new APIClient(API_BASE_URL)
export { API_BASE_URL }
