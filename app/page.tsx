import { InterviewTable } from "./interview-table"
import { ReportTable } from "./reports-table"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <InterviewTable />
      <ReportTable />
    </section>
  )
}
