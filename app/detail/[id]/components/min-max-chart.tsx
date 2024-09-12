"use client"

import * as React from "react"
import { max, min } from "lodash"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

export const description = "An interactive bar chart"

const chartConfig = {
  average: {
    label: "Average",
    color: "hsl(var(--chart-1))",
  },
  min: {
    label: "Min Price",
    color: "hsl(var(--chart-2))",
  },
  max: {
    label: "Max Price",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

interface ChartProps {
  data: any
  from: string
  to: string
}
export default function MinMaxChart({ data, from, to }: ChartProps) {
  const chartData = data.map((event) => ({
    date: event.event_time,
    average: Number(event.value_average),
  }))

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            Average Price ( {from} - {to} )
          </CardTitle>
          <CardDescription></CardDescription>
        </div>
        {/* <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Min Price</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {min}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Max Price</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {max}
            </span>
          </div>
        </div> */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <Line
              dataKey="average"
              type="natural"
              stroke="var(--color-average)"
              strokeWidth={4}
              dot={false}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) => Math.floor(value)}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
