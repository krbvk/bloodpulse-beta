import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { predictNext } from "@/server/ml/predictBloodSupply";
import { addMonths, startOfMonth, differenceInMonths } from "date-fns";

type MonthlyBloodStats = {
  month: string; // e.g., "2025-01"
  bloodType: string;
  donated: number;
  requested: number;
};
type Prediction = {
  type: string;
  history: number[];
  predicted: number[];
};


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
      "18-25": 0,
      "26-35": 0,
      "36-50": 0,
      "51+": 0,
    };

    donors.forEach((d: DonorDemographics) => {
  // Count age groups safely
  if (typeof d.age === "number") {
    if (d.age <= 25) ageGroups["18-25"] = (ageGroups["18-25"] ?? 0) + 1;
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

getPredictiveAnalysis: publicProcedure.query(async ({ ctx }) => {
  const appointments = await ctx.db.appointment.findMany({
    select: { bloodType: true, createdAt: true },
  });

  const donors = await ctx.db.donor.findMany({
    select: { bloodType: true, donationCount: true, lastDonatedAt: true },
  });

  // Aggregate donations and requests per month per blood type
  const monthlyStatsMap: Record<string, Record<string, { donated: number; requested: number }>> = {};

  // Collect all dates and ensure they are Date objects
  const allDatesRaw = [...appointments.map(a => a.createdAt), ...donors.map(d => d.lastDonatedAt)];
  const allDates: Date[] = allDatesRaw.filter((d): d is Date => d instanceof Date);

  if (allDates.length === 0) return { monthlyStats: [], predictive: {} };

  const firstDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const lastDate = new Date(Math.max(...allDates.map(d => d.getTime())));

  // Create month buckets
  const monthsCount =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (lastDate.getMonth() - firstDate.getMonth()) +
    1;

  for (let i = 0; i < monthsCount; i++) {
    const monthDate = addMonths(startOfMonth(firstDate), i);
    const monthKey: string = monthDate.toISOString().slice(0, 7); // YYYY-MM
    monthlyStatsMap[monthKey] ??= {} as Record<string, { donated: number; requested: number }>;
  }

  // Fill in donations using lastDonatedAt
  donors.forEach(d => {
    if (!(d.lastDonatedAt instanceof Date)) return;
    const bt = d.bloodType ?? "Unknown";
    const monthKey = d.lastDonatedAt.toISOString().slice(0, 7);
    monthlyStatsMap[monthKey] ??= {} as Record<string, { donated: number; requested: number }>;
    monthlyStatsMap[monthKey][bt] ??= { donated: 0, requested: 0 };
    monthlyStatsMap[monthKey][bt].donated += d.donationCount ?? 0;
  });

  // Fill in requests
  appointments.forEach(a => {
    if (!(a.createdAt instanceof Date)) return;
    const bt = a.bloodType ?? "Unknown";
    const monthKey = a.createdAt.toISOString().slice(0, 7);
    monthlyStatsMap[monthKey] ??= {} as Record<string, { donated: number; requested: number }>;
    monthlyStatsMap[monthKey][bt] ??= { donated: 0, requested: 0 };
    monthlyStatsMap[monthKey][bt].requested += 1;
  });

  // Convert map to array
  const monthlyStats: MonthlyBloodStats[] = [];
  for (const month of Object.keys(monthlyStatsMap)) {
    const bucket = monthlyStatsMap[month] ?? {};
    for (const bloodType of Object.keys(bucket)) {
      const stats = bucket[bloodType];
      if (!stats) continue;
      monthlyStats.push({
        month,
        bloodType,
        donated: stats.donated,
        requested: stats.requested,
      });
    }
  }

  // Predictive analysis
  const bloodTypes = Array.from(
    new Set([
      ...donors.map(d => d.bloodType ?? "Unknown"),
      ...appointments.map(a => a.bloodType ?? "Unknown"),
    ])
  );

  const predictive: Record<string, number> = {};
  bloodTypes.forEach(type => {
    let totalShortage = 0;
    let monthsWithData = 0;
    for (const month of Object.keys(monthlyStatsMap)) {
      const stats = monthlyStatsMap[month]?.[type];
      if (stats) {
        const shortage = Math.max(0, stats.requested - stats.donated);
        totalShortage += shortage;
        monthsWithData++;
      }
    }
    predictive[type] = monthsWithData > 0 ? Math.ceil((totalShortage / monthsWithData) * 12) : 0;
  });

  return { monthlyStats, predictive };
}),




    // predictive
predictBloodSupply: publicProcedure
  .input(z.object({ monthsAhead: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const months = input?.monthsAhead ?? 12;
    const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    // --- 1. Get SUPPLY from Donor model with lastDonatedAt ---
    const donors = await ctx.db.donor.findMany({
      select: { bloodType: true, donationCount: true, lastDonatedAt: true },
    });

    const supplyGrouped: Record<string, number[]> = {};
    bloodTypes.forEach((bt) => {
      supplyGrouped[bt] = Array.from({ length: 12 }, () => 0);
    });

    donors.forEach((d) => {
      if (!d.bloodType || !(d.lastDonatedAt instanceof Date)) return;
      const bt = d.bloodType;
      const history: number[] = supplyGrouped[bt] ??= Array.from({ length: 12 }, () => 0);

      const totalDonations = d.donationCount ?? 0;
      const monthIndex = d.lastDonatedAt.getMonth(); // Use lastDonatedAt to assign month
      history[monthIndex]! += totalDonations; // Add total donations to the last donated month
    });

    // --- 2. Get DEMAND from BloodRequest appointments ---
    const requests = await ctx.db.appointment.findMany({
      where: { subject: "BloodRequest" },
      select: { bloodType: true, datetime: true },
    });

    const demandGrouped: Record<string, number[]> = {};
    bloodTypes.forEach((bt) => {
      demandGrouped[bt] = Array.from({ length: 12 }, () => 0);
    });

    requests.forEach((req) => {
      if (!req.bloodType || !(req.datetime instanceof Date)) return;
      const bt = req.bloodType;
      const history: number[] = demandGrouped[bt] ??= Array.from({ length: 12 }, () => 0);

      const month = req.datetime.getMonth();
      history[month]! += 1;
    });

    // --- 3. Predict supply ---
    const supplyPredictions: Prediction[] = [];
    for (const bt of bloodTypes) {
      const history = supplyGrouped[bt] ??= Array(12).fill(0);
      if (history.some((v) => v > 0)) {
        const predicted: number[] = (await predictNext(history, months)).map(Number);
        supplyPredictions.push({ type: bt, history, predicted });
      }
    }

    // --- 4. Predict demand ---
    const demandPredictions: Prediction[] = [];
    for (const bt of bloodTypes) {
      const history = demandGrouped[bt] ??= Array(12).fill(0);
      if (history.some((v) => v > 0)) {
        const predicted: number[] = (await predictNext(history, months)).map(Number);
        demandPredictions.push({ type: bt, history, predicted });
      }
    }

    return {
      message: "Blood supply and demand prediction generated.",
      supply: supplyPredictions,
      demand: demandPredictions,
    };
  }),
});
