"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { orderService } from "@/lib/services/order.service"
import { paymentService } from "@/lib/services/payment.service"
import { formatPrice } from "@/utils/format-price"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Building, Check, Truck, ShieldCheck, MapPin, User, Phone, Mail } from "lucide-react"
import Link from "next/link"

const shippingMethods = [
  { id: "standard", name: "Giao hàng tiêu chuẩn", price: 0, time: "3-5 ngày" },
  { id: "express", name: "Giao hàng nhanh", price: 50000, time: "1-2 ngày" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, tax, total, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    note: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shippingCost = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0
  const finalTotal = total + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Create order
      const order = await orderService.createOrder({
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
        shippingAddress: `${formData.address}, ${formData.district}, ${formData.city}`,
        paymentMethod: paymentMethod,
        note: formData.note,
      })

      // Create payment
      await paymentService.createPayment({
        orderId: order.id,
        amount: finalTotal,
        method: paymentMethod,
      })

      clearCart()
      router.push("/order-success")
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
            <Link href="/products">
              <Button size="lg">Mua sắm ngay</Button>
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
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Thanh toán</h1>
            <p className="text-muted-foreground mt-1">Hoàn tất thông tin để đặt hàng</p>
          </div>

          {!isAuthenticated && (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm">
                Đã có tài khoản? Đăng nhập để thanh toán nhanh hơn và theo dõi đơn hàng dễ dàng.
              </p>
              <Link href="/login">
                <Button variant="outline" size="sm" className="bg-transparent whitespace-nowrap">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Thông tin giao hàng
                    </CardTitle>
                    <CardDescription>Điền đầy đủ thông tin để chúng tôi giao hàng cho bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Nguyễn Văn A"
                            className="pl-10"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="0912345678"
                            className="pl-10"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="TP. Hồ Chí Minh"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        <Input
                          id="district"
                          name="district"
                          placeholder="Quận 1"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Số nhà, tên đường, phường/xã..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note">Ghi chú</Label>
                      <Textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Phương thức vận chuyển
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                            shippingMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="cursor-pointer">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">Dự kiến: {method.time}</p>
                            </Label>
                          </div>
                          <span className={method.price === 0 ? "text-primary font-medium" : "font-medium"}>
                            {method.price === 0 ? "Miễn phí" : formatPrice(method.price)}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Phương thức thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</p>
                          </div>
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Thẻ tín dụng/Ghi nợ</p>
                            <p className="text-sm text-muted-foreground">Visa, MasterCard, JCB</p>
                          </div>
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "bank"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Chuyển khoản ngân hàng</p>
                            <p className="text-sm text-muted-foreground">Chuyển khoản qua tài khoản ngân hàng</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Đơn hàng của bạn</CardTitle>
                    <CardDescription>{items.length} sản phẩm</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex gap-3">
                          <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                              {quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                            <p className="text-sm text-primary font-medium">{formatPrice(product.price * quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (10%)</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span className={shippingCost === 0 ? "text-primary" : ""}>
                          {shippingCost === 0 ? "Miễn phí" : formatPrice(shippingCost)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary text-xl">{formatPrice(finalTotal)}</span>
                    </div>

                    <Button type="submit" className="w-full gap-2 h-12 text-base" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Đang xử lý..."
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          Đặt hàng
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
