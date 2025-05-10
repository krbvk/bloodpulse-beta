import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const donorRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.donor.findMany();
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), bloodType: z.string().min(1), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.donor.create({
        data: {
          name: input.name,
          bloodType: input.bloodType,
          email: input.email,
        },
      });
    }),

  getById: publicProcedure
    .input(z.string()) 
    .query(async ({ ctx, input }) => {
      const donor = await ctx.db.donor.findUnique({
        where: { id: input },
      });
      return donor ?? null;
    }),

  getDonorsByBloodType: publicProcedure
    .input(z.string()) 
    .query(async ({ ctx, input }) => {
      return await ctx.db.donor.findMany({
        where: { bloodType: input },
      });
    }),

});
