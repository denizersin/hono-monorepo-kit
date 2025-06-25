import { IVerifyCodeRepository } from "@server/modules/domain/repositories/IVerifyCodeRepository";
import TVerifyCodeEntity from "@server/modules/domain/entities/verifyCode/VerifyCode";
import db from "../../database";
import { and, eq, lt } from "drizzle-orm";
import { tblVerifyCode } from "@repo/shared/schema";

export class VerifyCodeRepositoryImpl implements IVerifyCodeRepository {
    async getVerifyCodeById(id: number): Promise<TVerifyCodeEntity.TVerifyCode | undefined> {
        const verifyCode = await db.query.tblVerifyCode.findFirst({
            where: eq(tblVerifyCode.id, id)
        });
        return verifyCode;
    }

    async getVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<TVerifyCodeEntity.TVerifyCode | undefined> {
        const verifyCode = await db.query.tblVerifyCode.findFirst({
            where: eq(tblVerifyCode.generatedForPhoneOrMail, phoneOrMail)
        });
        return verifyCode;
    }

    async createVerifyCode(verifyCode: TVerifyCodeEntity.TVerifyCodeInsert) {
        await db.insert(tblVerifyCode).values(verifyCode)
    }

    async deleteVerifyCode(id: number): Promise<void> {
        await db.delete(tblVerifyCode)
            .where(eq(tblVerifyCode.id, id));
    }

    async deleteExpiredVerifyCodes(): Promise<void> {
        const now = new Date();
        await db.delete(tblVerifyCode)
            .where(lt(tblVerifyCode.expiresAt, now));
    }

    async deleteVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<void> {
        await db.delete(tblVerifyCode)
            .where(eq(tblVerifyCode.generatedForPhoneOrMail, phoneOrMail));
    }
} 