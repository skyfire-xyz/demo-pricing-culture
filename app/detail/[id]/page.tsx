"use client"

import { useState } from "react"

import { useSelectedComp } from "@/lib/pricing-culture/context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Asset from "./components/asset"
import Chart from "./components/chart"
import MinMaxChart from "./components/min-max-chart"

export default function DetailPage(props: {
  params: { id: string }
  searchParams: { from: string; to: string }
}) {
  const { params, searchParams } = props
  const [tab, setTab] = useState("0")

  const data = useSelectedComp({
    id: params.id,
    from: searchParams.from,
    to: searchParams.to,
  })

  if (data) {
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {params.id} | from {searchParams.from} to {searchParams.to}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <MinMaxChart
            from={searchParams.from}
            to={searchParams.to}
            data={data}
          />
        </div>

        <Tabs value={tab} className="w-full mt-6 h-auto bg-transparent">
          <Select value={tab} onValueChange={(index) => setTab(`${index}`)}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a Event Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Event Time</SelectLabel>
                {data.map((asset, index) => (
                  <SelectItem value={`${index}`}>{asset.event_time}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {data.map((asset, index) => (
            <TabsContent value={`${index}`}>
              <Card>
                <CardHeader>
                  <div className="grid grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Min Price</CardTitle>
                      </CardHeader>
                      <CardContent>{asset.value_min}</CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Max Price</CardTitle>
                      </CardHeader>
                      <CardContent>{asset.value_max}</CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Average Price</CardTitle>
                      </CardHeader>
                      <CardContent>{asset.value_average}</CardContent>
                    </Card>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div>
                      Cheapest item of the day
                      <Asset asset={asset.value_min_asset} />
                    </div>
                    <div className="">
                      Most expensive item of the day
                      <Asset asset={asset.value_max_asset} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    )
  }
}
