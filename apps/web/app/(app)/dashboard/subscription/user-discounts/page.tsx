"use client"
import { DashboardPage } from "../../_components/dashboard-page"
import { UserDiscountList } from "./_components/user-discount-list"

export default function UserDiscountsPage() {
    return (
        <DashboardPage>
            <UserDiscountList />
        </DashboardPage>
    )
}
