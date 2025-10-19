import { z } from "zod";
import { authProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
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
              /@(gmail|yahoo|outlook|hotmail)\.com$/i.test(val) ||
              /@student\.fatima\.edu\.ph$/i.test(val),
            {
              message:
                "Email must be from gmail.com, yahoo.com, outlook.com, hotmail.com, or student.fatima.edu.ph",
            }
          ),
        contactEmail: z.string().email().optional(),
        donationCount: z.number().min(0).default(0).optional(),
        gender: z.enum(["Male", "Female", "Other"]),
        age: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();

      const existingDonor = await ctx.db.donor.findUnique({ where: { email } });
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
          contactEmail: input.contactEmail,
          donationCount: input.donationCount,
          gender: input.gender,
          age: input.age,
        },
      });
    }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const donor = await ctx.db.donor.findUnique({ where: { id: input } });
      return donor ?? null;
    }),

  getDonorsByBloodType: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.donor.findMany({ where: { bloodType: input } });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.donor.delete({ where: { id: input } });
    }),

  update: authProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        bloodType: z.string().min(1),
        email: z
          .string()
          .email()
          .refine((val) =>
            /@(gmail|yahoo|outlook|hotmail)\.com$/i.test(val) ||
            /@student\.fatima\.edu\.ph$/i.test(val),
          ),
        contactEmail: z.string().email().optional(),
        donationCount: z.number().min(0).optional(),
        gender: z.enum(["Male", "Female", "Other"]),
        age: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const donor = await ctx.db.donor.findUnique({ where: { id: input.id } });
      if (!donor) throw new TRPCError({ code: "NOT_FOUND", message: "Donor not found" });

      if (input.email.toLowerCase() !== donor.email.toLowerCase()) {
        const existing = await ctx.db.donor.findUnique({ where: { email: input.email.toLowerCase() } });
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Another donor already uses this email." });
      }

      return await ctx.db.donor.update({
        where: { id: input.id },
        data: {
          name: input.name,
          bloodType: input.bloodType,
          email: input.email.toLowerCase(),
          contactEmail: input.contactEmail,
          donationCount: input.donationCount,
          gender: input.gender,
          age: input.age,
        },
      });
    }),

  getIsUserDonor: protectedProcedure.query(async ({ ctx }) => {
    const userEmail = ctx.session.user.email;

    const donor = await ctx.db.donor.findUnique({
      where: { email: userEmail ?? "" },
      select: { name: true, age: true, gender: true, donationCount: true, contactEmail: true, bloodType: true },
    });

    if (!donor) return null;

    return {
      isDonor: (donor.donationCount ?? 0) > 0,
      name: donor.name,
      age: donor.age,
      gender: donor.gender as "Male" | "Female" | "Other",
      donationCount: donor.donationCount ?? 0,
      contactEmail: donor.contactEmail ?? "",
      bloodType: donor.bloodType ?? null,
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        age: z.number().int().min(0),
        gender: z.enum(["Male", "Female", "Other"]),
        contactEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.session.user.email;

      // Fetch existing donor to preserve bloodType
      const existingDonor = await ctx.db.donor.findUnique({
        where: { email: userEmail ?? "" },
      });

      if (!existingDonor) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Donor not found" });
      }

      const updatedDonor = await ctx.db.donor.update({
        where: { email: userEmail ?? "" },
        data: {
          name: input.name,
          age: input.age,
          gender: input.gender,
          contactEmail: input.contactEmail,
          bloodType: existingDonor.bloodType, // preserve bloodType
          updatedAt: new Date(),
        },
      });

      return updatedDonor;
    }),


    
    
});
