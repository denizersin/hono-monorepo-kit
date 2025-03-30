import { createFactory } from "hono/factory";

import { AppBindings } from "@server/lib/hono/types";
import db from "@server/modules/infrastructure/database";

export default createFactory<AppBindings>({
  initApp: (app) => {
    app.use(async (c, next) => {
      c.set("db", db);
      await next();
    });
    // app.use(async (c, next) => {
    // //   const auth = getAuth(c);
    // //   c.set("auth", auth);
    //   await next();
    // });
  },
});