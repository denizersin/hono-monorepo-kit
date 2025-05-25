import TVerifyCodeEntity from "../entities/verifyCode/VerifyCode";

export interface IVerifyCodeRepository {
    getVerifyCodeById(id: number): Promise<TVerifyCodeEntity.TVerifyCode | undefined>;
    getVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<TVerifyCodeEntity.TVerifyCode | undefined>;
    createVerifyCode(verifyCode: TVerifyCodeEntity.TVerifyCodeInsert): Promise<void>;
    deleteVerifyCode(id: number): Promise<void>;
    deleteExpiredVerifyCodes(): Promise<void>;
    deleteVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<void>;
} 