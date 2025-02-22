'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  productImageUris: string[];
  className?: string;
};

export default function ProductCarousel({ productImageUris, className }: ProductCarouselProps) {
  return (
    <Carousel className={cn(className)} opts={{ loop: true }}>
      <CarouselContent>
        {productImageUris.map((imgUri, ind) => (
          <CarouselItem key={ind}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-[2vmin]">
                <img src={imgUri} className='object-scale-down h-[80%]' alt={`img-${ind}`} />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}