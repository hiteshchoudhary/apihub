import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageInterface } from "@/interfaces/image";

export function ImageCarousel({ images }: { images: ImageInterface[] }) {
  return (
    <div className="flex justify-center ">
      <Carousel className="w-full max-w-sm ">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.url}>
              <Card className=" p-3 flex aspect-square justify-center items-center">
                <img src={image.url} alt="" />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
