import { postRouter } from "@/server/api/routers/post";
import { userRouter } from "@/server/api/routers/user";
import { donorRouter } from "@/server/api/routers/donor";
import { appointmentRouter } from "@/server/api/routers/appointment";
import { statisticsRouter } from "@/server/api/routers/statistics"; 
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { donationControlRouter } from "@/server/api/routers/control";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  donor: donorRouter,
  appointment: appointmentRouter,
  statistics: statisticsRouter,
  donationControl: donationControlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
