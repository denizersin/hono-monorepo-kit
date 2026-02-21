import { TEnumMapRecord } from ".";


const _PermissionEnum = {
    CREATE_USER: 1000,
    UPDATE_USER: 1001,
    DELETE_USER: 1002,
    LIST_USER: 1003,
} as const;

export type TPermission = keyof typeof _PermissionEnum

export const PermissionEnum: TEnumMapRecord<TPermission> = _PermissionEnum
