"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, YAxis } from "recharts"

import { formatPrice } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useDelayedRender } from "../hooks/use-delayed-render"

export const description = "An interactive bar chart"

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface ChartProps {
  prices: number[]
  max: number
  min: number
  numItems: number
}
export default function Chart({ prices, max, min, numItems }: ChartProps) {
  const chartData = prices.map((price, index) => ({ price: Number(price) }))
  const shouldRender = useDelayedRender(5000)

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Prices</CardTitle>
          <CardDescription></CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 border-b sm:border-b-0 sm:border-r p-4 sm:p-6">
            <span className="block text-xs text-muted-foreground mb-1">
              Number of Items
            </span>
            <span className="text-xl font-bold leading-none sm:text-2xl lg:text-3xl">
              {numItems}
            </span>
          </div>
          <div className="flex-1 border-b sm:border-b-0 sm:border-r p-4 sm:p-6">
            <span className="block text-xs text-muted-foreground mb-1">
              Min Price
            </span>
            <span className="text-xl font-bold leading-none sm:text-2xl lg:text-3xl">
              {formatPrice(min)}
            </span>
          </div>
          <div className="flex-1 p-4 sm:p-6">
            <span className="block text-xs text-muted-foreground mb-1">
              Max Price
            </span>
            <span className="text-xl font-bold leading-none sm:text-2xl lg:text-3xl">
              {formatPrice(max)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {shouldRender && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <Bar dataKey="price" type="natural" fill="var(--color-price)" />
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <YAxis type="number" domain={["dataMin", "dataMax"]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
