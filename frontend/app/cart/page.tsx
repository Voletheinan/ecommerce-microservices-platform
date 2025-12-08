"use client"

import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/utils/format-price"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, tax, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Khám phá sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Giỏ hàng</h1>
              <p className="text-muted-foreground mt-1">Bạn có {items.length} sản phẩm trong giỏ</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2 bg-transparent hidden sm:flex">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="relative w-28 h-28 bg-secondary rounded-xl overflow-hidden flex-shrink-0"
                      >
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${product.id}`}
                              className="font-semibold hover:text-primary transition-colors line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-end justify-between mt-auto pt-3">
                          <div className="flex items-center border border-border rounded-lg bg-secondary/50">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center font-medium">{quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">{formatPrice(product.price * quantity)}</p>
                            {quantity > 1 && (
                              <p className="text-xs text-muted-foreground">{formatPrice(product.price)} / sản phẩm</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon Code */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Mã giảm giá" className="pl-10" />
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Áp dụng
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính ({items.length} sản phẩm)</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (10%)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Phí vận chuyển
                      </span>
                      <span className="text-primary font-medium">Miễn phí</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary text-xl">{formatPrice(total)}</span>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button className="w-full gap-2 h-12 text-base" size="lg">
                      Tiến hành thanh toán
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Giao hàng miễn phí cho đơn từ 500.000đ</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
