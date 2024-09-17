"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useSelectedComp } from "@/lib/pricing-culture/context"
import { formatDateWithoutTime } from "@/lib/utils"
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
  const router = useRouter()
  const [tab, setTab] = useState("0")

  const { data, meta } = useSelectedComp({
    id: params.id,
    from: searchParams.from,
    to: searchParams.to,
  })

  if (data) {
    return (
      <section className="container grid items-center gap-2 md:gap-6 pb-8 pt-6 md:py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => {
                  router.push("/")
                }}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{meta?.name}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {searchParams.from} ~ {searchParams.to}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8">
          <div className="flex gap-4 items-center ">
            {meta?.params.img_url && (
              <div className="capitalize bg-gradient p-4 rounded-lg">
                <img
                  src={meta.params.img_url}
                  className="h-[50px] w-[100px] object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl">{meta?.name}</h1>
              <p className="mt-4 text-2l">{meta?.description}</p>
            </div>
          </div>
        </div>
        {data.length > 1 && (
          <div className="mt-4">
            <MinMaxChart
              from={searchParams.from}
              to={searchParams.to}
              data={data}
            />
          </div>
        )}

        <Tabs value={tab} className="w-full mt-8 h-auto bg-transparent">
          <div className="flex gap-4 items-center">
            <Select value={tab} onValueChange={(index) => setTab(`${index}`)}>
              <SelectTrigger className="md:w-[300px]">
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
                <CardContent>
                  <CardTitle className="mt-6">
                    Market data on {formatDateWithoutTime(asset.event_time)}
                  </CardTitle>
                  <Chart
                    numItems={asset.number_of_constituents}
                    prices={asset.prices}
                    max={asset.value_max}
                    min={asset.value_min}
                  />
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-full">
                      <p className="font-bold mb-1">
                        Min price item of the day
                      </p>
                      <Asset
                        asset={asset.value_min_asset}
                        price={asset.value_min}
                      />
                    </div>
                    <div className="h-full">
                      <p className="font-bold mb-1">Max Price Of The Day</p>
                      <Asset
                        asset={asset.value_max_asset}
                        price={asset.value_max}
                      />
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
