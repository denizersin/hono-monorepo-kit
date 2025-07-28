export type { TErrorResponse } from "@server/lib/errors";
import { ENUM_ALL_EVENTS } from "@server/modules/application/event/interface";
import { AppType } from "../index";
import { routes } from '../index'
import { hc, InferRequestType, InferResponseType } from 'hono/client'

const test={
  name: 'test',
  age: 10,
  
}
export type { AppType }
export { test }


export const ROUTES = routes


// assign the client to a variable to calculate the type when compiling
export const client = hc<typeof routes>('')
export type Client = typeof client

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<typeof routes>(...args)



//request response types
type TGetSessionResponse = InferResponseType<typeof client.constants.countries.$get>['data']
