
import { ROUTES, } from "@repo/backend/exports"
import { hc } from "hono/client";
import { NEXT_ENV } from "@/next-env";


const client = hc<typeof ROUTES>("");
export type Client = typeof client;


export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof ROUTES>(...args);











import ky from "ky";









// Use environment variable for base URL
const baseUrl = NEXT_ENV._runtime.NEXT_PUBLIC_API_URL;
const kyapi = ky.extend({
  hooks: {
    beforeRequest: [(request) => {
      // console.log('request',request)
    }],
    // afterResponse: [

    // ],
  },
});

export const clientWithType = hcWithType(baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      const method = requestInit?.method ?? 'GET'
      return fetch(input, {
        method,
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        credentials: 'include',
        body: method === 'GET' ? null : requestInit?.body,
      })
    },

  }
)


