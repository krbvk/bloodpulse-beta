import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

type UserDemographics = {
  age: number | null;
  gender: string | null;
};

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
        contactnumber: true,
      },
    });
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        gender: z.string().optional(),
        age: z.number().optional(),
        contactnumber: z.string().optional(),
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
          contactnumber: input.contactnumber,
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

    getUserDemographics: publicProcedure.query(async ({ ctx }) => {
      const users: UserDemographics[] = await ctx.db.user.findMany({
        select: { age: true, gender: true },
      });

      const genderCounts: Record<string, number> = {};
      const ageGroups: Record<string, number> = {
        "0-17": 0,
        "18-25": 0,
        "26-35": 0,
        "36-50": 0,
        "51+": 0,
      };

      users.forEach((d: UserDemographics) => {
    // Count age groups safely
    if (typeof d.age === "number") {
      if (d.age < 18) ageGroups["0-17"] = (ageGroups["0-17"] ?? 0) + 1;
      else if (d.age <= 25) ageGroups["18-25"] = (ageGroups["18-25"] ?? 0) + 1;
      else if (d.age <= 35) ageGroups["26-35"] = (ageGroups["26-35"] ?? 0) + 1;
      else if (d.age <= 50) ageGroups["36-50"] = (ageGroups["36-50"] ?? 0) + 1;
      else ageGroups["51+"] = (ageGroups["51+"] ?? 0) + 1;
    }

    // Count gender safely
    if (d.gender) {
      genderCounts[d.gender] = (genderCounts[d.gender] ?? 0) + 1;
    }
  });

    const total = users.length || 1;

    const gender = Object.entries(genderCounts).map(([g, count]) => ({
      label: g,
      value: Math.round((count / total) * 100),
    }));

    const age = Object.entries(ageGroups).map(([label, count]) => ({
      label,
      value: Math.round((count / total) * 100),
    }));

    return { gender, age };
  }),

  getTotalUsers: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.user.count();
    return { count };
  }),
});

