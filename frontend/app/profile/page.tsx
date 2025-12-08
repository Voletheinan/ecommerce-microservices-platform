"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Settings, LogOut, ChevronRight, Mail, Phone, MapPin, Edit, Lock, Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"

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

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Bạn chưa đăng nhập</h1>
            <p className="text-muted-foreground mb-6">Vui lòng đăng nhập để xem thông tin tài khoản</p>
            <Link href="/login">
              <Button size="lg">Đăng nhập</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Tài khoản của tôi</h1>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-20 w-20 mb-4 ring-4 ring-primary/10">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-lg">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                  <nav className="space-y-1">
                    {[
                      { id: "profile", icon: User, label: "Thông tin cá nhân" },
                      { id: "orders", icon: Package, label: "Đơn hàng của tôi" },
                      { id: "settings", icon: Settings, label: "Cài đặt" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all " +
                          (activeTab === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary text-foreground")
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                        <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Tên đăng nhập</Label>
                          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.username}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Email</Label>
                          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.email}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Số điện thoại</Label>
                          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Chưa cập nhật</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Địa chỉ</Label>
                          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Chưa cập nhật</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Orders Summary */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Đơn hàng gần đây</CardTitle>
                        <CardDescription>Xem {recentOrders.length} đơn hàng mới nhất</CardDescription>
                      </div>
                      <Link href="/orders">
                        <Button variant="ghost" size="sm" className="gap-1">
                          Xem tất cả
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">#{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge 
                                className={statusColors[order.status] + ' border'} 
                                variant="outline"
                              >
                                {statusLabels[order.status]}
                              </Badge>
                              <span className="font-semibold hidden sm:block">
                                {formatPrice(order.total + order.tax)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Đơn hàng của tôi</CardTitle>
                        <CardDescription>Quản lý và theo dõi tất cả đơn hàng</CardDescription>
                      </div>
                      <Link href="/orders">
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          Xem chi tiết
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Đang tải đơn hàng...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.length > 0 ? (
                            orders.map((order) => (
                              <div key={order.id} className="border border-border rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                      <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-semibold">Đơn hàng #{order.id}</p>
                                      <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                                    </div>
                                  </div>
                                  <Badge 
                                    className={statusColors[order.status] + ' border'} 
                                    variant="outline"
                                  >
                                    {statusLabels[order.status]}
                                  </Badge>
                                </div>

                                <div className="space-y-3 mb-4">
                                  {order.items.map((item) => (
                                    <div key={item.productId || item.product?.id} className="flex items-center gap-3">
                                      <div className="relative w-12 h-12 bg-secondary rounded-lg overflow-hidden">
                                        <Image
                                          src={item.product?.image || "/placeholder.svg"}
                                          alt={item.product?.name || "Product"}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-1">{item.product?.name || "Sản phẩm"}</p>
                                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                                      </div>
                                      <p className="text-sm font-medium">{formatPrice((item.product?.price || item.price || 0) * item.quantity)}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                  <span className="text-sm text-muted-foreground">Tổng cộng</span>
                                  <span className="font-bold text-primary">{formatPrice(order.total + order.tax)}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">Bạn chưa có đơn hàng nào</p>
                            </div>
                          )}
                        </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Đổi mật khẩu
                      </CardTitle>
                      <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input id="currentPassword" type="password" placeholder="Nhập mật khẩu hiện tại" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input id="newPassword" type="password" placeholder="Nhập mật khẩu mới" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
                        <Input id="confirmNewPassword" type="password" placeholder="Nhập lại mật khẩu mới" />
                      </div>
                      <Button>Cập nhật mật khẩu</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Thông báo
                      </CardTitle>
                      <CardDescription>Quản lý cài đặt thông báo của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Thông báo đơn hàng</p>
                          <p className="text-sm text-muted-foreground">Nhận thông báo về trạng thái đơn hàng</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Khuyến mãi</p>
                          <p className="text-sm text-muted-foreground">Nhận thông tin về ưu đãi và khuyến mãi</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Sản phẩm mới</p>
                          <p className="text-sm text-muted-foreground">Thông báo khi có sản phẩm mới</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
