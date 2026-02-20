import { createInsertSchema } from "drizzle-zod";
import { tblPlan, tblPlanTranslation, tblSubscription, tblSubscriptionEvents, tblCoupons, tblUserDiscounts, tblCampaign, tblCampaignTranslation } from "../../schema";
import { z } from "zod";
import { defaultOmitFieldsSchema } from "../utils";
import { basePaginationQuerySchema } from "../utils";
import { TSchemaSubscription } from "../../schema";

// Base insert zod schemas
const planBaseInsertSchema = createInsertSchema(tblPlan)

const planTranslationBaseInsertSchema = createInsertSchema(tblPlanTranslation);

const subscriptionBaseInsertSchema = createInsertSchema(tblSubscription)

const subscriptionEventsBaseInsertSchema = createInsertSchema(tblSubscriptionEvents)

const couponsBaseInsertSchema = createInsertSchema(tblCoupons)

const userDiscountsBaseInsertSchema = createInsertSchema(tblUserDiscounts)

const campaignBaseInsertSchema = createInsertSchema(tblCampaign)

const campaignTranslationBaseInsertSchema = createInsertSchema(tblCampaignTranslation);

// CRUD schemas with relations

// Plan with translations
const createPlanWithTranslationSchema = z.object({
    planData: planBaseInsertSchema,
    translations: z.array(planTranslationBaseInsertSchema.pick({
        name: true,
        description: true,
        languageId: true,
    })),
})

const updatePlanWithTranslationSchema = z.object({
    id: z.number(),
    data: z.object({
        planData: planBaseInsertSchema.partial(),
        translations: z.array(planTranslationBaseInsertSchema),
    }),
})

// Subscription
const createSubscriptionSchema = z.object({
    subscriptionData: subscriptionBaseInsertSchema,
})

const updateSubscriptionSchema = z.object({
    id: z.number(),
    data: z.object({
        subscriptionData: subscriptionBaseInsertSchema.partial(),
    }),
})

// Subscription Events
const createSubscriptionEventSchema = z.object({
    eventData: subscriptionEventsBaseInsertSchema.omit({
        subscription_id: true,
    }),
})

const updateSubscriptionEventSchema = z.object({
    id: z.number(),
    data: z.object({
        eventData: subscriptionEventsBaseInsertSchema.partial(),
    }),
})

// Coupons
const createCouponSchema = z.object({
    couponData: couponsBaseInsertSchema,
})

const updateCouponSchema = z.object({
    id: z.number(),
    data: z.object({
        couponData: couponsBaseInsertSchema.partial(),
    }),
})

// User Discounts
const createUserDiscountSchema = z.object({
    discountData: userDiscountsBaseInsertSchema.omit({
        user_id: true,
    }),
})

const updateUserDiscountSchema = z.object({
    id: z.number(),
    data: z.object({
        discountData: userDiscountsBaseInsertSchema.partial(),
    }),
})

// Campaign with translations
const createCampaignWithTranslationSchema = z.object({
    campaignData: campaignBaseInsertSchema,
    translations: z.array(campaignTranslationBaseInsertSchema.pick({
        title: true,
        description: true,
        languageId: true,
    })),
})

const updateCampaignWithTranslationSchema = z.object({
    id: z.number(),
    data: z.object({
        campaignData: campaignBaseInsertSchema.partial(),
        translations: z.array(campaignTranslationBaseInsertSchema),
    }),
})

// Query schemas
type TPlanSortKeys = (keyof Pick<TSchemaSubscription.TPlan, 'name' | 'price' | 'createdAt'>)
const planPaginationSortFields = ['name', 'price', 'createdAt'] as TPlanSortKeys[]

const planPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(planPaginationSortFields as [TPlanSortKeys, ...TPlanSortKeys[]]),
    })),
    filter: z.object({
        name: z.string().optional(),
        active: z.boolean().optional(),
    })
})


type TSubscriptionSortKeys = (keyof Pick<TSchemaSubscription.TSubscription, 'status' | 'currentPeriodStart' | 'createdAt'>)
const subscriptionPaginationSortFields = ['status', 'currentPeriodStart', 'createdAt'] as TSubscriptionSortKeys[]

const subscriptionPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(subscriptionPaginationSortFields as [TSubscriptionSortKeys, ...TSubscriptionSortKeys[]]),
    })),
    filter: z.object({
        userId: z.number().optional(),
        planId: z.number().optional(),
        status: z.string().optional(),
    })
})

type TCampaignSortKeys = (keyof Pick<TSchemaSubscription.TCampaign, 'title' | 'createdAt'>)
const campaignPaginationSortFields = ['title', 'createdAt'] as TCampaignSortKeys[]

const campaignPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(campaignPaginationSortFields as [TCampaignSortKeys, ...TCampaignSortKeys[]]),
    })),
    filter: z.object({
        title: z.string().optional(),
        isActive: z.boolean().optional(),
        targetType: z.string().optional(),
    })
})

type TCouponSortKeys = (keyof Pick<TSchemaSubscription.TCoupons, 'code' | 'discount_type' | 'createdAt'>)
const couponPaginationSortFields = ['code', 'discountType', 'createdAt'] as TCouponSortKeys[]

const couponPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(couponPaginationSortFields as [TCouponSortKeys, ...TCouponSortKeys[]]),
    })),
    filter: z.object({
        code: z.string().optional(),
        discountType: z.string().optional(),
    })
})

// Export all validators
export const subscriptionValidator = {
    // Plan validators
    createPlanWithTranslationSchema,
    updatePlanWithTranslationSchema,
    planPaginationQuerySchema,

    // Subscription validators
    createSubscriptionSchema,
    updateSubscriptionSchema,
    subscriptionPaginationQuerySchema,

    // Subscription Event validators
    createSubscriptionEventSchema,
    updateSubscriptionEventSchema,

    // Coupon validators
    createCouponSchema,
    updateCouponSchema,
    couponPaginationQuerySchema,

    // User Discount validators
    createUserDiscountSchema,
    updateUserDiscountSchema,

    // Campaign validators
    createCampaignWithTranslationSchema,
    updateCampaignWithTranslationSchema,
    campaignPaginationQuerySchema,
}

// Type exports
export namespace TSubscriptionValidator {
    // Plan types
    export type TCreatePlanWithTranslation = z.infer<typeof createPlanWithTranslationSchema>
    export type TUpdatePlanWithTranslation = z.infer<typeof updatePlanWithTranslationSchema>
    export type TPlanPaginationQuery = z.infer<typeof planPaginationQuerySchema>
    export type TPlanPaginationQuerySortKeys = TPlanSortKeys

    // Subscription types
    export type TCreateSubscription = z.infer<typeof createSubscriptionSchema>
    export type TUpdateSubscription = z.infer<typeof updateSubscriptionSchema>
    export type TSubscriptionPaginationQuery = z.infer<typeof subscriptionPaginationQuerySchema>
    export type TSubscriptionPaginationQuerySortKeys = TSubscriptionSortKeys

    // Subscription Event types
    export type TCreateSubscriptionEvent = z.infer<typeof createSubscriptionEventSchema>
    export type TUpdateSubscriptionEvent = z.infer<typeof updateSubscriptionEventSchema>

    // Coupon types
    export type TCreateCoupon = z.infer<typeof createCouponSchema>
    export type TUpdateCoupon = z.infer<typeof updateCouponSchema>
    export type TCouponPaginationQuery = z.infer<typeof couponPaginationQuerySchema>
    export type TCouponPaginationQuerySortKeys = TCouponSortKeys

    // User Discount types
    export type TCreateUserDiscount = z.infer<typeof createUserDiscountSchema>
    export type TUpdateUserDiscount = z.infer<typeof updateUserDiscountSchema>

    // Campaign types
    export type TCreateCampaignWithTranslation = z.infer<typeof createCampaignWithTranslationSchema>
    export type TUpdateCampaignWithTranslation = z.infer<typeof updateCampaignWithTranslationSchema>
    export type TCampaignPaginationQuery = z.infer<typeof campaignPaginationQuerySchema>
    export type TCampaignPaginationQuerySortKeys = TCampaignSortKeys
}
