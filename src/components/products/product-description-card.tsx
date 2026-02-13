
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { addCartItem } from "@/store/cart";
import { useState } from "react";
import { ProductDescriptionTab } from "./product-description-tab";

interface Props {
  productName: string;
  image?: string;
  productDescription: string;
  productFeatures: string[];
  className?: string;
  lang?: string;
}

import { ui, useTranslations } from "@/i18n/ui";

export function ProductDescriptionCard(props: Props) {
  const { productName, image, productDescription, productFeatures, className, lang = 'en' } = props;
  const t = useTranslations(lang as keyof typeof ui);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addCartItem({
      id: productName,
      name: productName,
      quantity: quantity,
      image: image
    });
  };

  return (
    <div className={cn('flex flex-col w-full', className)}>
      <h1 className='text-2xl font-bold text-zinc-900 mb-4'>{productName}</h1>
      <div className="flex items-center space-x-2 mb-6">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {t('gmp-ready') || 'GMP Ready'}
        </span>
        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
          {t('in-stock') || 'In Stock'}
        </span>
      </div>

      <ProductDescriptionTab className='w-full mb-8' productDescription={productDescription} productFeatures={productFeatures} />

      <div className='bg-zinc-50 rounded-lg p-6 border border-zinc-100'>
        <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
          {t('add-to-quote') || 'Add to Quote'}
        </h3>

        <div className='flex flex-col space-y-4 w-full mb-6'>
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor="quantity" className="text-sm font-medium text-zinc-700">
              {t('quantity-needed') || 'Quantity Needed'}
            </Label>
            <Input
              id='quantity'
              type='number'
              min={1}
              value={quantity}
              className='w-full'
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="w-full">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            {t('add-to-quote-cart') || 'Add to Quote Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}