"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroBanner } from "@/components/hero-banner"
import { CategoriesSection } from "@/components/categories-section"
import { ProductGrid } from "@/components/product-grid"
import { productService } from "@/lib/services/product.service"
import type { Product } from "@/lib/types"
import { Truck, Shield, Headphones, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Truck,
    title: "Giao hàng miễn phí",
    description: "Đơn hàng từ 500K",
  },
  {
    icon: Shield,
    title: "Bảo hành chính hãng",
    description: "Lên đến 24 tháng",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Tư vấn tận tâm",
  },
  {
    icon: CreditCard,
    title: "Thanh toán đa dạng",
    description: "Nhiều hình thức",
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts({ limit: 12 })
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Đang tải sản phẩm...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const featuredProducts = products.slice(0, 4)
  const newArrivals = products.slice(4, 8)
  const bestSellers = products.filter((p) => p.rating >= 4.7).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />

        <div className="container mx-auto px-4 py-8">
          {/* Features Section */}
          <section className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 md:p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <CategoriesSection />

          <section className="py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Sản phẩm nổi bật</h2>
                <p className="text-muted-foreground mt-1">Những sản phẩm được yêu thích nhất</p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="gap-2 hidden sm:flex bg-transparent">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </section>

          <section className="py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Hàng mới về</h2>
                <p className="text-muted-foreground mt-1">Cập nhật những sản phẩm mới nhất</p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="gap-2 hidden sm:flex bg-transparent">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </section>

          <section className="py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Bán chạy nhất</h2>
                <p className="text-muted-foreground mt-1">Top sản phẩm được mua nhiều nhất</p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="gap-2 hidden sm:flex bg-transparent">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={bestSellers} />
          </section>

          <section className="py-12">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">Đăng ký nhận ưu đãi</h2>
              <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
                Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background"
                />
                <Button variant="secondary" size="lg" className="px-8">
                  Đăng ký
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
