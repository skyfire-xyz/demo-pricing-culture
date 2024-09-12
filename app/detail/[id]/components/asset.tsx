import Link from "next/link"
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  Link1Icon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

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
        <ul>
          <li className="flex">
            <Link1Icon className="mr-2 h-4 w-4" />
            <Link className="text-sm" href={asset.url} target="_blank">
              {asset.platform}
            </Link>
          </li>
        </ul>
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
