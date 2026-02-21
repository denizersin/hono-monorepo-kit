import { SahredEnums } from ".";




export const SelectData = {

    get RoleNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.ROLE_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get LanguageNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.LANGUAGE_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get ThemeNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.THEME_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get ChatTypeNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.CHAT_TYPE_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get ModelNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.MODEL_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get PermissionNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.PERMISSION_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },



    get Campaign_Target_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.CAMPAIGN_TARGET_TYPE_KEY).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get MailConfirmationStatusNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.MAIL_CONFIRMATION_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get SubscriptionStatusNumericData() {
        return SahredEnums.getMapEntries(SahredEnums.SUBSCRIPTION_STATUS_MAP).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get CurrencyData() {
        return SahredEnums.getRecordKeys(SahredEnums.CURRENCY_KEY).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get Plan_IntervalData() {
        return SahredEnums.getRecordKeys(SahredEnums.PLAN_INTERVAL_KEY).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get Subscription_Event_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.SUBSCRIPTION_EVENT_TYPE_KEY).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get Discount_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.DISCOUNT_TYPE_KEY).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get CouponDuration_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.COUPON_DURATION_TYPE_KEY).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

}
