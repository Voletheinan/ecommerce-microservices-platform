"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StarRating } from "@/components/star-rating"
import { ProductGrid } from "@/components/product-grid"
import { productService } from "@/lib/services/product.service"
import { ratingService } from "@/lib/services/rating.service"
import type { Product, Review } from "@/lib/types"
import { formatPrice } from "@/utils/format-price"
import { useCart } from "@/contexts/cart-context"
import { useFavourites } from "@/contexts/favourites-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Minus, Plus, ChevronRight, Truck, Shield, RotateCcw, Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productData = await productService.getProductById(productId)
        setProduct(productData)
        
        // Fetch reviews
        try {
          const reviewsData = await ratingService.getProductReviews(productId)
          setReviews(reviewsData)
        } catch (error) {
          console.error('Error fetching reviews:', error)
        }

        // Fetch related products (same category)
        try {
          const allProducts = await productService.getProducts()
          const related = allProducts
            .filter((p) => p.category === productData.category && p.id !== productData.id)
            .slice(0, 4)
          setRelatedProducts(related)
        } catch (error) {
          console.error('Error fetching related products:', error)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewName, setReviewName] = useState("")

  const { addToCart } = useCart()
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites()

  // Generate product images - use product image or placeholder
  const productImages = product 
    ? [
        product.image || "/placeholder.svg",
        product.image || "/placeholder.svg",
        product.image || "/placeholder.svg",
        product.image || "/placeholder.svg"
      ]
    : []

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Đang tải sản phẩm...</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h1>
            <p className="text-muted-foreground mb-6">Sản phẩm bạn tìm không tồn tại hoặc đã bị xóa</p>
            <Link href="/products">
              <Button>Quay lại cửa hàng</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const favourite = isFavourite(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0


  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleToggleFavourite = async () => {
    try {
      if (favourite) {
        await removeFromFavourites(product.id)
      } else {
        await addToFavourites(product)
      }
    } catch (error) {
      console.error('Error toggling favourite:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await ratingService.createReview({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment,
      })
      // Refresh reviews
      const reviewsData = await ratingService.getProductReviews(productId)
      setReviews(reviewsData)
      setReviewName("")
      setReviewRating(5)
      setReviewComment("")
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-foreground transition-colors">
              Sản phẩm
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          {/* Product Detail */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-card rounded-2xl overflow-hidden border border-border">
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-lg px-4 py-1">
                    -{discount}%
                  </Badge>
                )}
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-square bg-card rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === index ? "border-primary" : "border-border hover:border-primary/50",
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">{product.name}</h1>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={product.rating} />
                <span className="text-sm text-muted-foreground">({product.reviewCount} đánh giá)</span>
                <span className="text-muted-foreground">|</span>
                <Badge variant={product.inStock ? "default" : "secondary"} className="font-medium">
                  {product.inStock ? "Còn hàng" : "Hết hàng"}
                </Badge>
              </div>

              <div className="flex items-baseline gap-4 mb-6 p-4 bg-secondary/50 rounded-xl">
                <span className="text-3xl md:text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="destructive">Tiết kiệm {formatPrice(product.originalPrice! - product.price)}</Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

              {/* Features */}
              {product.features && (
                <div className="mb-6 p-4 bg-card rounded-xl border border-border">
                  <h3 className="font-semibold mb-3">Tính năng nổi bật:</h3>
                  <ul className="grid grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-xl bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 gap-2 h-12 text-base"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className={cn("h-12 w-12 flex-shrink-0", favourite && "text-accent border-accent")}
                  onClick={handleToggleFavourite}
                >
                  <Heart className={cn("h-5 w-5", favourite && "fill-current")} />
                </Button>
              </div>

              {/* Policies */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">Giao hàng miễn phí</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">Bảo hành 24 tháng</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">Đổi trả 30 ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Description & Reviews */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Đánh giá ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin chi tiết</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
                {product.features && (
                  <>
                    <h4 className="font-semibold mb-3">Các tính năng chính:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Review List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Đánh giá từ khách hàng</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-card rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.userName}</span>
                        <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
                  )}
                </div>

                {/* Review Form */}
                <div className="p-6 bg-card rounded-2xl border border-border h-fit">
                  <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Tên của bạn</Label>
                      <Input
                        id="name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Nhập tên của bạn"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Đánh giá</Label>
                      <div className="mt-2">
                        <StarRating rating={reviewRating} interactive onChange={setReviewRating} size="lg" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Nhận xét</Label>
                      <Textarea
                        id="comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
                        rows={4}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Gửi đánh giá
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <ProductGrid products={relatedProducts} title="Sản phẩm liên quan" description="Có thể bạn cũng thích" />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
