import { TEnumCampaignTargetType, TEnumCurrenyKey, TEnumDiscountType, TEnumDurationKey, TEnumPlanIntervalKey, TEnumSubscriptionEventType, TSubscriptionStatus } from '#/enums/index';
import { relations } from 'drizzle-orm';
import { boolean, foreignKey, integer, jsonb, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { tblLanguage } from './data';
import { mockDb, ReturnTypeOfQuery } from './type';
import { tblUser, TSchemaUser } from './user';
import { getDefaultTableFieldsWithDeletedAt } from './schemaHelpers';


export const tblPlan = pgTable('plan', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    price: integer().notNull(),
    currency: varchar({ length: 255 }).notNull().$type<TEnumCurrenyKey>(),
    interval: varchar({ length: 255 }).notNull().$type<TEnumPlanIntervalKey>(),
    intervalCount: integer().notNull(),
    trialPeriodDays: integer().notNull(),
    active: boolean().notNull(),

    ...getDefaultTableFieldsWithDeletedAt()

})

export const tblPlanRelation = relations(tblPlan, ({ many }) => ({
    translations: many(tblPlanTranslation),
    subscriptions: many(tblSubscription),
    campaigns: many(tblCampaign),
}))

export const tblPlanTranslation = pgTable('plan_translation', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    planId: integer().notNull(),
    languageId: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    ...getDefaultTableFieldsWithDeletedAt()

}, (table) => ({
    unique_plan_language: uniqueIndex('unique_plan_language').on(table.planId, table.languageId),
    fkPlanTranslationPlan: foreignKey({
        columns: [table.planId],
        foreignColumns: [tblPlan.id],
        name: 'fk_plan_translation_plan',
    }).onDelete('cascade'),
    fkPlanTranslationLanguage: foreignKey({
        columns: [table.languageId],
        foreignColumns: [tblLanguage.id],
        name: 'fk_plan_translation_language',
    }),
}))

export const tblPlanTranslationRelation = relations(tblPlanTranslation, ({ one }) => ({
    plan: one(tblPlan, {
        fields: [tblPlanTranslation.planId],
        references: [tblPlan.id],
    }),
    language: one(tblLanguage, {
        fields: [tblPlanTranslation.languageId],
        references: [tblLanguage.id],
    }),
}))

export const tblSubscription = pgTable('subscription', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: integer().notNull().references(() => tblUser.id),
    planId: integer().notNull().references(() => tblPlan.id),
    status: varchar({ length: 255 }).notNull().$type<TSubscriptionStatus>(),
    currentPeriodStart: timestamp().notNull(),
    currentPeriodEnd: timestamp().notNull(),
    cancelAtPeriodEnd: boolean().notNull(),
    receiptData: jsonb().$type<{}>(),
    ...getDefaultTableFieldsWithDeletedAt()

})

export const tblSubscriptionRelation = relations(tblSubscription, ({ one, many }) => ({
    user: one(tblUser, {
        fields: [tblSubscription.userId],
        references: [tblUser.id],
    }),
    plan: one(tblPlan, {
        fields: [tblSubscription.planId],
        references: [tblPlan.id],
    }),
    events: many(tblSubscriptionEvents),
}))


export const tblSubscriptionEvents = pgTable('subscription_events', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    subscription_id: integer().notNull().references(() => tblSubscription.id),
    event_type: varchar({ length: 255 }).notNull().$type<TEnumSubscriptionEventType>(),
    created_at: timestamp().notNull().defaultNow(),
    ...getDefaultTableFieldsWithDeletedAt()

})

export const tblSubscriptionEventsRelation = relations(tblSubscriptionEvents, ({ one }) => ({
    subscription: one(tblSubscription, {
        fields: [tblSubscriptionEvents.subscription_id],
        references: [tblSubscription.id],
    }),
}))



export const tblCoupons = pgTable('coupons', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    code: varchar({ length: 255 }).notNull(),
    discount_type: varchar({ length: 255 }).notNull().$type<TEnumDiscountType>(),
    value: integer().notNull(),
    duration: varchar({ length: 255 }).notNull().$type<TEnumDurationKey>(),
    duration_in_months: integer(),
    store_offer_id: varchar({ length: 255 }),
    ...getDefaultTableFieldsWithDeletedAt()

})

export const tblCouponsRelation = relations(tblCoupons, ({ many }) => ({
    userDiscounts: many(tblUserDiscounts),
}))


export const tblUserDiscounts = pgTable('user_discounts', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    user_id: integer().notNull().references(() => tblUser.id),
    coupon_id: integer().notNull().references(() => tblCoupons.id),
    applied_at: timestamp().notNull().defaultNow(),
    is_active: boolean().notNull().default(true),
    ...getDefaultTableFieldsWithDeletedAt()

})

export const tblUserDiscountsRelation = relations(tblUserDiscounts, ({ one }) => ({
    user: one(tblUser, {
        fields: [tblUserDiscounts.user_id],
        references: [tblUser.id],
    }),
    coupon: one(tblCoupons, {
        fields: [tblUserDiscounts.coupon_id],
        references: [tblCoupons.id],
    }),
}))

export const tblCampaign = pgTable('campaign', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    discount_type: varchar({ length: 255 }).notNull().$type<TEnumDiscountType>(),
    value: integer().notNull(),
    target_type: varchar({ length: 255 }).notNull().$type<TEnumCampaignTargetType>(),
    start_date: timestamp().notNull(),
    end_date: timestamp().notNull(),
    is_active: boolean().notNull().default(true),
    plan_id: integer().references(() => tblPlan.id),
    ...getDefaultTableFieldsWithDeletedAt()

})

export const tblCampaignRelation = relations(tblCampaign, ({ one, many }) => ({
    plan: one(tblPlan, {
        fields: [tblCampaign.plan_id],
        references: [tblPlan.id],
    }),
    translations: many(tblCampaignTranslation),
}))

export const tblCampaignTranslation = pgTable('campaign_translation', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    campaignId: integer().notNull(),
    languageId: integer().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    ...getDefaultTableFieldsWithDeletedAt()

}, (table) => ({
    unique_campaign_language: uniqueIndex('unique_campaign_language').on(table.campaignId, table.languageId),
    fkCampaignTranslationCampaign: foreignKey({
        columns: [table.campaignId],
        foreignColumns: [tblCampaign.id],
        name: 'fk_campaign_translation_campaign',
    }).onDelete('cascade'),
    fkCampaignTranslationLanguage: foreignKey({
        columns: [table.languageId],
        foreignColumns: [tblLanguage.id],
        name: 'fk_campaign_translation_language',
    }),
}))

export const tblCampaignTranslationRelation = relations(tblCampaignTranslation, ({ one }) => ({
    campaign: one(tblCampaign, {
        fields: [tblCampaignTranslation.campaignId],
        references: [tblCampaign.id],
    }),
    language: one(tblLanguage, {
        fields: [tblCampaignTranslation.languageId],
        references: [tblLanguage.id],
    }),
}))



//predefined
export const tblSubscriptionStatus = pgTable('subscription_status', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull().$type<TSubscriptionStatus>(),
})



export namespace TSchemaSubscription {
    export type TPlan = typeof tblPlan.$inferSelect
    export type TPlanInsert = typeof tblPlan.$inferInsert

    export type TPlanTranslation = typeof tblPlanTranslation.$inferSelect
    export type TPlanTranslationInsert = typeof tblPlanTranslation.$inferInsert


    export type TPlanWithRelation = TPlan & {
        translations: TPlanTranslation[]
    }

    export type TSubscription = typeof tblSubscription.$inferSelect
    export type TSubscriptionInsert = typeof tblSubscription.$inferInsert

    export type TSubscriptionWithRelation = TSubscription & {
        plan: TPlan
        user: TSchemaUser.TTblUserSelect
        status: TSubscriptionStatus
    }

    export type TSubscriptionEvents = typeof tblSubscriptionEvents.$inferSelect
    export type TSubscriptionEventsInsert = typeof tblSubscriptionEvents.$inferInsert

    export type TCoupons = typeof tblCoupons.$inferSelect
    export type TCouponsInsert = typeof tblCoupons.$inferInsert

    export type TUserDiscounts = typeof tblUserDiscounts.$inferSelect
    export type TUserDiscountsInsert = typeof tblUserDiscounts.$inferInsert

    export type TCampaign = typeof tblCampaign.$inferSelect
    export type TCampaignInsert = typeof tblCampaign.$inferInsert

    export type TCampaignWithRelation = TCampaign & {
        translations: TCampaignTranslation[]
        plan: TPlan
    }

    export type TCampaignTranslation = typeof tblCampaignTranslation.$inferSelect
    export type TCampaignTranslationInsert = typeof tblCampaignTranslation.$inferInsert


    export namespace TSubscriptionRepository {
        // Create/Update types for Plan with translations
        export type TCreatePlanWithTranslation = {
            planData: TPlanInsert
            translations: Omit<TPlanTranslationInsert, 'planId'>[]
        }

        export type TUpdatePlanWithTranslation = {
            id: number
            data: {
                planData: Partial<TPlanInsert>
                translations: TPlanTranslationInsert[]
            }
        }

        // Create/Update types for Campaign with translations
        export type TCreateCampaignWithTranslation = {
            campaignData: TCampaignInsert
            translations: Omit<TCampaignTranslationInsert, 'campaignId'>[]
        }

        export type TUpdateCampaignWithTranslation = {
            id: number
            data: {
                campaignData: Partial<TCampaignInsert>
                translations: TCampaignTranslationInsert[]
            }
        }

        // Create/Update types for Subscription
        export type TCreateSubscription = TSubscriptionInsert
        export type TUpdateSubscription = {
            id: number
            data: Partial<TSubscriptionInsert>
        }

        // Create/Update types for Subscription Events
        export type TCreateSubscriptionEvent = Omit<TSubscriptionEventsInsert, 'subscription_id'>
        export type TUpdateSubscriptionEvent = {
            id: number
            data: Partial<TSubscriptionEventsInsert>
        }

        // Create/Update types for Coupon
        export type TCreateCoupon = TCouponsInsert
        export type TUpdateCoupon = {
            id: number
            data: Partial<TCouponsInsert>
        }

        // Create/Update types for UserDiscount
        export type TCreateUserDiscount = Omit<TUserDiscountsInsert, 'user_id'>
        export type TUpdateUserDiscount = {
            id: number
            data: Partial<TUserDiscountsInsert>
        }

        // Select types with relations for repository functions
        export type TPlanWithRelationSelect = ReturnTypeOfQuery<typeof getPlanWithRelation>
        export type TSubscriptionWithRelationSelect = ReturnTypeOfQuery<typeof getSubscriptionWithRelation>
        export type TCampaignWithRelationSelect = ReturnTypeOfQuery<typeof getCampaignWithRelation>
        export type TCouponWithRelationSelect = ReturnTypeOfQuery<typeof getCouponWithRelation>
        export type TUserDiscountWithRelationSelect = ReturnTypeOfQuery<typeof getUserDiscountWithRelation>
    }


}


// Query functions for type inference
function getPlanWithRelation() {
    return mockDb.query.tblPlan.findFirst({
        with: {
            translations: true
        }
    })
}

function getSubscriptionWithRelation() {
    return mockDb.query.tblSubscription.findFirst({
        with: {
            plan: {
                with: {
                    translations: true
                }
            },
            user: true,
            events: true
        }
    })
}

function getCampaignWithRelation() {
    return mockDb.query.tblCampaign.findFirst({
        with: {
            translations: true,
            plan: {
                with: {
                    translations: true
                }
            }
        }
    })
}

function getCouponWithRelation() {
    return mockDb.query.tblCoupons.findFirst({
        with: {
            userDiscounts: {
                with: {
                    user: true
                }
            }
        }
    })
}

function getUserDiscountWithRelation() {
    return mockDb.query.tblUserDiscounts.findFirst({
        with: {
            user: true,
            coupon: true
        }
    })
}





