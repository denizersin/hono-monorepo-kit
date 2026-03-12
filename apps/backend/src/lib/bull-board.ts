import { HonoAdapter } from "@bull-board/hono"
import { serveStatic } from "@hono/node-server/serve-static"
import { createBullBoard } from "@bull-board/api"
import { Queue } from "bullmq"
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ENV } from "@server/env";
import { SahredEnums } from "@repo/shared/enums";



const serverAdapter = new HonoAdapter(serveStatic);

createBullBoard({
    queues: SahredEnums.getRecordKeys(SahredEnums.QUEUE_KEY).map(key => new BullMQAdapter(new Queue(key, {
        connection: {
            host: ENV.REDIS_HOST,
            port: Number(ENV.REDIS_PORT),
            password: ENV.REDIS_PASSWORD
        }
    }))),
    serverAdapter,
});
serverAdapter.setBasePath(ENV.BULL_BOARD_BASE_PATH);

export const BULL_BOARD_CONFIG = { serverAdapter }