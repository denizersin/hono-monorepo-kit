import { createSuccessResponse } from "@server/lib/errors"
import { createHonoApp } from "@server/lib/hono/hono-factory"
import { zValidator } from "@hono/zod-validator"
import { emailJobSchema, emailQueue } from "@repo/jobs"
import { z } from "zod"


// const authApp = new Hono<{
//     Variables: {
//         publicMiddlewareContext: TPublicMiddlewareContext
//     }
// }>()

const examplesApp = createHonoApp()
    .get('/', async (c) => {
        return c.json(createSuccessResponse({
            message: "Examples route is alive"
        }))
    })
    .post('/mail-job',
        zValidator('json', emailJobSchema),
        async (c) => {
            const body = c.req.valid('json')
            const job = await emailQueue.addEmailJob(body)

            return c.json(createSuccessResponse({
                message: 'Mail job queued',
                jobId: String(job.id)
            }))
        })
    .get('/mail-job/:jobId',
        zValidator('param', z.object({
            jobId: z.string().min(1)
        })),
        async (c) => {
            const { jobId } = c.req.valid('param')
            const status = await emailQueue.getEmailJobStatus(jobId)

            return c.json(createSuccessResponse({
                status
            }))
        })
    .post('/upload',
        async (c) => {
            const body = await c.req.parseBody()
            console.log('file')
            console.log(body)
            console.log(body['file']) // File | string


            return c.json(createSuccessResponse({
                message: 'File uploaded successfully!'
            }))
        })

export default examplesApp
