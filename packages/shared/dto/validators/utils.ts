import { z } from "zod";

export const defaultOmitFieldsSchema = {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    id: true,
} as const


const basePaginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(10),
})


export const basePaginationQuerySchema = z.object({
    pagination: basePaginationSchema,
    global_search: z.string().optional(),
    // filter: z.object({}).optional(),
    // sort: z.array(z.object({
    //     sortBy: z.enum(['asc', 'desc']),
    //     sortField: z.any(),
    // })).optional(),

})


export const baseInfiniteQuerySchema = z.object({
    limit: z.number().int().min(1).max(100).nullish(),
    cursor: z.number().nullish(),
    direction: z.enum(['forward', 'backward']).optional(),
    global_search: z.string().optional()
})


export const BaseValidators = {
    basePaginationQuerySchema,
    baseInfiniteQuerySchema
}



export namespace TBaseValidators {
    export type TBasePaginationQuery = z.infer<typeof basePaginationQuerySchema>
    export type TBaseInfiniteQuery = z.infer<typeof baseInfiniteQuerySchema>



    export type TPagination<T> = {
        data: T[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number

        }
    }
}