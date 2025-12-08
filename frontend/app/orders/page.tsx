"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { orderService } from "@/lib/services/order.service"
import type { Order } from "@/lib/types"
import { formatPrice } from "@/utils/format-price"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Eye, ChevronRight, Search, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadOrders = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true)
          const ordersData = await orderService.getOrders()
          setOrders(ordersData)
        } catch (error) {
          console.error('Error loading orders:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadOrders()
  }, [isAuthenticated])

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Bạn chưa đăng nhập</h1>
            <p className="text-muted-foreground mb-6">Vui lòng đăng nhập để xem lịch sử đơn hàng</p>
            <Link href="/login">
              <Button size="lg">Đăng nhập</Button>
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Lịch sử đơn hàng</h1>
              <p className="text-muted-foreground mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
            </div>
            <Link href="/products">
              <Button className="gap-2">
                <Package className="h-4 w-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo mã đơn hàng..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipped">Đang giao</SelectItem>
                    <SelectItem value="delivered">Đã giao</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {loading ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-muted-foreground animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Đang tải đơn hàng...</h3>
              </CardContent>
            </Card>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-secondary/50 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Đơn hàng #{order.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                        </div>
                      </div>
                      <Badge className={`${statusColors[order.status]} border`} variant="outline">
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {order.items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(product.price)} x {quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-primary">{formatPrice(product.price * quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Tổng thanh toán</p>
                        <p className="text-xl font-bold text-primary">{formatPrice(order.total + order.tax)}</p>
                      </div>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
                <p className="text-muted-foreground mb-6">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus("all")
                    setSearchQuery("")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
