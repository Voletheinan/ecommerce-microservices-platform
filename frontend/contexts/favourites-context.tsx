"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product, Favourite } from "@/lib/types"
import { favouriteService } from "@/lib/services/favourite.service"

interface FavouritesContextType {
  favourites: Product[]
  addToFavourites: (product: Product) => Promise<void>
  removeFromFavourites: (productId: string) => Promise<void>
  clearFavourites: () => Promise<void>
  isFavourite: (productId: string) => boolean
  totalFavourites: number
  loading: boolean
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        setLoading(true)
        const favouritesData = await favouriteService.getFavourites()
        const products = favouritesData.map((fav: Favourite) => fav.product)
        setFavourites(products)
      } catch (error) {
        console.error('Error loading favourites:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFavourites()
  }, [])

  const addToFavourites = async (product: Product) => {
    try {
      await favouriteService.addFavourite(product.id)
      setFavourites((prev) => {
        if (prev.find((p) => p.id === product.id)) return prev
        return [...prev, product]
      })
    } catch (error) {
      console.error('Error adding to favourites:', error)
      throw error
    }
  }

  const removeFromFavourites = async (productId: string) => {
    try {
      await favouriteService.removeFavourite(productId)
      setFavourites((prev) => prev.filter((p) => p.id !== productId))
    } catch (error) {
      console.error('Error removing from favourites:', error)
      throw error
    }
  }

  const clearFavourites = async () => {
    try {
      // Remove all favourites one by one
      const productIds = favourites.map((p) => p.id)
      await Promise.all(productIds.map((id) => favouriteService.removeFavourite(id)))
      setFavourites([])
    } catch (error) {
      console.error('Error clearing favourites:', error)
      throw error
    }
  }

  const isFavourite = (productId: string) => {
    return favourites.some((p) => p.id === productId)
  }

  const totalFavourites = favourites.length

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addToFavourites,
        removeFromFavourites,
        clearFavourites,
        isFavourite,
        totalFavourites,
        loading,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const context = useContext(FavouritesContext)
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider")
  }
  return context
}
