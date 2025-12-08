import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { FavouritesProvider } from "@/contexts/favourites-context"
import { AuthProvider } from "@/contexts/auth-context"

const _inter = Inter({ subsets: ["latin", "vietnamese"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ElectroHome - Gia Dụng Điện Tử Chính Hãng",
    template: "%s | ElectroHome",
  },
  description:
    "Cửa hàng gia dụng điện tử chính hãng - TV, Tủ lạnh, Máy giặt, Điều hòa với giá tốt nhất. Bảo hành chính hãng, giao hàng toàn quốc.",
  keywords: ["gia dụng điện tử", "tivi", "tủ lạnh", "máy giặt", "điều hòa", "electrohome"],
  authors: [{ name: "ElectroHome" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "ElectroHome",
    title: "ElectroHome - Gia Dụng Điện Tử Chính Hãng",
    description: "Cửa hàng gia dụng điện tử chính hãng với giá tốt nhất",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
          <CartProvider>
            <FavouritesProvider>{children}</FavouritesProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
