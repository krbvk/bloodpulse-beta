import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const donationControlRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const record = await ctx.db.donationControl.findFirst();
    return record?.enabled ?? false;
  }),

  toggle: protectedProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      // Log for debugging
      console.log("[SERVER] Toggle input:", input);

      // Use upsert so record is created if it doesn't exist
      const updated = await ctx.db.donationControl.upsert({
        where: { id: 1 },
        update: { enabled: input.enabled },
        create: { id: 1, enabled: input.enabled },
      });

      console.log("[SERVER] Donation control updated:", updated);

      return updated;
    }),
});