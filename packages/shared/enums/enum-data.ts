import { SahredEnums } from ".";




export const SelectData = {

    get RoleNumericData() {
        return SahredEnums.entries(SahredEnums.Role).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get LanguageNumericData() {
        return SahredEnums.entries(SahredEnums.Language).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get ThemeNumericData() {
        return SahredEnums.entries(SahredEnums.Theme).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get ChatTypeNumericData() {
        return SahredEnums.entries(SahredEnums.ChatType).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get ModelNumericData() {
        return SahredEnums.entries(SahredEnums.Model).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get PermissionNumericData() {
        return SahredEnums.entries(SahredEnums.Permission).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },



    get Campaign_Target_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.Campaign_Target_Type).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get MailConfirmationStatusNumericData() {
        return SahredEnums.entries(SahredEnums.MailConfirmationStatus).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get SubscriptionStatusNumericData() {
        return SahredEnums.entries(SahredEnums.SubscriptionStatus).map(({ key, id }) => {
            return {
                label: key,
                value: id.toString()
            }
        })
    },

    get CurrencyData() {
        return SahredEnums.getRecordKeys(SahredEnums.Currency).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get Plan_IntervalData() {
        return SahredEnums.getRecordKeys(SahredEnums.Plan_Interval).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get Subscription_Event_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.Subscription_Event_Type).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get Discount_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.Discount_Type).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

    get CouponDuration_TypeData() {
        return SahredEnums.getRecordKeys(SahredEnums.CouponDuration_Type).map((key) => {
            return {
                label: key,
                value: key
            }
        })
    },

}
