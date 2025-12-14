"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Loader,
  SegmentedControl,
  Select,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { BarChart, LineChart } from "@mantine/charts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BloodToolTip } from "@/components/Statistics/BloodToolTip";

const PredictLayout: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Only one option: Predict Next Year
  const monthsAhead = 12;

  const {
    data: supplyDemandData,
    isLoading: supplyDemandLoading,
    error: supplyDemandError,
  } = api.statistics.predictBloodSupply.useQuery(
    { monthsAhead },
    { placeholderData: (previousData) => previousData }
  );

  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
  } = api.statistics.getPredictiveAnalysis.useQuery();

  const isLoading = supplyDemandLoading || analysisLoading;
  const error = supplyDemandError ?? analysisError;

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    // small delay to ensure client-rendered charts finish painting
    await new Promise((r) => setTimeout(r, 300));

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidthMm = pdf.internal.pageSize.getWidth();
    const pageHeightMm = pdf.internal.pageSize.getHeight();

    // compute how many vertical pixels correspond to one PDF page
    const pageHeightPx = Math.floor((canvas.width * pageHeightMm) / pageWidthMm);

    let remainingHeight = canvas.height;
    let position = 0;

    while (remainingHeight > 0) {
      const sliceHeight = Math.min(pageHeightPx, remainingHeight);
      const canvasSlice = document.createElement("canvas");
      canvasSlice.width = canvas.width;
      canvasSlice.height = sliceHeight;

      const ctx = canvasSlice.getContext("2d");
      if (!ctx) break;

      ctx.drawImage(canvas, 0, position, canvas.width, sliceHeight, 0, 0, canvasSlice.width, canvasSlice.height);

      const sliceData = canvasSlice.toDataURL("image/png");

      const sliceHeightMm = (sliceHeight * pageWidthMm) / canvas.width;

      pdf.addImage(sliceData, "PNG", 0, 0, pageWidthMm, sliceHeightMm);

      remainingHeight -= sliceHeight;
      position += sliceHeight;

      if (remainingHeight > 0) pdf.addPage();
    }

    pdf.save("Bloodpulse_Prediction_Report.pdf");
  };

  if (isLoading) {
    return (
      <Box p="xl" ta="center">
        <Loader />
        <Text mt="sm" c="dimmed">
          Loading predictive analysis...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="xl" ta="center">
        <Text color="red">Error: {String(error?.message ?? error)}</Text>
      </Box>
    );
  }

  const supply = supplyDemandData?.supply ?? [];
  const demand = supplyDemandData?.demand ?? [];

  // Month Selector - single option only
  const monthOptions = [{ label: "Predict Next Year", value: "12" }];

  if (!analysisData) {
    return (
      <Box p="xl" ta="center">
        <Text>No predictive analysis data available</Text>
      </Box>
    );
  }

  const months = Array.from(new Set(analysisData.monthlyStats.map((m) => m.month))).sort();

  const formatMonth = (monthStr: string) => {
    const parts = monthStr.split("-");
    const year = Number(parts[0] ?? NaN) || 1970;
    const month = Number(parts[1] ?? NaN) || 1;
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const formattedMonths = months.map(formatMonth);

  const filteredMonths = selectedMonth && selectedMonth !== "All Months" ? [selectedMonth] : formattedMonths;

  const monthlyTotals = filteredMonths.map((monthLabel) => {
    const index = formattedMonths.indexOf(monthLabel);
    const month = months[index];

    const statsForMonth = analysisData.monthlyStats.filter((m) => m.month === month);

    return {
      month: monthLabel,
      Donated: statsForMonth.reduce((sum, m) => sum + m.donated, 0),
      Requested: statsForMonth.reduce((sum, m) => sum + m.requested, 0),
    };
  });

  const lineChartData = formattedMonths.map((monthLabel) => {
    const index = formattedMonths.indexOf(monthLabel);
    const month = months[index];

    const statsForMonth = analysisData.monthlyStats.filter((m) => m.month === month);

    return {
      month: monthLabel,
      Donated: statsForMonth.reduce((sum, m) => sum + m.donated, 0),
      Requested: statsForMonth.reduce((sum, m) => sum + m.requested, 0),
    };
  });

  return (
    <Box p="md" ref={reportRef}>
      <Group justify="space-between" mt="5%">
        <div>
          <Title order={2}>Predictive Analysis - Predict Next Year</Title>
          <Text c="dimmed" size="sm">
            Forecasts future blood donation supply and demand using TensorFlow.
          </Text>
        </div>

        <Button
          leftSection={<IconDownload size={16} />}
          variant="outline"
          onClick={handleExportPDF}
        >
          Export Report
        </Button>
      </Group>

      {/* Bar Chart Container */}
      <Paper withBorder p="lg" radius="lg" shadow="sm" mt="lg" mb="lg">
        <Title order={5} mb="xs">
          Monthly Blood Donations vs Requests
        </Title>
        <Text size="sm" c="dimmed" mb="sm">
          Tracks the total number of blood units donated and requested per month.
        </Text>

        <Select
          label="Select Month"
          placeholder="All Months"
          data={["All Months", ...formattedMonths]}
          value={selectedMonth ?? "All Months"}
          onChange={(value) => setSelectedMonth(value === "All Months" ? null : value)}
          mb="md"
        />

        <Box mt="md">
          {monthlyTotals.length > 0 ? (
            <BarChart
              h={300}
              withLegend
              tooltipProps={{content: <BloodToolTip />}}
              data={monthlyTotals}
              dataKey="month"
              series={[
                { name: "Donated", color: "teal" },
                { name: "Requested", color: "red" },
              ]}
            />
          ) : (
            <Text ta="center" c="dimmed">
              No data available
            </Text>
          )}
        </Box>
      </Paper>

      {/* Line Chart Container */}
      <Paper withBorder p="lg" radius="lg" shadow="sm" mt="lg" mb="lg" >
        <Title order={5} mb="xs">
          Blood Donations & Requests Trend
        </Title>
        <Text size="sm" c="dimmed" mb="sm">
          Shows the trend of donated and requested blood units across all months.
        </Text>

        <Box mt="md">
          {lineChartData.length > 0 ? (
            <LineChart
              h={300}
              withLegend
              tooltipProps={{content: <BloodToolTip />}}
              data={lineChartData}
              dataKey="month"
              series={[
                { name: "Donated", color: "teal" },
                { name: "Requested", color: "red" },
              ]}
            />
          ) : (
            <Text ta="center" c="dimmed">
              No data available
            </Text>
          )}
        </Box>
      </Paper>

      {/* Month Selector */}
      <SegmentedControl value="12" data={monthOptions} mb="md" />

  <div>
        {/* Supply Chart */}
        <Paper withBorder p="lg" radius="lg" shadow="sm" mb="lg">
          <Title order={5} mb="xs">
            Predicted Blood Supply - Predict Next Year
          </Title>
          <Text size="sm" c="dimmed">
            Forecasted total future donations per blood type.
          </Text>
          <Box mt="md">
            {supply.length ? (
              <BarChart
                h={250}
                withLegend={false}
                tooltipProps={{content: <BloodToolTip />}}
                data={supply.map((p) => ({
                  name: p.type,
                  predicted: p.predicted[0],
                }))}
                dataKey="name"
                series={[{ name: "predicted", color: "teal" }]}
              />
            ) : (
              <Text ta="center" c="dimmed">
                No supply prediction data available
              </Text>
            )}
          </Box>
        </Paper>

        {/* Demand Chart */}
        <Paper withBorder p="lg" radius="lg" shadow="sm" mb="lg">
          <Title order={5} mb="xs">
            Predicted Blood Demand - Predict Next Year
          </Title>
          <Text size="sm" c="dimmed">
            Forecasted future blood requests per blood type.
          </Text>
          <Box mt="md">
            {demand.length ? (
              <BarChart
                h={250}
                withLegend={false}
                tooltipProps={{content: <BloodToolTip />}}
                data={demand.map((p) => ({
                  name: p.type,
                  demand: p.predicted[0],
                }))}
                dataKey="name"
                series={[{ name: "demand", color: "red" }]}
              />
            ) : (
              <Text ta="center" c="dimmed">
                No demand prediction data available
              </Text>
            )}
          </Box>
        </Paper>

      {/* Key Prediction Notes */}
<Paper withBorder p="lg" radius="lg" shadow="sm">
  <Title order={5} mb="xs">
    Annual Blood Supply & Demand Forecast
  </Title>

  <Text size="sm" c="dimmed" lh={1.6}>
    This report summarizes the projected blood supply and demand for the
    upcoming year, based on historical utilization patterns and predictive
    modeling. The key components of the analysis include:
  </Text>

  <Box component="ul" mt="sm" pl={20} style={{ listStyle: "disc" }}>
    <li>Historical donation and request trend evaluation</li>
    <li>Forecasted donation volumes across all blood types</li>
    <li>Projected patient demand and anticipated utilization</li>
  </Box>

  <Title order={6} mt="lg" mb={4}>
    Forecasted Donation Volume
  </Title>
  {supply.map((p) => (
    <Text key={p.type} size="sm" mt={2} lh={1.5}>
      <b>{p.type}</b>: Expected next year donation of blood — <b>{p.predicted[0]}</b>
    </Text>
  ))}

  <Title order={6} mt="lg" mb={4}>
    Forecasted Demand Volume
  </Title>
  {demand.map((p) => (
    <Text key={p.type} size="sm" mt={2} lh={1.5}>
      <b>{p.type}</b>: Expected next year demand of blood — <b>{p.predicted[0]}</b>
    </Text>
  ))}
</Paper>

<Paper withBorder p="lg" radius="lg" shadow="sm" mt="lg">
  <Title order={5} mb="xs">
    Summary & Insights
  </Title>

  <Text size="sm" c="dimmed" lh={1.6}>
    Overall, the forecast indicates notable differences between projected
    donations and expected demand across several blood types. These
    projections help identify potential shortages, stability, or surpluses
   next year. The highlights of the analysis are as follows:
  </Text>

  <Box component="ul" mt="sm" pl={20} style={{ listStyle: "disc" }}>
    {supply.map((s) => {
      const match = demand.find((d) => d.type === s.type);
      const supplyValue = s.predicted?.[0] ?? 0;
      const demandValue = match?.predicted?.[0] ?? 0;

      return (
        <li key={s.type} style={{ marginTop: 6 }}>
          <Text size="sm">
            <b>{s.type}</b>: Projected supply is <b>{supplyValue}</b> units, while
            projected demand is <b>{demandValue}</b> units —{" "}
            {supplyValue > demandValue ? (
              <span style={{ color: "green" }}>expected surplus</span>
            ) : supplyValue < demandValue ? (
              <span style={{ color: "red" }}>potential shortage</span>
            ) : (
              <span>balanced forecast</span>
            )}
            .
          </Text>
        </li>
      );
    })}
  </Box>

  <Text size="sm" mt="md" lh={1.6}>
    These insights provide a clear picture of where the blood supply is
    likely to meet or fall short of demand, supporting strategic planning
    for collection drives, inventory management, and hospital distribution.
  </Text>
</Paper>


      </div>
    </Box>
  );
};

export default PredictLayout;
