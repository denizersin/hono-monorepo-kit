export type { TErrorResponse } from "@server/lib/errors";
export type { AppRouter, RouterInputs, RouterOutputs } from '@server/trpc/routers';
export type { TTrpcErrorServer } from '@server/trpc/init';
export { test };

import { hc } from 'hono/client';
import { routes } from "../index";
export type { TBaseEventLogData } from "@server/modules/application/event/interface";

const test = {
  name: 'test',
  age: 10,

}

export type AppType = typeof routes

export const ROUTES = routes


// assign the client to a variable to calculate the type when compiling
export const client = hc<AppType>('')
export type Client = typeof client

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<AppType>(...args)


