import { startTransactionPromisfy, TDBTransaction } from "@server/modules/infrastructure/database";
import schema from "@server/modules/infrastructure/database/schema";

// Unit of Work pattern
export class UnitOfWork {
    async execute<T>(work: (trx: TDBTransaction) => Promise<T>): Promise<T> {
        const trx = await startTransactionPromisfy();
        try {
            const result = await work(trx);
            return result;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
}

