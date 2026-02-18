import type { TChatType, TLanguage, TMailConfirmationStatus, TModel, TRole, TTheme } from "../types/index";
import { PermissionEnum } from "./permissions";
// -----------------------------------------------------------------------
// Base Type
// -----------------------------------------------------------------------

export type TEnumRecord<K extends string> = Record<K, number>;

// -----------------------------------------------------------------------
// Enum Maps
// -----------------------------------------------------------------------

const EnumRole: TEnumRecord<TRole> = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    OWNER: 3,
    USER: 4,
} as const;

const EnumRoleKey: Record<TRole, TRole> = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    OWNER: 'OWNER',
    USER: 'USER',
}


const EnumMailConfirmationStatus: TEnumRecord<TMailConfirmationStatus> = {
    pending: 1,
    confirmed: 2,
    rejected: 3,
} as const;

const EnumLanguage: TEnumRecord<TLanguage> = {
    tr: 1,
    en: 2,
    es: 3,
} as const;

const EnumLanugageKey: Record<TLanguage, TLanguage> = {
    tr: 'tr',
    en: 'en',
    es: 'es'
}

const EnumTheme: TEnumRecord<TTheme> = {
    light: 1,
    dark: 2,
} as const;

const EnumThemeKey: Record<TTheme, TTheme> = {
    light: 'light',
    dark: 'dark'
}

const EnumChatType: TEnumRecord<TChatType> = {
    private: 1,
    group: 2,
} as const;

const EnumModel: TEnumRecord<TModel> = {
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

const CompanyId = {
    default: 1,
} as const;

// -----------------------------------------------------------------------
// Global Enum Helper
// -----------------------------------------------------------------------



// -----------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------

export const SahredEnums = {
    // Enums
    Role: EnumRole,
    EnumRoleKey,
    MailConfirmationStatus: EnumMailConfirmationStatus,
    Language: EnumLanguage,
    EnumLanugageKey,
    Theme: EnumTheme,
    EnumThemeKey,
    ChatType: EnumChatType,
    Model: EnumModel,
    Permission: PermissionEnum,
    // Status
    STATUS_CODES,
    STATUS_CODE_IDS,

    // Misc
    CompanyId,

    // Helper






    getId<K extends string>(map: TEnumRecord<K>, key: K): number {
        return map[key];
    },

    getKey<K extends string>(map: TEnumRecord<K>, id: number): K {
        const entry = Object.entries<number>(map).find(([_, v]) => v === id);
        if (!entry) throw new Error(`Unknown id: ${id}`);
        return entry[0] as K;
    },

    keys<K extends string>(map: TEnumRecord<K>): K[] {
        return Object.keys(map) as K[];
    },

    values<K extends string>(map: TEnumRecord<K>): number[] {
        return Object.values(map);
    },
    ids<K extends string>(map: TEnumRecord<K>): number[] {
        return Object.values(map) as number[];
    },

    entries<K extends string>(map: TEnumRecord<K>): { key: K; id: number }[] {
        return Object.entries<number>(map).map(([k, v]) => ({
            key: k as K,
            id: v,
        }));
    },

    has<K extends string>(map: TEnumRecord<K>, key: string): key is K {
        return key in map;
    },

    hasId<K extends string>(map: TEnumRecord<K>, id: number): boolean {
        return Object.values<number>(map).includes(id);
    },

    keysForZod<K extends string>(map: TEnumRecord<K>): [K, ...K[]] {
        return Object.keys(map) as [K, ...K[]];
    },
    getStringEnumValuesForZod<K extends string>(map: TEnumRecord<K>): [K, ...K[]] {
        return Object.keys(map) as [K, ...K[]];
    },
}

