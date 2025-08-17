import { AppRouter } from "@repo/backend/exports"
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCContext } from "@trpc/tanstack-react-query";

import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { makeQueryClient } from "./query-client";
import { useState } from "react";
import superjson from "superjson";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NEXT_ENV } from "@web/next-env";

/**
 * Why doesn't my tRPC request header include the cookie header?
 *
 * By default, fetch requests (which tRPC uses under the hood) do not send cookies unless
 * the `credentials` option is set to `"include"` (or `"same-origin"` for same-origin requests).
 * In the browser, you must explicitly set this option to ensure cookies are sent with requests.
 *
 * Solution: Set `fetch` in your tRPC link to use `credentials: "include"`.
 * See the `httpBatchLink` below.
 */

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    }
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}

export function TRPCReactProvider(
    props: Readonly<{
        children: React.ReactNode;
    }>,
) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: `${NEXT_ENV._runtime.NEXT_PUBLIC_API_URL}/trpc`,
                    transformer: superjson,
                    // Ensure cookies are sent with requests
                    fetch: (input, init) => {
                        return fetch(input, {
                            ...init,
                            //if this is not set, the cookie will not be sent
                            credentials: "include",
                        });
                    },
                }),
                loggerLink({
                    enabled: (opts) =>
                        NEXT_ENV._runtime.IS_DEV ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
            ],
        }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {props.children}
            </TRPCProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
}
