
import { Button } from "@/components/ui/button";
import { addCartItem } from "@/store/cart";
import { Plus } from "lucide-react";

interface ProductCardActionsProps {
  product: {
    name: string;
    image?: string;
  };
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addCartItem({
      id: product.name,
      name: product.name,
      quantity: 1,
      image: product.image
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-zinc-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
      onClick={handleAddToCart}
      title="Add to Quote"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
