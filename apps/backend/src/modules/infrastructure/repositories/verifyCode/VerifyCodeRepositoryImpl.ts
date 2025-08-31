import { IVerifyCodeRepository } from "@server/modules/domain/repositories/IVerifyCodeRepository";
import TVerifyCodeEntity from "@server/modules/domain/entities/verifyCode/VerifyCode";
import db from "../../database";
import { and, eq, isNull, lt } from "drizzle-orm";
import { tblVerifyCode } from "@repo/shared/schema";

export class VerifyCodeRepositoryImpl implements IVerifyCodeRepository {
    async getVerifyCodeById(id: number): Promise<TVerifyCodeEntity.TVerifyCode | undefined> {
        const verifyCode = await db.query.tblVerifyCode.findFirst({
            where: and(eq(tblVerifyCode.id, id), isNull(tblVerifyCode.deletedAt))
        });
        return verifyCode;
    }

    async getVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<TVerifyCodeEntity.TVerifyCode | undefined> {
        const verifyCode = await db.query.tblVerifyCode.findFirst({
            where: and(eq(tblVerifyCode.generatedForPhoneOrMail, phoneOrMail), isNull(tblVerifyCode.deletedAt))
        });
        return verifyCode;
    }

    async createVerifyCode(verifyCode: TVerifyCodeEntity.TVerifyCodeInsert) {
        await db.insert(tblVerifyCode).values(verifyCode)
    }

    async deleteVerifyCode(id: number): Promise<void> {
        await db.update(tblVerifyCode)
            .set({ deletedAt: new Date() })
            .where(and(eq(tblVerifyCode.id, id), isNull(tblVerifyCode.deletedAt)));
    }

    async deleteExpiredVerifyCodes(): Promise<void> {
        const now = new Date();
        await db.delete(tblVerifyCode)
            .where(and(lt(tblVerifyCode.expiresAt, now), isNull(tblVerifyCode.deletedAt)));
    }

    async deleteVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<void> {
        await db.update(tblVerifyCode)
            .set({ deletedAt: new Date() })
            .where(eq(tblVerifyCode.generatedForPhoneOrMail, phoneOrMail));
    }
} 