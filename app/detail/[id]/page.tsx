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

  const { data, meta } = useSelectedComp({
    id: params.id,
    from: searchParams.from,
    to: searchParams.to,
  })

  console.log(meta, "meta")

  if (data) {
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{meta.name}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {searchParams.from} ~ {searchParams.to}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8">
          <div className="flex gap-4 items-center ">
            {meta.params.img_url && (
              <div className="capitalize bg-gradient p-4 rounded-lg">
                <img
                  src={meta.params.img_url}
                  className="h-[50px] w-[100px] object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl">{meta.name}</h1>
              <p className="mt-4 text-2l">{meta.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <MinMaxChart
            from={searchParams.from}
            to={searchParams.to}
            data={data}
          />
        </div>

        <Tabs value={tab} className="w-full mt-8 h-auto bg-transparent">
          <div className="flex gap-4 items-center">
            <Select value={tab} onValueChange={(index) => setTab(`${index}`)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a Event Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Event Time</SelectLabel>
                  {data.map((asset, index) => (
                    <SelectItem value={`${index}`}>
                      {asset.event_time}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
                      Min price item of the day
                      <Asset asset={asset.value_min_asset} />
                    </div>
                    <div className="">
                      Max price item of the day
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
