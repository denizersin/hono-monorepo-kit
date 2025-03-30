import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { LookUpEnumsValidation } from '@server/modules/domain/validate-lookup/validateLookUp'
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { handleAppError } from './lib/errors'
import ValidateLookUpEnums from './modules/domain/validate-lookup/validateLookUp'
import authApp from './modules/interfaces/routes/auth'
import examplesApp from './modules/interfaces/routes/test'
import userApp from './modules/interfaces/routes/user'
import { createWebSocketRoute } from './modules/interfaces/routes/websocket/websocket'
import { honoPublicMiddleware, TPublicMiddlewareContext } from './modules/shared/middlewares/auth'


const port = process.env.PORT || 3002
console.log(`Server is running on port ${port}`)


LookUpEnumsValidation.getInstance()
LookUpEnumsValidation.validate()











const app = new Hono<{
  Variables: {
    publicMiddlewareContext: TPublicMiddlewareContext
  }
}>()

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })


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
  .route('/websocket', createWebSocketRoute(upgradeWebSocket))







export { routes }


const server = serve({
  fetch: app.fetch,
  port: Number(port)
})

injectWebSocket(server)


export type AppType = typeof routes

export const test = {}


const client = hc<typeof routes>('')

export type Client = typeof client

