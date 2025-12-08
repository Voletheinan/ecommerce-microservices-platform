import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">ElectroHome</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              Chuyên cung cấp các sản phẩm gia dụng điện tử chính hãng với giá tốt nhất. Bảo hành uy tín, giao hàng
              nhanh chóng trên toàn quốc.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Danh mục</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="/products?category=tivi" className="hover:text-background transition-colors">
                  Tivi
                </Link>
              </li>
              <li>
                <Link href="/products?category=tu-lanh" className="hover:text-background transition-colors">
                  Tủ lạnh
                </Link>
              </li>
              <li>
                <Link href="/products?category=may-giat" className="hover:text-background transition-colors">
                  Máy giặt
                </Link>
              </li>
              <li>
                <Link href="/products?category=dieu-hoa" className="hover:text-background transition-colors">
                  Điều hòa
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-background transition-colors">
                  Xem tất cả
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-background font-medium">1900 1234 56</p>
                  <p className="text-xs">Hotline 24/7</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-background font-medium">support@electrohome.vn</p>
                  <p className="text-xs">Email hỗ trợ</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-background font-medium">123 Đường ABC</p>
                  <p className="text-xs">Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-medium mb-3 text-sm">Thanh toán</h4>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/10 rounded-lg text-xs">
                  <CreditCard className="h-3.5 w-3.5" />
                  VISA
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/10 rounded-lg text-xs">
                  <CreditCard className="h-3.5 w-3.5" />
                  MasterCard
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/10 rounded-lg text-xs">
                  <Smartphone className="h-3.5 w-3.5" />
                  Momo
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/10 rounded-lg text-xs">
                  <Banknote className="h-3.5 w-3.5" />
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
          <p>&copy; 2025 ElectroHome. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-background transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
