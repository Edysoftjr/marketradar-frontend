"use client"

import { useState, useCallback, useEffect } from "react"
import type { CartItem } from "@/types/cart"

const CART_STORAGE_KEY = "marketradar_cart"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setCart(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error("Failed to save cart to storage:", error)
      }
    }
  }, [cart, isLoading])

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((i) => i.id === item.id)
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev]
        updated[existingIndex] = item
        return updated
      }
      // Add new item
      return [...prev, item]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const basePrice = item.selectedSize?.price || 0
      const addonsPrice = item.selectedAddons?.reduce((sum, addon) => sum + addon.price, 0) || 0
      const quantity = item.quantity || 1
      return total + (basePrice + addonsPrice) * quantity
    }, 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0)
  }, [cart])

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  }
}
