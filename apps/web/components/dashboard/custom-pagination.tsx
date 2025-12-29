import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
// import { rowsPerPageToSelectOptions } from '@/lib/constants'
// import { TBase } from '@repo/shared/validators'
import { cn } from '@/lib/utils'
import { TBaseValidators } from '@repo/shared/dto/validators/utils'
import { CustomComboSelect } from '../custom-ui/custom-combo-select'

type Props = {
    paginationData: TBaseValidators.TPagination<any>['pagination']
    pagination: TBaseValidators.TBasePaginationQuery
    setPagination: (p: TBaseValidators.TBasePaginationQuery) => void
    className?: string
}

export const CustomPagination = ({
    paginationData,
    pagination,
    setPagination,  
    className
}: Props) => {




    return (
        <div className={cn('flex justify-center items-center', className)}>
            <Pagination>
                <PaginationContent>
                    {paginationData.page > 3 && <PaginationItem>
                        <PaginationLink className='cursor-pointer'
                            onClick={() => setPagination({ ...pagination, pagination: { ...pagination.pagination, page: 1 } })}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>}

                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPagination({ ...pagination, pagination: { ...pagination.pagination, page: Math.max(pagination.pagination.page - 1, 1) } })}
                        />
                    </PaginationItem>
                    {Array.from({ length: Math.min(3, paginationData.totalPages || 1) }).map((_, index) => {
                        const pageNumber = pagination.pagination.page + index;
                        if (pageNumber > paginationData.totalPages) return null;
                        return (
                            <PaginationItem
                                key={pageNumber}
                                onClick={() => setPagination({ ...pagination, pagination: { ...pagination.pagination, page: pageNumber } })}
                            >
                                <PaginationLink className='cursor-pointer' isActive={pageNumber === pagination.pagination.page}>
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPagination({ ...pagination, pagination: { ...pagination.pagination, page: Math.min(pagination.pagination.page + 1, paginationData.totalPages || 1) } })}
                        />
                    </PaginationItem>
                    {paginationData.totalPages > 3 && <PaginationItem>
                        <PaginationLink className='cursor-pointer'
                            onClick={() => setPagination({ ...pagination, pagination: { ...pagination.pagination, page: paginationData.totalPages } })}
                        >
                            {paginationData.totalPages}
                        </PaginationLink>
                    </PaginationItem>}
                </PaginationContent>

            </Pagination>

            <CustomComboSelect
                buttonClass='h-8 w-[70px]'
                data={[{
                    value: '10',
                    label: '10',
                }, {
                    value: '20',
                    label: '20',
                }, {
                    value: '30',
                    label: '30',
                }]}
                labelValueRender={(option) => option.label}
                value={paginationData.limit.toString()}
                onValueChange={(value) => {
                    setPagination({ ...pagination, pagination: { ...pagination.pagination, limit: Number(value) } })
                }}
            />

        </div>
    )
}