import { createFactory } from "hono/factory";

import { SahredEnums } from "@repo/shared/enums";
import { AppBindings, TApiContextRaw } from "@server/lib/hono/types";
import db from "@server/modules/infrastructure/database";
import { languageDetector } from "hono/language";
import { EnumHeaderKeys } from "../enums";

import { getSafeSessionFromContext } from "@server/modules/shared/middlewares/auth";
import { AsyncLocalStorage } from 'async_hooks';
import { Hono } from "hono";
import { initApiContext } from "./utils";

export const apiContext = new AsyncLocalStorage<TApiContextRaw>()



export default createFactory<AppBindings>({
  initApp: (app) => {
    app.use(async (c, next) => {

      const session = await getSafeSessionFromContext(c)
      c.set("session", session)
      c.set("db", db);
      const companyId = c.req.header(EnumHeaderKeys.COMPANY_ID)
      const companyIdInt = session?.companyId || (companyId ? parseInt(companyId) : null)
      c.set("companyId", companyIdInt)

      initApiContext({
        session,
        companyId: companyIdInt,
        trx: null,
        contextData: {},
        updateContextData: (data: unknown) => { },
        startTrx: async () => { },
        ip: c.req.header('x-forwarded-for') || null
      })



      await next()


    });


    app.use(
      //no need to set variable because it is already set itself globally !!
      languageDetector({
        supportedLanguages: SahredEnums.getEnumValues(SahredEnums.Language), // Must include fallback
        fallbackLanguage: SahredEnums.Language.en, // Required
        order: ['header', 'cookie']
      })
    )

  },
});


export const createHonoApp = () => {
  return new Hono<AppBindings>()
}