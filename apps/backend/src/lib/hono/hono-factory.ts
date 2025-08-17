import { createFactory } from "hono/factory";

import { SahredEnums } from "@repo/shared/enums";
import { AppBindings, TApiContextRaw } from "@server/lib/hono/types";
import db from "@server/modules/infrastructure/database";
import { languageDetector } from "hono/language";
import { EnumCookieKeys, EnumHeaderKeys } from "../enums";

import { getSafeSessionFromContext } from "@server/modules/shared/middlewares/auth";
import { AsyncLocalStorage } from 'async_hooks';
import { Hono } from "hono";
import { initApiContext } from "@server/lib/context";
import { handleAppError } from "../errors";
import { getCookie } from "hono/cookie";
import { TTheme } from "@repo/shared/types";

export const apiContext = new AsyncLocalStorage<TApiContextRaw>()



export default createFactory<AppBindings>({
  initApp: (app) => {
    app.onError((err, c) => {
      console.log('errr23')
      return handleAppError(c, err)
    })
    app.use(async (c, next) => {

      const session = await getSafeSessionFromContext(c)


      c.set("session", session)
      c.set("db", db);
      const companyId = c.req.header(EnumHeaderKeys.COMPANY_ID)
      const companyIdInt = session?.companyId || (companyId ? parseInt(companyId) : null)
      c.set("companyId", companyIdInt)
      const theme = getCookie(c, EnumCookieKeys.THEME)
      c.set("theme", theme as TTheme || SahredEnums.Theme.light)

      initApiContext({
        session,
        companyId: companyIdInt,
        trx: null,
        contextData: {},
        updateContextData: (data: unknown) => { },
        startTrx: async () => { },
        ip: c.req.header('x-forwarded-for') || null,
        eventCallbackQueue: []
      })



      await next()


    });


    app.use(
      //no need to set variable because it is already set itself globally !!
      languageDetector({
        supportedLanguages: SahredEnums.getEnumValues(SahredEnums.Language), // Must include fallback
        fallbackLanguage: SahredEnums.Language.en, // Required
        order: ['header', 'cookie'],
        cookieOptions: {
          sameSite: 'None'
        }
      })
    )

  },

});


export const createHonoApp = () => {
  return new Hono<AppBindings>()
}