"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Smart TV 4K",
    subtitle: "Giảm đến 30%",
    description: "Trải nghiệm hình ảnh sắc nét với công nghệ QLED tiên tiến nhất hiện nay",
    image: "/smart-tv-living-room-modern.jpg",
    link: "/products?category=tivi",
    buttonText: "Khám phá ngay",
  },
  {
    id: 2,
    title: "Điều hòa Inverter",
    subtitle: "Tiết kiệm điện 60%",
    description: "Làm mát nhanh chóng, vận hành êm ái với công nghệ Inverter thế hệ mới",
    image: "/air-conditioner-cool-room-modern.jpg",
    link: "/products?category=dieu-hoa",
    buttonText: "Xem chi tiết",
  },
  {
    id: 3,
    title: "Robot hút bụi thông minh",
    subtitle: "Giá chỉ từ 5 triệu",
    description: "Tự động dọn dẹp, điều khiển qua điện thoại thông minh mọi lúc mọi nơi",
    image: "/robot-vacuum-smart-home.png",
    link: "/products?category=may-hut-bui",
    buttonText: "Mua ngay",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)

  return (
    <section className="relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] w-full overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={banner.image || "/placeholder.svg"}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
              <div className="max-w-xl text-background">
                <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-full mb-6 animate-pulse">
                  {banner.subtitle}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance leading-tight">
                  {banner.title}
                </h1>
                <p className="text-background/90 mb-8 text-base md:text-lg max-w-md">{banner.description}</p>
                <div className="flex gap-4">
                  <Link href={banner.link}>
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base"
                    >
                      {banner.buttonText}
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-background text-background hover:bg-background/20 px-8 py-6 text-base"
                    >
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-background w-8" : "bg-background/50 hover:bg-background/70 w-3"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
