"use client"

import { TSubscriptionValidator } from "@repo/shared/validators"
import { useState } from "react"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { TSchemaSubscription } from "@repo/shared/schema"
import { useQuery } from "@tanstack/react-query"
import CampaignCrudModal from "./campaign-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Megaphone } from "lucide-react"
import { GlobalModalManager } from "@/components/global/modal/global-confirm-moda"

export const CampaignList = () => {
    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TCampaignPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
        },
        sort: [{
            sortBy: 'desc',
            sortField: 'createdAt'
        }],
        filter: {},
    })

    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.subscription.getCampaignsWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    const handleEdit = (campaign: TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect) => {
        setSelectedCampaign(campaign)
        setIsOpen(true)
    }

    const handleDelete = (campaign: TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect) => {
        GlobalModalManager.show({
            type: 'danger',
            text1: 'Delete Campaign',
            text2: `Are you sure you want to delete "${campaign.title}"? This action cannot be undone.`,
            onClickPrimaryButton: async () => {
                await trpc.subscription.deleteCampaign.mutate({ id: campaign.id })
            }
        })
    }

    const handleCreate = () => {
        setSelectedCampaign(undefined)
        setIsOpen(true)
    }

    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
                        <p className="text-sm text-muted-foreground">Manage discount campaigns</p>
                    </div>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Campaign
                </Button>
            </div>

            {isOpen && (
                <CampaignCrudModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    initial={selectedCampaign}
                />
            )}

            <div className="rounded-lg border bg-card min-h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Discount Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Target Type</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                    No campaigns found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{campaign.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{campaign.discount_type}</TableCell>
                                    <TableCell className="text-muted-foreground">{campaign.value}</TableCell>
                                    <TableCell className="text-muted-foreground">{campaign.target_type}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(campaign.start_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(campaign.end_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={campaign.is_active ? 'default' : 'secondary'}>
                                            {campaign.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(campaign)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(campaign)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="mt-4">
                    <CustomPagination
                        paginationData={pagination}
                        pagination={query}
                        setPagination={(p) => setQuery({ ...query, pagination: p.pagination })}
                    />
                </div>
            )}
        </div>
    )
}
