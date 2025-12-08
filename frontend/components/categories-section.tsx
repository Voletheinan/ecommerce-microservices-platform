import type React from "react"
import Link from "next/link"
import { categories } from "@/lib/mock-data"
import { Tv, Refrigerator, WashingMachine, AirVent, Wind, Microwave, Album as Vacuum, CookingPot } from "lucide-react"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  tivi: Tv,
  "tu-lanh": Refrigerator,
  "may-giat": WashingMachine,
  "dieu-hoa": AirVent,
  "may-loc-khong-khi": Wind,
  "lo-vi-song": Microwave,
  "may-hut-bui": Vacuum,
  "noi-com-dien": CookingPot,
}

export function CategoriesSection() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Danh mục sản phẩm</h2>
          <p className="text-muted-foreground mt-1">Khám phá theo danh mục</p>
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.slug] || Tv
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="flex flex-col items-center p-4 md:p-6 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <span className="text-xs md:text-sm text-center font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
