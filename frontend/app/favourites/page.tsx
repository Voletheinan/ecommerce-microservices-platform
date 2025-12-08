"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useFavourites } from "@/contexts/favourites-context"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight, Trash2 } from "lucide-react"

export default function FavouritesPage() {
  const { favourites, clearFavourites } = useFavourites()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sản phẩm yêu thích</h1>
              <p className="text-muted-foreground mt-1">
                {favourites.length > 0
                  ? `Bạn có ${favourites.length} sản phẩm trong danh sách yêu thích`
                  : "Danh sách yêu thích của bạn đang trống"}
              </p>
            </div>
            {favourites.length > 0 && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent text-destructive hover:text-destructive"
                  onClick={clearFavourites}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </Button>
                <Link href="/products">
                  <Button className="gap-2">
                    Tiếp tục mua sắm
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {favourites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {favourites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Chưa có sản phẩm yêu thích</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Hãy khám phá và thêm sản phẩm vào danh sách yêu thích của bạn để dễ dàng theo dõi và mua sắm sau này
              </p>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Khám phá sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
