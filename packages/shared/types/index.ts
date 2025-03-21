import type { TSchemaUser } from "../dto/schema/index";
import { SahredEnums } from "../enums/index";

export type TEnum = Record<string, string> & { readonly [key: string]: string }

export type TRole = "admin" | "user" | "owner"

export type TRoles={
  [key in TRole]:key
} 

export type TMailConfirmationStatus = "pending" | "confirmed" | "rejected"


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

//--------------------------AUTHENTICATION--------------------------------
