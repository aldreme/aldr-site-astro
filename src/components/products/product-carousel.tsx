'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface ProductCarouselProps {
  productImageUri: string[];
};

export default function ProductCarousel({ productImageUri }: ProductCarouselProps) {
  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {productImageUri.map((imgUri, ind) => (
          <CarouselItem key={ind}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-[2vmin]">
                <img src={imgUri} className='object-scale-down max-h-full' alt={`img-${ind}`} />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}