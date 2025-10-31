import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type BloodTypeStats = {
  type: string;
  needed: number;
  donated: number;
};

type DonorDemographics = {
  age: number | null;
  gender: string | null;
};

export const statisticsRouter = createTRPCRouter({
  getNeededVsDonated: publicProcedure.query(async ({ ctx }) => {
    const appointments = await ctx.db.appointment.findMany({
      select: { bloodType: true },
    });
    const donors = await ctx.db.donor.findMany({
      select: { bloodType: true, donationCount: true },
    });

    const neededCounts: Record<string, number> = {};
    const donatedCounts: Record<string, number> = {};

    // Count needed blood types from appointments
    appointments.forEach((r: { bloodType: string | null }) => {
      if (r.bloodType) {
        const bt = r.bloodType;
        neededCounts[bt] = (neededCounts[bt] ?? 0) + 1;
      }
    });

    // Count donated blood types based on donationCount
    donors.forEach((d: { bloodType: string | null; donationCount: number | null }) => {
      if (d.bloodType) {
        const bt = d.bloodType;
        const count = d.donationCount ?? 0;
        donatedCounts[bt] = (donatedCounts[bt] ?? 0) + count;
      }
    });

    const allTypes = Array.from(
      new Set([...Object.keys(neededCounts), ...Object.keys(donatedCounts)])
    );

    const bloodTypeStats: BloodTypeStats[] = allTypes.map((bt) => ({
      type: bt,
      needed: neededCounts[bt] ?? 0,
      donated: donatedCounts[bt] ?? 0,
    }));

    const mostNeeded =
      bloodTypeStats.reduce<BloodTypeStats | null>(
        (prev, curr) => (!prev || curr.needed > prev.needed ? curr : prev),
        null
      ) ?? { type: "", needed: 0, donated: 0 };

    const mostDonated =
      bloodTypeStats.reduce<BloodTypeStats | null>(
        (prev, curr) => (!prev || curr.donated > prev.donated ? curr : prev),
        null
      ) ?? { type: "", needed: 0, donated: 0 };

    return {
      bloodTypeStats,
      mostNeeded,
      mostDonated,
    };
  }),

  getDonorDemographics: publicProcedure.query(async ({ ctx }) => {
    const donors: DonorDemographics[] = await ctx.db.donor.findMany({
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

    donors.forEach((d: DonorDemographics) => {
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


    const total = donors.length || 1;

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

   // === 3. Blood request reasons statistics ===
getBloodRequestReasonsStats: publicProcedure.query(async ({ ctx }) => {
  const requests = await ctx.db.appointment.findMany({
    select: { causeOfBloodRequest: true },
  });

  if (!requests.length) {
    return { message: "No blood request data found.", reasons: [] };
  }

  const reasonsCount: Record<string, number> = {};

  for (const req of requests) {
    const cause =
      req.causeOfBloodRequest?.trim()?.toLowerCase() ?? "unknown";
    reasonsCount[cause] = (reasonsCount[cause] ?? 0) + 1;
  }

  // Convert to array for charts or tables
  const reasons = Object.entries(reasonsCount)
    .map(([name, count]) => ({
      name:
        name
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "Unknown",  
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    message: "Blood request reason statistics fetched successfully.",
    totalRequests: requests.length,
    reasons,
  };
}),
});
