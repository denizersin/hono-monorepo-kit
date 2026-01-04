import { inferRouterInputs } from "@trpc/server";
import { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { authRouter } from "./auth";
import { constantsRouter } from "./constants";
import { characterRouter } from "./character";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
    auth: authRouter,   
    constants: constantsRouter,
    character: characterRouter,
    user: userRouter,
})


// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
