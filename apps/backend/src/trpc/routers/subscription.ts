import { SahredEnums } from "@repo/shared/enums";
import { subscriptionValidator } from "@repo/shared/validators";
import { subscriptionRepository, subscriptionService } from "@server/bootstrap";
import { createTRPCRouter, protectedProcedure, roleMiddleware } from "../init";
import { z } from "zod";

export const subscriptionRouter = createTRPCRouter({
    // ============== PLAN METHODS ==============

    createPlanWithTranslation: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.createPlanWithTranslationSchema).mutation(async ({ ctx, input }) => {
            return await subscriptionService.createPlanWithTranslation(input)
        }),

    updatePlanWithTranslation: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.updatePlanWithTranslationSchema).mutation(async ({ ctx, input }) => {
            return await subscriptionService.updatePlanWithTranslation(input)
        }),

    getPlansWithPagination: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.planPaginationQuerySchema).query(async ({ ctx, input }) => {
            return await subscriptionRepository.getPlansWithPagination(input)
        }),

    getAllPlansForSelect: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .query(async ({ ctx }) => {
            return await subscriptionRepository.getAllPlansForSelect()
        }),

    getPlanById: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
            return await subscriptionRepository.getPlanById(input.id)
        }),

    deletePlan: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
            return await subscriptionRepository.deletePlan(input.id)
        }),

    // ============== SUBSCRIPTION METHODS ==============

    createSubscription: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.createSubscriptionSchema).mutation(async ({ ctx, input }) => {
            // Direct repository call for now, could add service layer later
            console.log(input.subscriptionData, '21312')
            return await subscriptionRepository.createSubscription(input.subscriptionData)
        }),

    updateSubscription: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.updateSubscriptionSchema).mutation(async ({ ctx, input }) => {
            // Direct repository call for now
            return await subscriptionRepository.updateSubscription(input.id, input.data.subscriptionData)
        }),

    getSubscriptionsWithPagination: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.subscriptionPaginationQuerySchema).query(async ({ ctx, input }) => {
            return await subscriptionRepository.getSubscriptionsWithPagination(input)
        }),

    deleteSubscription: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            return await subscriptionRepository.deleteSubscription(input.id)
        }),


    // ============== CAMPAIGN METHODS ==============

    createCampaignWithTranslation: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.createCampaignWithTranslationSchema).mutation(async ({ ctx, input }) => {
            return await subscriptionService.createCampaignWithTranslation(input)
        }),

    updateCampaignWithTranslation: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.updateCampaignWithTranslationSchema).mutation(async ({ ctx, input }) => {
            return await subscriptionService.updateCampaignWithTranslation(input)
        }),

    getCampaignsWithPagination: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.campaignPaginationQuerySchema).query(async ({ ctx, input }) => {
            return await subscriptionRepository.getCampaignsWithPagination(input)
        }),

    deleteCampaign: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(z.object({ id: z.number() })).mutation(async ({ input }) => {
            return await subscriptionRepository.deleteCampaign(input.id)
        }),

    // ============== COUPON METHODS ==============

    createCoupon: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.createCouponSchema).mutation(async ({ ctx, input }) => {
            // Direct repository call for now
            return await subscriptionRepository.createCoupon(input.couponData)
        }),

    updateCoupon: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.updateCouponSchema).mutation(async ({ ctx, input }) => {
            // Direct repository call for now
            return await subscriptionRepository.updateCoupon(input.id, input.data.couponData)
        }),

    getCouponsWithPagination: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.couponPaginationQuerySchema).query(async ({ ctx, input }) => {
            return await subscriptionRepository.getCouponsWithPagination(input)
        }),

    deleteCoupon: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(z.object({ id: z.number() })).mutation(async ({ input }) => {
            return await subscriptionRepository.deleteCoupon(input.id)
        }),

    // ============== USER DISCOUNT METHODS ==============

    createUserDiscount: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.createUserDiscountSchema).mutation(async ({ ctx, input }) => {
            // Direct repository call for now
            // Would need userId from context or input
            return await subscriptionRepository.createUserDiscount(0, input.discountData)
        }),

    updateUserDiscount: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(subscriptionValidator.updateUserDiscountSchema).mutation(async ({ ctx, input }) => {
            // Direct repository call for now
            return await subscriptionRepository.updateUserDiscount(input.id, input.data.discountData)
        }),

    getAllUserDiscounts: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .query(async ({ ctx }) => {
            return await subscriptionRepository.getAllUserDiscounts()
        }),
})
