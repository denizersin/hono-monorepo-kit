import { db } from "@repo/db";
import {
    tblPlan,
    tblPlanTranslation,
    tblSubscription,
    tblSubscriptionEvents,
    tblCoupons,
    tblUserDiscounts,
    tblCampaign,
    tblCampaignTranslation,
    TSchemaSubscription,
} from "@repo/shared/schema";
import { TBaseValidators, TSubscriptionValidator } from "@repo/shared/validators";
import { and, asc, countDistinct, desc, eq, isNull, like, SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export class SubscriptionRepositoryImpl {
    // ============== PLAN METHODS ==============

    async getPlanById(id: number): Promise<TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect | undefined> {
        const plan = await db.query.tblPlan.findFirst({
            where: and(eq(tblPlan.id, id), isNull(tblPlan.deletedAt)),
            with: {
                translations: true
            }
        });
        return plan;
    }


    async getAllPlans(): Promise<TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect[]> {
        const plans = await db.query.tblPlan.findMany({
            where: isNull(tblPlan.deletedAt),
            with: {
                translations: true
            }
        });
        return plans;
    }

    async getAllPlansForSelect(): Promise<Array<{ id: number; name: string }>> {
        const plans = await db.query.tblPlan.findMany({
            where: isNull(tblPlan.deletedAt),
            columns: {
                id: true,
                name: true,
            }
        });
        return plans;
    }

    async createPlan(plan: TSchemaSubscription.TPlanInsert): Promise<void> {
        await db.insert(tblPlan).values(plan);
        return;
    }

    async updatePlan(id: number, plan: Partial<TSchemaSubscription.TPlanInsert>): Promise<void> {
        await db.update(tblPlan)
            .set(plan)
            .where(eq(tblPlan.id, id));
    }

    async deletePlan(id: number): Promise<void> {
        await db.update(tblPlan)
            .set({ deletedAt: new Date() })
            .where(eq(tblPlan.id, id));
    }

    /**
     * Create a new plan with its translations
     */
    async createPlanWithTranslation({ planData, translations }: TSchemaSubscription.TSubscriptionRepository.TCreatePlanWithTranslation): Promise<number> {
        const [newPlan] = await db.insert(tblPlan).values(planData).returning();

        if (!newPlan) {
            throw new Error("Plan not created");
        }

        const planId = newPlan.id;

        if (translations && translations.length > 0) {
            const translationRecords = translations.map((t) => ({ planId, ...t }));
            await db.insert(tblPlanTranslation).values(translationRecords);
        }

        return planId;
    }

    /**
     * Update plan data together with its translations
     */
    async updatePlanWithTranslation({ id, data }: TSchemaSubscription.TSubscriptionRepository.TUpdatePlanWithTranslation): Promise<void> {
        const { planData, translations } = data;

        // Update plan base data
        if (planData && Object.keys(planData).length > 0) {
            await db.update(tblPlan).set(planData).where(eq(tblPlan.id, id));
        }

        // Update translations if provided
        if (translations && translations.length > 0) {
            for (const tr of translations) {
                if (!tr.id) continue;
                await db.update(tblPlanTranslation).set(tr).where(eq(tblPlanTranslation.id, tr.id));
            }
        }
    }


    async getPlansWithPagination(input: TSubscriptionValidator.TPlanPaginationQuery):
        Promise<TBaseValidators.TPagination<TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect>> {
        const { pagination, sort, global_search, filter } = input;

        const andConditions: SQL<unknown>[] = [];

        if (filter.name) {
            andConditions.push(like(tblPlan.name, `%${filter.name}%`));
        }

        if (filter.active !== undefined) {
            andConditions.push(eq(tblPlan.active, filter.active));
        }

        if (global_search) {
            andConditions.push(like(tblPlan.name, `%${global_search}%`));
        }

        const whereCondition: SQL<unknown> | undefined = and(
            isNull(tblPlan.deletedAt),
            isNull(tblPlanTranslation.deletedAt),
            and(...andConditions)
        );

        const calculatedOrderBys: SQL<unknown>[] = [];
        const sortMapper = {
            'asc': asc,
            'desc': desc
        };
        const columnMapper: Record<TSubscriptionValidator.TPlanPaginationQuerySortKeys, PgColumn> = {
            'name': tblPlan.name,
            'price': tblPlan.price,
            'createdAt': tblPlan.createdAt,
        };

        sort.forEach(s => {
            calculatedOrderBys.push(sortMapper[s.sortBy](columnMapper[s.sortField]));
        });

        const plans = await db.query.tblPlan.findMany({
            with: {
                translations: true
            },
            limit: pagination.limit,
            where: whereCondition,
            offset: (pagination.page - 1) * pagination.limit,
            orderBy: calculatedOrderBys,
        });

        const total = await db
            .select({ count: countDistinct(tblPlan.id) })
            .from(tblPlan)
            .leftJoin(tblPlanTranslation, eq(tblPlan.id, tblPlanTranslation.planId))
            .where(whereCondition);

        const totalCount = total?.[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return {
            data: plans,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: totalCount,
                totalPages: totalPages
            }
        };
    }

    // ============== SUBSCRIPTION METHODS ==============

    async getSubscriptionById(id: number): Promise<TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect | undefined> {
        const subscription = await db.query.tblSubscription.findFirst({
            where: and(eq(tblSubscription.id, id), isNull(tblSubscription.deletedAt)),
            with: {
                plan: {
                    with: {
                        translations: true
                    }
                },
                user: true,
                events: true,
                status: true
            }
        });
        return subscription;
    }

    async getAllSubscriptions(): Promise<TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect[]> {
        const subscriptions = await db.query.tblSubscription.findMany({
            with: {
                plan: {
                    with: {
                        translations: true
                    }
                },
                user: true,
                events: true,
                status: true
            },
            where: isNull(tblSubscription.deletedAt),
        });
        return subscriptions;
    }

    async createSubscription(subscription: TSchemaSubscription.TSubscriptionInsert): Promise<void> {
        console.log(subscription, 'qwe');
        await db.insert(tblSubscription).values(subscription);
        return;
    }

    async updateSubscription(id: number, subscription: Partial<TSchemaSubscription.TSubscriptionInsert>): Promise<void> {
        await db.update(tblSubscription)
            .set(subscription)
            .where(eq(tblSubscription.id, id));
    }

    async deleteSubscription(id: number): Promise<void> {
        await db.update(tblSubscription)
            .set({ deletedAt: new Date() })
            .where(eq(tblSubscription.id, id));
    }

    async getSubscriptionsWithPagination(input: TSubscriptionValidator.TSubscriptionPaginationQuery):
        Promise<TBaseValidators.TPagination<TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect>> {
        const { pagination, sort, global_search, filter } = input;

        const andConditions: SQL<unknown>[] = [];

        if (filter.userId) {
            andConditions.push(eq(tblSubscription.userId, filter.userId));
        }

        if (filter.planId) {
            andConditions.push(eq(tblSubscription.planId, filter.planId));
        }

        if (filter.statusId) {
            andConditions.push(eq(tblSubscription.statusId, filter.statusId));
        }

        if (global_search) {
            // andConditions.push(like(tblSubscription.status, `%${global_search}%`));
        }

        const whereCondition: SQL<unknown> | undefined = and(
            isNull(tblSubscription.deletedAt),
            and(...andConditions)
        );

        const calculatedOrderBys: SQL<unknown>[] = [];
        const sortMapper = {
            'asc': asc,
            'desc': desc
        };
        const columnMapper: Record<TSubscriptionValidator.TSubscriptionPaginationQuerySortKeys, PgColumn> = {
            'currentPeriodStart': tblSubscription.currentPeriodStart,
            'createdAt': tblSubscription.createdAt,
        };

        sort.forEach(s => {
            calculatedOrderBys.push(sortMapper[s.sortBy](columnMapper[s.sortField]));
        });

        const subscriptions = await db.query.tblSubscription.findMany({
            with: {
                plan: {
                    with: {
                        translations: true
                    }
                },
                user: true,
                events: true,
                status: true
            },
            limit: pagination.limit,
            where: whereCondition,
            offset: (pagination.page - 1) * pagination.limit,
            orderBy: calculatedOrderBys,
        });

        const total = await db
            .select({ count: countDistinct(tblSubscription.id) })
            .from(tblSubscription)
            .where(whereCondition);

        const totalCount = total?.[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return {
            data: subscriptions,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: totalCount,
                totalPages: totalPages
            }
        };
    }

    // ============== SUBSCRIPTION EVENTS METHODS ==============

    async getSubscriptionEventById(id: number): Promise<TSchemaSubscription.TSubscriptionEvents | undefined> {
        const event = await db.query.tblSubscriptionEvents.findFirst({
            where: and(eq(tblSubscriptionEvents.id, id), isNull(tblSubscriptionEvents.deletedAt))
        });
        return event;
    }

    async getAllSubscriptionEventsBySubscriptionId(subscriptionId: number): Promise<TSchemaSubscription.TSubscriptionEvents[]> {
        const events = await db.query.tblSubscriptionEvents.findMany({
            where: and(eq(tblSubscriptionEvents.subscription_id, subscriptionId), isNull(tblSubscriptionEvents.deletedAt)),
            orderBy: [desc(tblSubscriptionEvents.created_at)]
        });
        return events;
    }

    async createSubscriptionEvent(subscriptionId: number, eventData: Omit<TSchemaSubscription.TSubscriptionEventsInsert, 'subscription_id'>): Promise<number> {
        const [newEvent] = await db.insert(tblSubscriptionEvents)
            .values({ subscription_id: subscriptionId, ...eventData })
            .returning();

        if (!newEvent) {
            throw new Error("Subscription event not created");
        }

        return newEvent.id;
    }

    async updateSubscriptionEvent(id: number, eventData: Partial<TSchemaSubscription.TSubscriptionEventsInsert>): Promise<void> {
        await db.update(tblSubscriptionEvents)
            .set(eventData)
            .where(eq(tblSubscriptionEvents.id, id));
    }

    async deleteSubscriptionEvent(id: number): Promise<void> {
        await db.update(tblSubscriptionEvents)
            .set({ deletedAt: new Date() })
            .where(eq(tblSubscriptionEvents.id, id));
    }

    // ============== COUPON METHODS ==============

    async getCouponById(id: number): Promise<TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect | undefined> {
        const coupon = await db.query.tblCoupons.findFirst({
            where: (and(eq(tblCoupons.id, id), isNull(tblCoupons.deletedAt))),
            with: {
                userDiscounts: {
                    with: {
                        user: true
                    }
                }
            }
        });
        return coupon;
    }

    async getCouponByCode(code: string): Promise<TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect | undefined> {
        const coupon = await db.query.tblCoupons.findFirst({
            where: (and(eq(tblCoupons.code, code), isNull(tblCoupons.deletedAt))),
            with: {
                userDiscounts: {
                    with: {
                        user: true
                    }
                }
            }
        });
        return coupon;
    }

    async getAllCoupons(): Promise<TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect[]> {
        const coupons = await db.query.tblCoupons.findMany({
            where: isNull(tblCoupons.deletedAt),
            with: {
                userDiscounts: {
                    with: {
                        user: true
                    }
                }
            }
        });
        return coupons;
    }

    async createCoupon(coupon: TSchemaSubscription.TCouponsInsert): Promise<void> {
        await db.insert(tblCoupons).values(coupon);
        return;
    }

    async updateCoupon(id: number, coupon: Partial<TSchemaSubscription.TCouponsInsert>): Promise<void> {
        await db.update(tblCoupons)
            .set(coupon)
            .where(eq(tblCoupons.id, id));
    }

    async deleteCoupon(id: number): Promise<void> {
        await db.update(tblCoupons)
            .set({ deletedAt: new Date() })
            .where(eq(tblCoupons.id, id));
    }

    async getCouponsWithPagination(input: TSubscriptionValidator.TCouponPaginationQuery):
        Promise<TBaseValidators.TPagination<TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect>> {
        const { pagination, sort, global_search, filter } = input;

        const andConditions: SQL<unknown>[] = [];

        if (filter.code) {
            andConditions.push(like(tblCoupons.code, `%${filter.code}%`));
        }

        if (filter.discountType) {
            andConditions.push(eq(tblCoupons.discount_type, filter.discountType as any));
        }

        if (global_search) {
            andConditions.push(like(tblCoupons.code, `%${global_search}%`));
        }

        const whereCondition: SQL<unknown> | undefined = and(
            isNull(tblCoupons.deletedAt),
            and(...andConditions)
        );

        const calculatedOrderBys: SQL<unknown>[] = [];
        const sortMapper = {
            'asc': asc,
            'desc': desc
        };
        const columnMapper: Record<TSubscriptionValidator.TCouponPaginationQuerySortKeys, PgColumn> = {
            'code': tblCoupons.code,
            'discount_type': tblCoupons.discount_type,
            'createdAt': tblCoupons.createdAt,
        };

        sort.forEach(s => {
            calculatedOrderBys.push(sortMapper[s.sortBy](columnMapper[s.sortField]));
        });

        const coupons = await db.query.tblCoupons.findMany({
            with: {
                userDiscounts: {
                    with: {
                        user: true
                    }
                }
            },
            limit: pagination.limit,
            where: whereCondition,
            offset: (pagination.page - 1) * pagination.limit,
            orderBy: calculatedOrderBys,
        });

        const total = await db
            .select({ count: countDistinct(tblCoupons.id) })
            .from(tblCoupons)
            .where(whereCondition);

        const totalCount = total?.[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return {
            data: coupons,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: totalCount,
                totalPages: totalPages
            }
        };
    }

    // ============== USER DISCOUNT METHODS ==============

    async getUserDiscountById(id: number): Promise<TSchemaSubscription.TSubscriptionRepository.TUserDiscountWithRelationSelect | undefined> {
        const discount = await db.query.tblUserDiscounts.findFirst({
            where: (and(eq(tblUserDiscounts.id, id), isNull(tblUserDiscounts.deletedAt))),
            with: {
                user: true,
                coupon: true
            }
        });
        return discount;
    }

    async getAllUserDiscountsByUserId(userId: number): Promise<TSchemaSubscription.TSubscriptionRepository.TUserDiscountWithRelationSelect[]> {
        const discounts = await db.query.tblUserDiscounts.findMany({
            where: (and(eq(tblUserDiscounts.user_id, userId), isNull(tblUserDiscounts.deletedAt))),
            with: {
                user: true,
                coupon: true
            }
        });
        return discounts;
    }

    async getAllUserDiscounts(): Promise<TSchemaSubscription.TSubscriptionRepository.TUserDiscountWithRelationSelect[]> {
        const discounts = await db.query.tblUserDiscounts.findMany({
            where: (and(isNull(tblUserDiscounts.deletedAt))),
            with: {
                user: true,
                coupon: true
            }
        });
        return discounts;
    }

    async createUserDiscount(userId: number, discountData: Omit<TSchemaSubscription.TUserDiscountsInsert, 'user_id'>): Promise<number> {
        const [newDiscount] = await db.insert(tblUserDiscounts)
            .values({ user_id: userId, ...discountData })
            .returning();

        if (!newDiscount) {
            throw new Error("User discount not created");
        }

        return newDiscount.id;
    }

    async updateUserDiscount(id: number, discountData: Partial<TSchemaSubscription.TUserDiscountsInsert>): Promise<void> {
        await db.update(tblUserDiscounts)
            .set(discountData)
            .where(eq(tblUserDiscounts.id, id));
    }

    async deleteUserDiscount(id: number): Promise<void> {
        await db.update(tblUserDiscounts)
            .set({ deletedAt: new Date() })
            .where(eq(tblUserDiscounts.id, id));
    }

    // ============== CAMPAIGN METHODS ==============

    async getCampaignById(id: number): Promise<TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect | undefined> {
        const campaign = await db.query.tblCampaign.findFirst({
            where: (and(eq(tblCampaign.id, id), isNull(tblCampaign.deletedAt))),
            with: {
                translations: true,
                plan: {
                    with: {
                        translations: true
                    }
                }
            }
        });
        return campaign;
    }

    async getAllCampaigns(): Promise<TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect[]> {
        const campaigns = await db.query.tblCampaign.findMany({
            with: {
                translations: true,
                plan: {
                    with: {
                        translations: true
                    }
                }
            }
        });
        return campaigns;
    }

    async createCampaign(campaign: TSchemaSubscription.TCampaignInsert): Promise<void> {
        await db.insert(tblCampaign).values(campaign);
        return;
    }

    async updateCampaign(id: number, campaign: Partial<TSchemaSubscription.TCampaignInsert>): Promise<void> {
        await db.update(tblCampaign)
            .set(campaign)
            .where(eq(tblCampaign.id, id));
    }

    async deleteCampaign(id: number): Promise<void> {
        await db.update(tblCampaign)
            .set({ deletedAt: new Date() })
            .where(eq(tblCampaign.id, id));
    }

    /**
     * Create a new campaign with its translations
     */
    async createCampaignWithTranslation({ campaignData, translations }: TSchemaSubscription.TSubscriptionRepository.TCreateCampaignWithTranslation): Promise<number> {
        const [newCampaign] = await db.insert(tblCampaign).values(campaignData).returning();

        if (!newCampaign) {
            throw new Error("Campaign not created");
        }

        const campaignId = newCampaign.id;

        if (translations && translations.length > 0) {
            const translationRecords = translations.map((t) => ({ campaignId, ...t }));
            await db.insert(tblCampaignTranslation).values(translationRecords);
        }

        return campaignId;
    }

    /**
     * Update campaign data together with its translations
     */
    async updateCampaignWithTranslation({ id, data }: TSchemaSubscription.TSubscriptionRepository.TUpdateCampaignWithTranslation): Promise<void> {
        const { campaignData, translations } = data;

        // Update campaign base data
        if (campaignData && Object.keys(campaignData).length > 0) {
            await db.update(tblCampaign).set(campaignData).where(eq(tblCampaign.id, id));
        }

        // Update translations if provided
        if (translations && translations.length > 0) {
            for (const tr of translations) {
                if (!tr.id) continue;
                await db.update(tblCampaignTranslation).set(tr).where(eq(tblCampaignTranslation.id, tr.id));
            }
        }
    }

    async getCampaignsWithPagination(input: TSubscriptionValidator.TCampaignPaginationQuery):
        Promise<TBaseValidators.TPagination<TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect>> {
        const { pagination, sort, global_search, filter } = input;

        const andConditions: SQL<unknown>[] = [];

        if (filter.title) {
            andConditions.push(like(tblCampaign.title, `%${filter.title}%`));
        }

        if (filter.isActive !== undefined) {
            andConditions.push(eq(tblCampaign.is_active, filter.isActive));
        }

        if (filter.targetType) {
            andConditions.push(eq(tblCampaign.target_type, filter.targetType as any));
        }

        if (global_search) {
            andConditions.push(like(tblCampaign.title, `%${global_search}%`));
        }

        const whereCondition: SQL<unknown> | undefined = and(
            isNull(tblCampaign.deletedAt),
            isNull(tblCampaignTranslation.deletedAt),
            and(...andConditions)
        );

        const calculatedOrderBys: SQL<unknown>[] = [];
        const sortMapper = {
            'asc': asc,
            'desc': desc
        };
        const columnMapper: Record<TSubscriptionValidator.TCampaignPaginationQuerySortKeys, PgColumn> = {
            'title': tblCampaign.title,
            createdAt: tblCampaign.createdAt
        };

        sort.forEach(s => {
            calculatedOrderBys.push(sortMapper[s.sortBy](columnMapper[s.sortField]));
        });

        const campaigns = await db.query.tblCampaign.findMany({
            with: {
                translations: true,
                plan: {
                    with: {
                        translations: true
                    }
                }
            },
            limit: pagination.limit,
            where: whereCondition,
            offset: (pagination.page - 1) * pagination.limit,
            orderBy: calculatedOrderBys,
        });

        const total = await db
            .select({ count: countDistinct(tblCampaign.id) })
            .from(tblCampaign)
            .leftJoin(tblCampaignTranslation, eq(tblCampaign.id, tblCampaignTranslation.campaignId))
            .where(whereCondition);

        const totalCount = total?.[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return {
            data: campaigns,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: totalCount,
                totalPages: totalPages
            }
        };
    }
}
