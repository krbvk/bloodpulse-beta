import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      await ctx.db.user.delete({
        where: { id: userId },
      });

      return { success: true };
    }),
});
