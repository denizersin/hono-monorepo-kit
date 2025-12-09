export type { TErrorResponse } from "@server/lib/errors";
export type { AppRouter, RouterInputs, RouterOutputs } from '@server/trpc/routers';
export type { TTrpcErrorServer } from '@server/trpc/init';
export { test };
export type { AppType };
import { hc } from 'hono/client';
import { AppType, routes } from "../index";
export type { TBaseEventLogData } from "@server/modules/application/event/interface";

const test = {
  name: 'test',
  age: 10,

}


export const ROUTES = routes


// assign the client to a variable to calculate the type when compiling
export const client = hc<typeof routes>('')
export type Client = typeof client

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<typeof routes>(...args)


