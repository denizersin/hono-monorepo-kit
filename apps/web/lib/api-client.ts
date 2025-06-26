import { hcWithType, TErrorResponse } from "@repo/api-client";
import ky from "ky";
import { tryCatch } from "@repo/shared/utils";
import { ClientResponse } from "hono/client";
const baseUrl = 'http://localhost:3002'
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


