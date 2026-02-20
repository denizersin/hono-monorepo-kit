"use client"
import { DashboardPage } from "../../_components/dashboard-page"
import { CampaignList } from "./_components/campaign-list"

export default function CampaignsPage() {
    return (
        <DashboardPage>
            <CampaignList />
        </DashboardPage>
    )
}
