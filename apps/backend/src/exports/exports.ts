export type { TErrorResponse } from "@server/lib/errors";
import { AppType } from "../index";
import { routes } from '../index'
import { hc } from 'hono/client'

const test={
  name: 'test',
  age: 10,
  
}
export type { AppType }
export { test }


export const ROUTES = routes


// assign the client to a variable to calculate the type when compiling
const client = hc<typeof routes>('')
export type Client = typeof client

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<typeof routes>(...args)


