import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";
import { type ProductData } from "./types";

interface ProductCarouselProps {
  productData: ProductData;
};

export default function ProductCarousel({ productData }: ProductCarouselProps) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {productData.images.map((imgFileName, ind) => (
          <CarouselItem key={ind}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}