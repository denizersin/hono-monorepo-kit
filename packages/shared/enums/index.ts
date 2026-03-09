import type { TChatType, TLanguage, TMailConfirmationStatus, TModel, TTheme } from "../types/index";
import { SelectData } from "./enum-data";
import { PermissionEnum } from "./permissions";
// -----------------------------------------------------------------------
// Base Type
// -----------------------------------------------------------------------


// Base Types
export type TEnumMapRecord<K extends string> = Record<K, number>;
export type TKeyRecord<K extends string> = Record<K, K>;




// export type TEnumMapRecord<K extends string> = Record<K, number>;

// -----------------------------------------------------------------------
// Enum Maps
// -----------------------------------------------------------------------

const ROLE_MAP = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    OWNER: 3,
    USER: 4,
} as const;

const ROLE_KEY = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    OWNER: 'OWNER',
    USER: 'USER',
} as const;

export type TRole = keyof typeof ROLE_KEY



const MAIL_CONFIRMATION_MAP: TEnumMapRecord<TMailConfirmationStatus> = {
    pending: 1,
    confirmed: 2,
    rejected: 3,
} as const;

const LANGUAGE_MAP: TEnumMapRecord<TLanguage> = {
    tr: 1,
    en: 2,
    es: 3,
} as const;

const LANGUAGE_KEY: TKeyRecord<TLanguage> = {
    tr: 'tr',
    en: 'en',
    es: 'es'
} as const;

const THEME_MAP: TEnumMapRecord<TTheme> = {
    light: 1,
    dark: 2,
} as const;

const THEME_KEY: TKeyRecord<TTheme> = {
    light: 'light',
    dark: 'dark'
} as const;

const CHAT_TYPE_MAP: TEnumMapRecord<TChatType> = {
    private: 1,
    group: 2,
} as const;

const MODEL_MAP: TEnumMapRecord<TModel> = {
    'GEMINI_2.5_FLASH': 1,
    'GEMINI_2.5_PRO': 2,
} as const;

// -----------------------------------------------------------------------
// Status Codes
// -----------------------------------------------------------------------

const STATUS_CODE_IDS = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_SUPPORTED: 405,
    TIMEOUT: 408,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE_CONTENT: 422,
    TOO_MANY_REQUESTS: 429,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;

const STATUS_CODES = {
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    METHOD_NOT_SUPPORTED: 'METHOD_NOT_SUPPORTED',
    TIMEOUT: 'TIMEOUT',
    CONFLICT: 'CONFLICT',
    PRECONDITION_FAILED: 'PRECONDITION_FAILED',
    PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
    UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
    UNPROCESSABLE_CONTENT: 'UNPROCESSABLE_CONTENT',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    CLIENT_CLOSED_REQUEST: 'CLIENT_CLOSED_REQUEST',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
    BAD_GATEWAY: 'BAD_GATEWAY',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
} as const;

const COMPANY_ID_MAP = {
    default: 1,
} as const;


export type TSubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'expired';

const SUBSCRIPTION_STATUS_MAP = {
    active: 1,
    trialing: 2,
    cancelled: 3,
    expired: 4,
} as const;

const SUBSCRIPTION_STATUS_KEY = {
    active: 'active',
    trialing: 'trialing',
    cancelled: 'cancelled',
    expired: 'expired',
} as const;


export type TEnumCurrenyKey = "TRY" | "USD" | "EUR"
const CURRENCY_KEY = {
    TRY: "TRY",
    USD: "USD",
    EUR: "EUR",
} as const;


export type TEnumPlanIntervalKey = "yearly" | "monthly" | "weekly" | "daily"
const PLAN_INTERVAL_KEY = {
    yearly: 'yearly',
    monthly: 'monthly',
    weekly: 'weekly',
    daily: 'daily',
} as const;


export type TEnumSubscriptionEventType = "renewed" | "upgraded" | "cancelled" | "payment_failed"
const SUBSCRIPTION_EVENT_TYPE_KEY = {
    renewed: "renewed",
    upgraded: "upgraded",
    cancelled: "cancelled",
    payment_failed: "payment_failed",
} as const;


export type TEnumDiscountType = "percentage" | "fixed_amount"
const DISCOUNT_TYPE_KEY = {
    percentage: "percentage",
    fixed_amount: "fixed_amount",
} as const;


// ... existing code ...
export type TEnumCouponDurationKey = "once" | "forever" | "repeating"
const COUPON_DURATION_TYPE_KEY = {
    once: "once",
    forever: "forever",
    repeating: "repeating",
} as const;

export type TEnumCampaignTargetType = "all_users" | "new_users" | "inactive_users"
const CAMPAIGN_TARGET_TYPE_KEY = {
    all_users: "all_users",
    new_users: "new_users",
    inactive_users: "inactive_users",
} as const;

// -----------------------------------------------------------------------
// Global Enum Helper
// -----------------------------------------------------------------------



// -----------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------

export const SahredEnums = {
    // Enums
    ROLE_MAP,
    ROLE_KEY,
    MAIL_CONFIRMATION_MAP,
    LANGUAGE_MAP,
    LANGUAGE_KEY,
    THEME_MAP,
    THEME_KEY,
    CHAT_TYPE_MAP,
    MODEL_MAP,
    PERMISSION_MAP: PermissionEnum,
    // Status
    STATUS_CODES,
    STATUS_CODE_IDS,

    // Misc
    COMPANY_ID_MAP,

    SUBSCRIPTION_STATUS_MAP,
    SUBSCRIPTION_STATUS_KEY,

    CURRENCY_KEY,
    PLAN_INTERVAL_KEY,
    SUBSCRIPTION_EVENT_TYPE_KEY,
    DISCOUNT_TYPE_KEY,
    COUPON_DURATION_TYPE_KEY,
    CAMPAIGN_TARGET_TYPE_KEY,

    // Helper


    SelectData,



    //map helpers
    getMapId<K extends string>(map: TEnumMapRecord<K>, key: K): number {
        return map[key];
    },

    getMapKey<K extends string>(map: TEnumMapRecord<K>, id: number): K {
        const entry = Object.entries<number>(map).find(([_, v]) => v === id);
        if (!entry) throw new Error(`Unknown id: ${id}`);
        return entry[0] as K;
    },

    getMapKeys<K extends string>(map: TEnumMapRecord<K>): K[] {
        return Object.keys(map) as K[];
    },



    getMapValues<K extends string>(map: TEnumMapRecord<K>): number[] {
        return Object.values(map);
    },
    getMapIds<K extends string>(map: TEnumMapRecord<K>): number[] {
        return Object.values(map) as number[];
    },

    getMapEntries<K extends string>(map: TEnumMapRecord<K>): { key: K; id: number }[] {
        return Object.entries<number>(map).map(([k, v]) => ({
            key: k as K,
            id: v,
        }));
    },

    hasMapKey<K extends string>(map: TEnumMapRecord<K>, key: string): key is K {
        return key in map;
    },

    hasMapId<K extends string>(map: TEnumMapRecord<K>, id: number): boolean {
        return Object.values<number>(map).includes(id);
    },

    getMapKeysForZod<K extends string>(map: TEnumMapRecord<K>): [K, ...K[]] {
        return Object.keys(map) as [K, ...K[]];
    },

    getMapStringEnumKeysForZod<K extends string>(map: TEnumMapRecord<K>): [K, ...K[]] {
        return Object.keys(map) as [K, ...K[]];
    },


    //key helpers
    getRecordKeysForZod<K extends string>(map: TKeyRecord<K>): [K, ...K[]] {
        return Object.keys(map) as [K, ...K[]];
    },

    getRecordKeys<K extends string>(map: TKeyRecord<K>): [K] {
        return Object.keys(map) as [K];
    },
}

