import { TSchemaSubscription } from "@repo/shared/schema";
import { SubscriptionRepositoryImpl } from "@server/modules/infrastructure/repositories/subscription";

export class SubscriptionService {
    constructor(private subscriptionRepository: SubscriptionRepositoryImpl) { }

    // ============== PLAN METHODS ==============

    async createPlanWithTranslation(input: TSchemaSubscription.TSubscriptionRepository.TCreatePlanWithTranslation): Promise<number> {
        return await this.subscriptionRepository.createPlanWithTranslation(input);
    }

    async updatePlanWithTranslation(input: TSchemaSubscription.TSubscriptionRepository.TUpdatePlanWithTranslation): Promise<void> {
        await this.subscriptionRepository.updatePlanWithTranslation(input);
    }

    // ============== CAMPAIGN METHODS ==============

    async createCampaignWithTranslation(input: TSchemaSubscription.TSubscriptionRepository.TCreateCampaignWithTranslation): Promise<number> {
        return await this.subscriptionRepository.createCampaignWithTranslation(input);
    }

    async updateCampaignWithTranslation(input: TSchemaSubscription.TSubscriptionRepository.TUpdateCampaignWithTranslation): Promise<void> {
        await this.subscriptionRepository.updateCampaignWithTranslation(input);
    }
}
