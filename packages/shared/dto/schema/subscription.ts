import { TEnumCampaignTargetType, TEnumCurrenyKey, TEnumDiscountType, TEnumDurationKey, TEnumPlanIntervalKey, TEnumSubscriptionEventType, TSubscriptionStatus } from '#/enums/index';
import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tblLanguage } from './data';
import { tblUser, TSchemaUser } from './user';


export const tblPlan = pgTable('plan', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    price: integer().notNull(),
    currency: varchar({ length: 255 }).notNull().$type<TEnumCurrenyKey>(),
    interval: varchar({ length: 255 }).notNull().$type<TEnumPlanIntervalKey>(),
    intervalCount: integer().notNull(),
    trialPeriodDays: integer().notNull(),
    active: boolean().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
})

export const tblPlanRelation = relations(tblPlan, ({ many }) => ({
    translations: many(tblPlanTranslation),
    subscriptions: many(tblSubscription),
    campaigns: many(tblCampaign),
}))

export const tblPlanTranslation = pgTable('plan_translation', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    planId: integer().notNull().references(() => tblPlan.id),
    languageId: integer().notNull().references(() => tblLanguage.id),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
})

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
    receiptData: jsonb().$type(),
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
    campaign_id: integer().notNull().references(() => tblCampaign.id),
    language_id: integer().notNull().references(() => tblLanguage.id),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
})

export const tblCampaignTranslationRelation = relations(tblCampaignTranslation, ({ one }) => ({
    campaign: one(tblCampaign, {
        fields: [tblCampaignTranslation.campaign_id],
        references: [tblCampaign.id],
    }),
    language: one(tblLanguage, {
        fields: [tblCampaignTranslation.language_id],
        references: [tblLanguage.id],
    }),
}))



//predefined
export const tblSubscriptionStatus = pgTable('subscription_status', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull().$type<TSubscriptionStatus>(),
})



export namespace TSchemaPlan {
    export type TPlan = typeof tblPlan.$inferSelect
    export type TPlanInsert = typeof tblPlan.$inferInsert

    export type TPlanTranslation = typeof tblPlanTranslation.$inferSelect
    export type TPlanTranslationInsert = typeof tblPlanTranslation.$inferInsert

    export type TSubscription = typeof tblSubscription.$inferSelect
    export type TSubscriptionInsert = typeof tblSubscription.$inferInsert

    export type TSubscriptionWithRelation = TSubscription & {
        plan: TPlan
        user: TSchemaUser.TTblUserSelect
    }

    export type TSubscriptionEvents = typeof tblSubscriptionEvents.$inferSelect
    export type TSubscriptionEventsInsert = typeof tblSubscriptionEvents.$inferInsert

    export type TCoupons = typeof tblCoupons.$inferSelect
    export type TCouponsInsert = typeof tblCoupons.$inferInsert

    export type TUserDiscounts = typeof tblUserDiscounts.$inferSelect
    export type TUserDiscountsInsert = typeof tblUserDiscounts.$inferInsert

    export type Tcampaign = typeof tblCampaign.$inferSelect
    export type TcampaignInsert = typeof tblCampaign.$inferInsert


    export type TcampaignTranslation = typeof tblCampaignTranslation.$inferSelect
    export type TcampaignTranslationInsert = typeof tblCampaignTranslation.$inferInsert




}





