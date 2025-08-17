import type { TChatType, TEnum, TLanguage, TMailConfirmationStatus, TModel, TRole, TTheme } from "../types/index";


const EnumRole: Record<TRole, TRole> = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    OWNER: 'OWNER'
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

const EnumLanguage: Record<TLanguage, TLanguage> = {
    tr: 'tr',
    en: 'en',
    es: 'es'
} as const;

const EnumLanguageId: Record<TLanguage, number> = {
    tr: 1,
    en: 2,
    es: 3
} as const;

const EnumTheme: Record<TTheme, TTheme> = {
    light: 'light',
    dark: 'dark'
} as const;


const STATUS_CODE_IDS = {
    BAD_REQUEST: 400, // The server cannot or will not process the request due to something that is perceived to be a client error.
    UNAUTHORIZED: 401, // The client request has not been completed because it lacks valid authentication credentials for the requested resource.
    PAYMENT_REQUIRED: 402, // The client request requires payment to access the requested resource.
    FORBIDDEN: 403, // The server was unauthorized to access a required data source, such as a REST API.
    NOT_FOUND: 404, // The server cannot find the requested resource.
    METHOD_NOT_SUPPORTED: 405, // The server knows the request method, but the target resource doesn't support this method.
    TIMEOUT: 408, // The server would like to shut down this unused connection.
    CONFLICT: 409, // The server request resource conflict with the current state of the target resource.
    PRECONDITION_FAILED: 412, // Access to the target resource has been denied.
    PAYLOAD_TOO_LARGE: 413, // Request entity is larger than limits defined by server.
    UNSUPPORTED_MEDIA_TYPE: 415, // The server refuses to accept the request because the payload format is in an unsupported format.
    UNPROCESSABLE_CONTENT: 422, // The server understands the request method, and the request entity is correct, but the server was unable to process it.
    TOO_MANY_REQUESTS: 429, // The rate limit has been exceeded or too many requests are being sent to the server.
    CLIENT_CLOSED_REQUEST: 499, // Access to the resource has been denied.
    INTERNAL_SERVER_ERROR: 500, // An unspecified error occurred.
    NOT_IMPLEMENTED: 501, // The server does not support the functionality required to fulfill the request.
    BAD_GATEWAY: 502, // The server received an invalid response from the upstream server.
    SERVICE_UNAVAILABLE: 503, // The server is not ready to handle the request.
    GATEWAY_TIMEOUT: 504, // The server did not get a response in time from the upstream server that it needed in order to complete the request.
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



 const EMOTIONS={
    
 }




type TTestEnum = typeof TesEnum[keyof typeof TesEnum]

export const SahredEnums = {
    // -----------------------------ENUMS--------------------------------


    Role: EnumRole,
    MailConfirmationStatus: EnumMailConfirmationStatus,
    MailConfirmationStatusId: EnumMailConfirmationStatusId,
    STATUS_CODES: STATUS_CODES,
    STATUS_CODE_IDS: STATUS_CODE_IDS,
    CompanyId: CompanyId,
    ChatType: ChatType,
    ChatTypeId: ChatTypeId,
    Model: Model,
    ModelId: ModelId,
    Language: EnumLanguage,
    LanguageId: EnumLanguageId,
    Theme: EnumTheme,
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
    getStringEnumValuesForZod: <T extends Record<string, string>>(enumType: T) => {
        type Key = keyof T;
        type Value = T[Key] extends string ? T[Key] : never;
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

