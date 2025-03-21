import type { TEnum, TMailConfirmationStatus, TRole } from "../types/index";


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


export const SahredEnums = {
    // -----------------------------ENUMS--------------------------------


    Role: EnumRole,
    MailConfirmationStatus: EnumMailConfirmationStatus,
    MailConfirmationStatusId: EnumMailConfirmationStatusId,
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

const id=SahredEnums.getIdFromKeyEnum({
    Enum: SahredEnums.MailConfirmationStatusId,
    key: confirmationStatusKey
})


const values=SahredEnums.getEnumValues(SahredEnums.Role)
// ?~ ('admin', 'user', 'owner')[]



const keys=SahredEnums.getEnumKeys(SahredEnums.Role)

// ?~ ('ADMIN', 'USER', 'OWNER')[]

