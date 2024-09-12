import { AssetInfo } from "@/lib/pricing-culture/type"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface AssetProps {
  asset: AssetInfo
}
export default function Asset({ asset }: AssetProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{asset.name}</CardTitle>
        <CardDescription>{asset.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-[85%] mx-auto">
          <CarouselContent>
            {asset.media.map((url: string, index: number) => (
              <CarouselItem key={index} className="basis-1/3">
                <img src={url} alt={url} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  )
}
