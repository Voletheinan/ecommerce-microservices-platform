"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { categories } from "@/lib/mock-data"
import { productService } from "@/lib/services/product.service"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/utils/format-price"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X, Grid3X3, LayoutList } from "lucide-react"
import { cn } from "@/lib/utils"

type SortOption = "default" | "price-asc" | "price-desc" | "rating-desc" | "name-asc"

const ITEMS_PER_PAGE = 8

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : [])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by categories
    if (selectedCategories.length > 0) {
      const categoryNames = categories.filter((c) => selectedCategories.includes(c.slug)).map((c) => c.name)
      result = result.filter((p) => categoryNames.includes(p.category))
    }

    // Filter by price
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [sortBy, selectedCategories, priceRange])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 50000000])
    setSortBy("default")
    setCurrentPage(1)
  }

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tất cả sản phẩm</h1>
              <p className="text-muted-foreground mt-1">
                Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản phẩm
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="md:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
              <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                  <SelectItem value="rating-desc">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="name-asc">Tên: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside
              className={cn(
                "fixed inset-0 z-50 bg-background p-6 overflow-y-auto transition-transform duration-300 md:relative md:translate-x-0 md:w-72 md:flex-shrink-0 md:p-0 md:bg-transparent",
                showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              )}
            >
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                      Xóa tất cả
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <Label className="text-sm font-semibold mb-4 block">Danh mục</Label>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(cat.slug)}
                          onCheckedChange={() => toggleCategory(cat.slug)}
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <Label className="text-sm font-semibold mb-4 block">Khoảng giá</Label>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={50000000}
                    step={1000000}
                    onValueChange={(value) => {
                      setPriceRange(value as [number, number])
                      setCurrentPage(1)
                    }}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="px-3 py-1 bg-secondary rounded-lg">{formatPrice(priceRange[0])}</span>
                    <span className="px-3 py-1 bg-secondary rounded-lg">{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                <Button className="w-full md:hidden" onClick={() => setShowFilters(false)}>
                  Áp dụng bộ lọc
                </Button>
              </div>
            </aside>

            {/* Overlay for mobile */}
            {showFilters && (
              <div className="fixed inset-0 bg-foreground/50 z-40 md:hidden" onClick={() => setShowFilters(false)} />
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Đang tải sản phẩm...</h3>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <>
                  <div
                    className={cn(
                      "grid gap-4 md:gap-6",
                      viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
                    )}
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-muted-foreground mb-6">Thử điều chỉnh bộ lọc để tìm sản phẩm phù hợp</p>
                  <Button variant="outline" className="bg-transparent" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
