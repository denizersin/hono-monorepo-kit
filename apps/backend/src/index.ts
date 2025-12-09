import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { trpcServer } from '@hono/trpc-server'
import { getApiContext } from '@server/lib/context'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { logger as honoLogger } from 'hono/logger'
import { ENV } from './env'
import honoFactory from './lib/hono/hono-factory'
import LookUpEnumsValidation from './modules/infrastructure/database/helpers/validate-lookup'
import authApp from './modules/interfaces/rest-routers/auth'
import characterApp from './modules/interfaces/rest-routers/character'
import constantsApp from './modules/interfaces/rest-routers/constants'
import examplesApp from './modules/interfaces/rest-routers/test'
import userApp from './modules/interfaces/rest-routers/user'
import webHookApp from './modules/interfaces/rest-routers/web-hook'
import { createWebSocketRoute } from './modules/interfaces/rest-routers/websocket/websocket'
import { createTRPCContext } from './trpc/init'
import { appRouter } from './trpc/routers'
import logger from '@repo/logger'
import { startWorkers, JobType } from '@repo/jobs'
process.env.TZ = 'UTC';

startWorkers()





const port = ENV.PORT || 3002
console.log(`Server is running on port ${port}`)


LookUpEnumsValidation.getInstance()
LookUpEnumsValidation.validate()



const app = honoFactory.createApp()

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })






app.use(honoLogger())
// app.use(limiter)


app.use(
  '/*',
  cors({
    origin: [ENV._runtime.WEB_URL], // Web uygulamasına izin ver
    // allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'], // Çerezleri içeren yanıtları al
    exposeHeaders: ['Content-Length', 'X-Requested-With', 'Set-Cookie'], // Tarayıcının bu header'ları okumasını sağlar
    maxAge: 86400,
    credentials: true, // Çerezlerin gönderilmesini sağla
  })
);




app.use(async (c, next) => {
  await next()

  //trigger the events that are required to trigger by the end of the request

  const ctx = getApiContext();
  const eventCallbackQueue = ctx.eventCallbackQueue
  const eventCallbackQueueAfterRequest = eventCallbackQueue.filter((callback) => callback.isAfterRequest)
  console.log(eventCallbackQueueAfterRequest, 'eventCallbackQueueAfterRequest')
  await Promise.all(eventCallbackQueue.filter((callback) => callback.isSync).map((callback) => callback.callback()));

  setTimeout(() => {
    eventCallbackQueueAfterRequest.filter((callback) => !callback.isSync).map((callback) => callback.callback())
  }, 0)



})




app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: async (opts, c) => {
      return await createTRPCContext(c)
    },
    onError: (opts) => {
      console.log(JSON.stringify(opts.error, null, 5), 'opts')
    }
  })
)


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
  .route('/character', characterApp)






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

