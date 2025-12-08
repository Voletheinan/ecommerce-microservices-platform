import type { Product } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"

interface ProductGridProps {
  products: Product[]
  title?: string
  description?: string
}

export function ProductGrid({ products, title, description }: ProductGridProps) {
  return (
    <section>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
