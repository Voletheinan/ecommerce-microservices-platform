import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground mb-8">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
          </p>
          <div className="bg-card p-4 rounded-xl border border-border mb-8">
            <div className="flex items-center gap-3 justify-center">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm">
                Mã đơn hàng: <strong>ORD{Date.now()}</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button variant="outline" className="gap-2 bg-transparent">
                Xem đơn hàng
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button className="gap-2">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
