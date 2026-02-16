
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { addCartItem } from "@/store/cart";
import { FilePlus } from "lucide-react";

interface ProductCardActionsProps {
  product: {
    name: string;
    englishName?: string;
    image?: string;
  };
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const stableId = product.englishName || product.name;

    addCartItem({
      id: stableId,
      name: stableId, // Use English name as base
      quantity: 1,
      image: product.image
    });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-zinc-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            onClick={handleAddToCart}
            title="Add to Quote"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Add this item to your quote cart</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
