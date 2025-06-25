import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { handleAppError } from './lib/errors'
import honoFactory from './lib/hono/hono-factory'
import authApp from './modules/interfaces/routes/auth'
import examplesApp from './modules/interfaces/routes/test'
import userApp from './modules/interfaces/routes/user'
import { createWebSocketRoute } from './modules/interfaces/routes/websocket/websocket'
import { logger } from 'hono/logger'
import { limiter } from './lib/hono/rate-limitter'
import LookUpEnumsValidation from './modules/infrastructure/database/helpers/validate-lookup'
import constantsApp from './modules/interfaces/routes/constants'
import webHookApp from './modules/interfaces/routes/web-hook'
import { languageDetector } from 'hono/language'
import { SahredEnums } from '@repo/shared/enums'


const port = process.env.PORT || 3002
console.log(`Server is running on port ${port}`)


LookUpEnumsValidation.getInstance()
LookUpEnumsValidation.validate()











const app = honoFactory.createApp()

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })


app.onError((err, c) => {
  return handleAppError(c, err)
})



app.use(logger())
// app.use(limiter)


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
  .route('/constants', constantsApp)
  .route('/web-hook', webHookApp)






export { routes }


async function startServer() {
  await LookUpEnumsValidation.validationPromise
  const server = serve({
    fetch: app.fetch,
    port: Number(port)
  })
  injectWebSocket(server)
}

startServer()


export type AppType = typeof routes


const client = hc<typeof routes>('')

export type Client = typeof client



export interface Test {
  a: number;
}