import type { TChatType, TEnum, TMailConfirmationStatus, TModel, TRole } from "../types/index";


const EnumRole = {
    ADMIN: 'admin',
    USER: 'user',
    OWNER: 'owner'
} as const;



//look up example
const EnumMailConfirmationStatus: Record<TMailConfirmationStatus, TMailConfirmationStatus> = {
    pending: 'pending',
    confirmed: 'confirmed',
    rejected: 'rejected'
} as const;

const EnumMailConfirmationStatusId: Record<TMailConfirmationStatus, number> = {
    pending: 1,
    confirmed: 2,
    rejected: 3
} as const;
//look up example

const TesEnum = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
} as const;


const STATUS_CODES = {
    NOT_FOUND_ERROR: 404,
    CONFLICT_ERROR: 409,
    VALIDATION_ERROR: 400,
    AUTHENTICATION_ERROR: 401,
    AUTHORIZATION_ERROR: 403,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    CUSTOM_ERROR1: 400,

} as const;

const CompanyId = {
    default: 1
} as const;

const ChatType: Record<TChatType, TChatType> = {
    private: 'private',
    group: 'group'
} as const;

const ChatTypeId: Record<TChatType, number> = {
    private: 1,
    group: 2
} as const;

const Model: Record<TModel, TModel> = {
    "GEMINI_2.5_FLASH": 'GEMINI_2.5_FLASH',
    "GEMINI_2.5_PRO": 'GEMINI_2.5_PRO'
} as const;

const ModelId: Record<TModel, number> = {
    "GEMINI_2.5_FLASH": 1,
    "GEMINI_2.5_PRO": 2
} as const;


type TTestEnum = typeof TesEnum[keyof typeof TesEnum]

export const SahredEnums = {
    // -----------------------------ENUMS--------------------------------


    Role: EnumRole,
    MailConfirmationStatus: EnumMailConfirmationStatus,
    MailConfirmationStatusId: EnumMailConfirmationStatusId,
    STATUS_CODES: STATUS_CODES,
    CompanyId: CompanyId,
    ChatType: ChatType,
    ChatTypeId: ChatTypeId,
    Model: Model,
    ModelId: ModelId,
    // -----------------------------ENUMS--------------------------------


    // -----------------------------GET ENUM VALUES AND KEYS--------------------------------

    getEnumKeys: <T extends object>(enumType: T) => {
        type Key = keyof typeof enumType;
        return Object.keys(enumType) as Key[]
    },

    getEnumValues: <T extends object>(enumType: T) => {
        type Key = keyof typeof enumType;
        type Value = typeof enumType[Key]
        return Object.values(enumType) as Value[]
    },

    getEnumValuesForZod: <T extends object>(enumType: T) => {
        type Key = keyof typeof enumType;
        type Value = typeof enumType[Key]
        return Object.values(enumType) as [Value, ...Value[]]
    },

    getKeyFromIdEnum: <T extends Record<string, number>>({
        Enum,
        value
    }: {
        Enum: T
        value: number
    }): keyof T => {
        return Object.keys(Enum).find(key => Enum[key] === value) as keyof T
    },


    getIdFromKeyEnum: <T extends Record<string, number>>({
        Enum,
        key
    }: {
        Enum: T
        key: keyof T
    }): number => {
        return Enum[key] as number
    }
    // -----------------------------GET ENUM VALUES AND KEYS--------------------------------
} as const;



const confirmationStatusId = 2;
const confirmationStatusKey = SahredEnums.getKeyFromIdEnum({
    Enum: SahredEnums.MailConfirmationStatusId,
    value: confirmationStatusId
})

const id = SahredEnums.getIdFromKeyEnum({
    Enum: SahredEnums.MailConfirmationStatusId,
    key: confirmationStatusKey
})


const values = SahredEnums.getEnumValues(SahredEnums.Role)
// ?~ ('admin', 'user', 'owner')[]



const keys = SahredEnums.getEnumKeys(SahredEnums.Role)

// ?~ ('ADMIN', 'USER', 'OWNER')[]

