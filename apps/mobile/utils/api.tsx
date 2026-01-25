import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, httpLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { AppRouter } from "@repo/backend/exports"



// import { authClient } from "./auth";
// import { getBaseUrl } from "./base-url";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    },
  },
});

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
        colorMode: "ansi",
      }),
      httpBatchLink({
        transformer: superjson,
        url: `http://localhost:3002/trpc`,
        headers() {
          const headers = new Map<string, string>();
          headers.set("x-trpc-source", "expo-react");
          headers.set("Content-Type", "application/json");


          //   const cookies = authClient.getCookie();
          //   if (cookies) {
          //     headers.set("Cookie", cookies);
          //   }
          return headers;
        },
        fetch: async (input, init) => {
          const response = await fetch(input, {
            ...init,
          });
          // Debug: clone and log raw response
          // const cloned = response.clone();
          // const text = await cloned.text();
          // console.log("RAW TRPC RESPONSE:", text);
          // console.log("RESPONSE STATUS:", response.status);
          return response;
        },
      }),
    ],
  }),
  queryClient,
});

export type { RouterInputs, RouterOutputs } from "@repo/backend/exports";
