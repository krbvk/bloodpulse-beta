import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const donorRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.donor.findMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        bloodType: z.string().min(1),
        email: z
          .string()
          .email()
          .refine(
            (val) =>
              /@(gmail|yahoo|outlook|hotmail)\.com$/i.test(val),
            {
              message:
                "Email must be from gmail.com, yahoo.com, outlook.com, or hotmail.com",
            }
          ),
          phoneNumber: z.string().min(10).max(15).optional(),
          donationCount: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();

      const existingDonor = await ctx.db.donor.findUnique({
        where: { email },
      });

      if (existingDonor) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A donor with this email already exists.",
        });
      }

      return await ctx.db.donor.create({
        data: {
          name: input.name,
          bloodType: input.bloodType,
          email,
          phoneNumber: input.phoneNumber,
          donationCount: input.donationCount,
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

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.donor.delete({
        where: { id: input },
      });
    }),
});
