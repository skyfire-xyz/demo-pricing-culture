"use client"

import { useSelectedComp } from "@/lib/pricing-culture/context"

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

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      {JSON.stringify(data)}
    </section>
  )
}
