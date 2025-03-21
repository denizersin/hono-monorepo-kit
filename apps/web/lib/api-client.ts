import { hcWithType } from "@repo/api-client";
import ky from "ky";

const baseUrl = 'http://localhost:3002'
const kyapi = ky.extend({
    hooks: {
        beforeRequest: [(request) => { 
            // console.log('request',request)
        }],
        afterResponse: [
            (_, __, response: Response) => {
                // console.log('response',response);
                if (response.ok) {
                    return response;
                } else if (response.status === 401) {
                    // TODO 
                    throw new Error(response.statusText);
                } else {
                    throw new Error(response.statusText);
                }
            },
        ],
    },
});

export const clientWithType = hcWithType(baseUrl,
    {
        fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
            const method = requestInit?.method ?? 'GET'
          return kyapi(input, {
            method,
            headers: {
              'content-type': 'application/json',
              ...requestInit?.headers,
            },
            body: method === 'GET' ? null : requestInit?.body,
          }).then((res) => {
            if (res.status === 401) {
              window.location.href = '/login'
            }
            return res
          })
        },
      }
)
