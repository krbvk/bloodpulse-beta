// src/server/api/routers/user.ts
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        gender: true,
        age: true,
        image: true,
      },
    });
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        gender: z.string().optional(),
        age: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.db.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          gender: input.gender,
          age: input.age,
        },
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.db.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }),
});
