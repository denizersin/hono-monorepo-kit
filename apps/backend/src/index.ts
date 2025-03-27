import { ENV } from '@server/env'
import { LookUpEnumsValidation } from '@server/modules/domain/validate-lookup/validateLookUp'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import ValidateLookUpEnums from './modules/domain/validate-lookup/validateLookUp'
import authApp from './modules/interfaces/routes/auth'
import userApp from './modules/interfaces/routes/user'
import { honoPublicMiddleware, TPublicMiddlewareContext } from './modules/shared/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { handleAppError } from './lib/errors'
import examplesApp from './modules/interfaces/routes/test'


const port = process.env.PORT || 3002
console.log(`Server is running on port ${port}`)


LookUpEnumsValidation.getInstance()
LookUpEnumsValidation.validate()









const app = new Hono<{
  Variables: {
    publicMiddlewareContext: TPublicMiddlewareContext
  }
}>()

app.onError((err, c) => {
  return handleAppError(c, err)
})



app.use(
  '/*',
  cors({
    origin: ['http://localhost:3000'], // Web uygulamasına izin ver
    // allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'], // Çerezleri içeren yanıtları al
    exposeHeaders: ['Content-Length', 'X-Requested-With', 'Set-Cookie'], // Tarayıcının bu header'ları okumasını sağlar
    maxAge: 86400,
    credentials: true, // Çerezlerin gönderilmesini sağla
  })
);


app.use(honoPublicMiddleware)



app.use('/*', async (c, next) => {
  await ValidateLookUpEnums.validationPromise
  await next()
})


// app.use('/*', honoAuthMiddleware2, (c,next) => {
//   return next()
// })








// app.get('/api/health', (c) => {
//   return c.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     data: {
//       message: 'Hello from Hono!',
//       version: '1.0.0',
//       environment: ENV.NODE_ENV,
//       isDev: ENV._runtime.IS_DEV,
//     }
//   })
// })


//grouping routes


//we should chain routes like this to get type safety
const routes = app
  .get('/', (c) => {
    return c.json({
      message: 'Hello from Hono!',
    })
  })

  .route('/auth', authApp)
  .route('/user', userApp)
  .route('/examples', examplesApp)
  
  export { routes }



serve({
  fetch: app.fetch,
  port: Number(port)
})

export type AppType = typeof routes

export const test = {}


const client = hc<typeof routes>('')

export type Client = typeof client

