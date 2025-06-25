import { createFactory } from "hono/factory";

import { AppBindings } from "@server/lib/hono/types";
import db from "@server/modules/infrastructure/database";
import { SahredEnums } from "@repo/shared/enums";
import { languageDetector } from "hono/language";

export default createFactory<AppBindings>({
  initApp: (app) => {
    app.use(async (c, next) => {
      console.log(c.var.language,'langg')
      c.set("db", db);
      await next();
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