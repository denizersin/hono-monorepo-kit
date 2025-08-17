import type { TSchemaUser } from "../dto/schema/index";

import { SahredEnums } from "../enums/index";

export type TEnum = Record<string, string> & { readonly [key: string]: string }

export type TRole = "ADMIN" | "USER" | "OWNER"

export type TRoles = {
    [key in TRole]: key
}


//Enum Types
export type TMailConfirmationStatus = "pending" | "confirmed" | "rejected"

export type TChatType = "private" | "group"


export type TModel = "GEMINI_2.5_FLASH" | "GEMINI_2.5_PRO"


export type TLanguage = "tr" | "en" | "es"

export type TTheme = "light" | "dark"

// -------------------------AUTHENTICATION--------------------------------
interface TBaseSession {
    role: TRole
    user: Omit<TSchemaUser.TTblUserSelect, 'password'>
}

export interface TAdminSession extends TBaseSession {
    role: typeof SahredEnums.Role.ADMIN
    companyId: number
}

interface TUserSession extends TBaseSession {
    companyId: number
}

export interface TOwnerSession extends TBaseSession {
    role: typeof SahredEnums.Role.OWNER
    companyId: number
}

export type TSession = TAdminSession | TUserSession | TOwnerSession

export type TJWTSession = {
    role: TRole
    companyId: number
    userId: number
    email: string
    fullName: string
}

//--------------------------AUTHENTICATION--------------------------------


export type TErrorCode = keyof typeof SahredEnums.STATUS_CODES