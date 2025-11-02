import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json"
import { DashboardPage } from "./_components/dashboard-page";

export default function Page() {
  return (
    <DashboardPage className="flex flex-col gap-4">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </DashboardPage>

  )
}
