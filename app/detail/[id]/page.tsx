"use client"

import { useSelectedComp } from "@/lib/pricing-culture/context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Asset from "./components/asset"
import Chart from "./components/chart"

export default function DetailPage(props: {
  params: { id: string }
  searchParams: { from: string; to: string }
}) {
  const { params, searchParams } = props
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
        <Tabs defaultValue="0" className="w-full mt-6 h-auto bg-transparent">
          <div>Event Time</div>
          <TabsList className="flex flex-wrap p-0 bg-transparent m-0 h-auto">
            <div className="bg-secondary p-2 rounded-md mx-1">
              {data.map((asset, index) => (
                <TabsTrigger value={`${index}`}>{asset.event_time}</TabsTrigger>
              ))}
            </div>
          </TabsList>
          {data.map((asset, index) => (
            <TabsContent value={`${index}`}>
              <div className="mt-8">
                <div>
                  Price Chart
                  <Chart
                    prices={asset.prices}
                    max={asset.value_max}
                    min={asset.value_min}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="">
                    Max Asset
                    <Asset asset={asset.value_max_asset} />
                  </div>
                  <div>
                    Min Asset
                    <Asset asset={asset.value_min_asset} />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    )
  }
}
