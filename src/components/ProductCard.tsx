import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const ProductCard = ({ product }: { product: Product }) => {
  const fullStars = Math.floor(product.rating.rate);

  return (
    <Card className="group overflow-hidden border-border/60 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-white p-6">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <Badge className="absolute left-3 top-3 bg-secondary text-secondary-foreground text-xs font-medium capitalize">
          {product.category}
        </Badge>
      </div>
      <CardContent className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {product.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < fullStars
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.rating.count})
          </span>
        </div>
        <p className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
export type { Product };
