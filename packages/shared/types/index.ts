import type { TSchemaUser } from "../dto/schema/index";

import { SahredEnums, TRole } from "../enums/index";

export type TEnum = Record<string, string> & { readonly [key: string]: string }


export type TRoles = {
    [key in TRole]: key
}







// -------------------------AUTHENTICATION--------------------------------
interface TBaseSession {
    role: TRole
    roleId: number
    user: Omit<TSchemaUser.TTblUserSelect, 'password'>
    companyId: number

}

export interface TSuperAdminSession extends TBaseSession {
    role: 'SUPER_ADMIN'
    companyId: number
}

export interface TAdminSession extends TBaseSession {
    role: 'ADMIN'
    companyId: number
}

export interface TUserSession extends TBaseSession {
    companyId: number
}

export interface TOwnerSession extends TBaseSession {
    role: 'OWNER'
    companyId: number
}

export type TSession = TSuperAdminSession | TAdminSession | TUserSession | TOwnerSession

export type TJWTSession = {
    role: TRole
    roleId: number
    companyId: number
    userId: number
    email: string
    fullName: string
}

//--------------------------AUTHENTICATION--------------------------------


export type TErrorCode = keyof typeof SahredEnums.STATUS_CODES