import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const statisticsRouter = createTRPCRouter({
  // === 1. Donation stats ===
  getDonationStatistics: publicProcedure.query(async ({ ctx }) => {
    const donors = await ctx.db.donor.findMany({
      select: { donationCount: true, gender: true },
    });

    if (!donors.length) {
      return {
        averageDonations: 0,
        genderComparison: { male: 0, female: 0, difference: 0 },
        trendPrediction: "Insufficient data",
      };
    }

    const totalDonations = donors.reduce((acc, d) => acc + (d.donationCount ?? 0), 0);
    const averageDonations = totalDonations / donors.length;

    const genderTotals: Record<string, number> = {};
    donors.forEach((d) => {
      if (!d.gender) return;
      genderTotals[d.gender] = (genderTotals[d.gender] ?? 0) + (d.donationCount ?? 0);
    });

    const male = genderTotals["Male"] ?? 0;
    const female = genderTotals["Female"] ?? 0;
    const difference = Math.abs(male - female);

    let trendPrediction = "Stable donation trend.";
    if (averageDonations > 3) trendPrediction = "High donor engagement expected.";
    else if (averageDonations < 1.5) trendPrediction = "Low donation frequency – consider outreach.";

    return {
      averageDonations: Number(averageDonations.toFixed(2)),
      genderComparison: { male, female, difference },
      trendPrediction,
    };
  }),

  // === 2. Blood shortage prediction ===
  getBloodShortagePrediction: publicProcedure.query(async ({ ctx }) => {
    const appointments = await ctx.db.appointment.findMany({
      select: { bloodType: true },
    });
    const donors = await ctx.db.donor.findMany({
      select: { bloodType: true, donationCount: true },
    });

    const needed: Record<string, number> = {};
    const donated: Record<string, number> = {};

    appointments.forEach((a) => {
      if (a.bloodType) needed[a.bloodType] = (needed[a.bloodType] ?? 0) + 1;
    });

    donors.forEach((d) => {
      if (d.bloodType) donated[d.bloodType] = (donated[d.bloodType] ?? 0) + (d.donationCount ?? 0);
    });

    const shortages = Object.keys(needed).map((bt) => ({
      type: bt,
      shortage: (needed[bt] ?? 0) - (donated[bt] ?? 0),
    }));

    const topShortages = shortages
      .filter((s) => s.shortage > 0)
      .sort((a, b) => b.shortage - a.shortage);

    return {
      shortages: topShortages.slice(0, 3),
      message:
        topShortages.length > 0
          ? "Some blood types may face shortages soon."
          : "No critical shortages predicted.",
    };
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
      req.causeOfBloodRequest?.trim()?.toLowerCase() || "unknown";
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
