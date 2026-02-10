'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProductCarouselProps {
  productImageUris: string[];
  className?: string;
};

export default function ProductCarousel({ productImageUris, className }: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className={cn(className)} opts={{ loop: true }}>
      <CarouselContent>
        {productImageUris.map((imgUri, ind) => (
          <CarouselItem key={ind}>
            <Card className="border-0 shadow-none">
              <CardContent className="flex aspect-square items-center justify-center p-[2vmin] relative">
                {!loadedImages[ind] && (
                  <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
                )}
                <img
                  src={imgUri}
                  className={cn('object-scale-down h-[80%] transition-opacity duration-300', !loadedImages[ind] ? 'opacity-0' : 'opacity-100')}
                  alt={`img-${ind}`}
                  onLoad={() => setLoadedImages(prev => ({ ...prev, [ind]: true }))}
                  ref={(el) => {
                    if (el?.complete && !loadedImages[ind]) {
                      setLoadedImages(prev => ({ ...prev, [ind]: true }));
                    }
                  }}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {productImageUris.length > 1 && (
        <>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all bg-zinc-300",
                  index === current - 1 && "bg-zinc-800 w-4"
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  )
}