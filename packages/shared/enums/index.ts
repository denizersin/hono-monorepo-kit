import { SelectData } from "./enum-data";
import { PermissionEnum } from "./permissions";
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


const MAIL_CONFIRMATION_MAP = {
    pending: 1,
    confirmed: 2,
    rejected: 3,
} as const;

const MAIL_CONFIRMATION_STATUS_KEY = {
    pending: 'pending',
    confirmed: 'confirmed',
    rejected: 'rejected',
} as const;

export type TMailConfirmationStatusKey = keyof typeof MAIL_CONFIRMATION_STATUS_KEY


const LANGUAGE_MAP = {
    tr: 1,
    en: 2,
    es: 3,
} as const;

const LANGUAGE_KEY = {
    tr: 'tr',
    en: 'en',
    es: 'es',
} as const;

export type TLanguageKey = keyof typeof LANGUAGE_KEY


const THEME_MAP = {
    light: 1,
    dark: 2,
} as const;

const THEME_KEY = {
    light: 'light',
    dark: 'dark',
} as const;

export type TThemeKey = keyof typeof THEME_KEY


const CHAT_TYPE_MAP = {
    private: 1,
    group: 2,
} as const;

const CHAT_TYPE_KEY = {
    private: 'private',
    group: 'group',
} as const;

export type TChatTypeKey = keyof typeof CHAT_TYPE_KEY


const MODEL_MAP = {
    'GEMINI_2.5_FLASH': 1,
    'GEMINI_2.5_PRO': 2,
} as const;

const MODEL_KEY = {
    'GEMINI_2.5_FLASH': 'GEMINI_2.5_FLASH',
    'GEMINI_2.5_PRO': 'GEMINI_2.5_PRO',
} as const;

export type TModelKey = keyof typeof MODEL_KEY





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


export type TEnumCurrenyKey = keyof typeof CURRENCY_KEY;
const CURRENCY_KEY = {
    TRY: "TRY",
    USD: "USD",
    EUR: "EUR",
} as const;


export type TEnumPlanIntervalKey = keyof typeof PLAN_INTERVAL_KEY;
const PLAN_INTERVAL_KEY = {
    yearly: 'yearly',
    monthly: 'monthly',
    weekly: 'weekly',
    daily: 'daily',
} as const;


export type TEnumSubscriptionEventType = keyof typeof SUBSCRIPTION_EVENT_TYPE_KEY;
const SUBSCRIPTION_EVENT_TYPE_KEY = {
    renewed: "renewed",
    upgraded: "upgraded",
    cancelled: "cancelled",
    payment_failed: "payment_failed",
} as const;


export type TEnumDiscountType = keyof typeof DISCOUNT_TYPE_KEY;
const DISCOUNT_TYPE_KEY = {
    percentage: "percentage",
    fixed_amount: "fixed_amount",
} as const;


export type TEnumCouponDurationKey = keyof typeof COUPON_DURATION_TYPE_KEY;
const COUPON_DURATION_TYPE_KEY = {
    once: "once",
    forever: "forever",
    repeating: "repeating",
} as const;

export type TEnumCampaignTargetType = keyof typeof CAMPAIGN_TARGET_TYPE_KEY;
const CAMPAIGN_TARGET_TYPE_KEY = {
    all_users: "all_users",
    new_users: "new_users",
    inactive_users: "inactive_users",
} as const;

// -----------------------------------------------------------------------
// Global Enum Helper
// -----------------------------------------------------------------------

type TEnumMapRecord<K extends string> = Record<K, number>;
type TKeyRecord<K extends string> = Record<K, K>;

// -----------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------

export const SahredEnums = {
    // Enums
    ROLE_MAP,
    ROLE_KEY,
    MAIL_CONFIRMATION_MAP,
    MAIL_CONFIRMATION_STATUS_KEY,
    LANGUAGE_MAP,
    LANGUAGE_KEY,
    THEME_MAP,
    THEME_KEY,
    CHAT_TYPE_MAP,
    CHAT_TYPE_KEY,
    MODEL_MAP,
    MODEL_KEY,
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

