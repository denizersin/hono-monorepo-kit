import { IVerifyCodeRepository } from "@server/modules/domain/repositories/IVerifyCodeRepository";
import TVerifyCodeEntity from "@server/modules/domain/entities/verifyCode/VerifyCode";
import db from "../../database";
import { and, eq, lt } from "drizzle-orm";
import schema from "../../database/schema";

export class VerifyCodeRepositoryImpl implements IVerifyCodeRepository {
    async getVerifyCodeById(id: number): Promise<TVerifyCodeEntity.TVerifyCode | undefined> {
        const verifyCode = await db.query.tblVerifyCode.findFirst({
            where: eq(schema.tblVerifyCode.id, id)
        });
        return verifyCode;
    }

    async getVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<TVerifyCodeEntity.TVerifyCode | undefined> {
        const verifyCode = await db.query.tblVerifyCode.findFirst({
            where: eq(schema.tblVerifyCode.generatedForPhoneOrMail, phoneOrMail)
        });
        return verifyCode;
    }

    async createVerifyCode(verifyCode: TVerifyCodeEntity.TVerifyCodeInsert) {
        await db.insert(schema.tblVerifyCode).values(verifyCode)
    }

    async deleteVerifyCode(id: number): Promise<void> {
        await db.delete(schema.tblVerifyCode)
            .where(eq(schema.tblVerifyCode.id, id));
    }

    async deleteExpiredVerifyCodes(): Promise<void> {
        const now = new Date();
        await db.delete(schema.tblVerifyCode)
            .where(lt(schema.tblVerifyCode.expiresAt, now));
    }

    async deleteVerifyCodeByPhoneOrMail(phoneOrMail: string): Promise<void> {
        await db.delete(schema.tblVerifyCode)
            .where(eq(schema.tblVerifyCode.generatedForPhoneOrMail, phoneOrMail));
    }
} 