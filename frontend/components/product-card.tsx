"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/mock-data"
import { formatPrice } from "@/utils/format-price"
import { useCart } from "@/contexts/cart-context"
import { useFavourites } from "@/contexts/favourites-context"
import { cn } from "@/lib/utils"

interface QuickViewButtonProps {
  productId: string
}

function QuickViewButton({ productId }: QuickViewButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/products/${productId}`)
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="h-9 w-9 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 delay-75"
      onClick={handleClick}
    >
      <Eye className="h-4 w-4" />
    </Button>
  )
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites()
  const favourite = isFavourite(product.id)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favourite) {
      removeFromFavourites(product.id)
    } else {
      addToFavourites(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-border/50 hover:border-primary/30">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && <Badge className="bg-accent text-accent-foreground font-semibold">-{discount}%</Badge>}
            {product.rating >= 4.7 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Hot
              </Badge>
            )}
          </div>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center backdrop-blur-[2px]">
              <Badge variant="secondary" className="text-sm font-medium px-4 py-1">
                Hết hàng
              </Badge>
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0",
                favourite && "opacity-100 translate-x-0 text-accent bg-accent/10",
              )}
              onClick={handleToggleFavourite}
            >
              <Heart className={cn("h-4 w-4", favourite && "fill-current")} />
            </Button>
            <QuickViewButton productId={product.id} />
          </div>

          {/* Add to cart button - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button className="w-full gap-2 shadow-lg" size="sm" disabled={!product.inStock} onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Thêm vào giỏ
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Product name */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-xs text-muted-foreground mb-2">{product.category}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
