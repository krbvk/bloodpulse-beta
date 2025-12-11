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
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { BarChart } from "@mantine/charts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StatisticsLayout: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [monthsAhead, setMonthsAhead] = useState(12);

  const { data, isLoading } = api.statistics.predictBloodSupply.useQuery(
    { monthsAhead },
    { placeholderData: (previousData) => previousData }
  );

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
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

  const supply = data?.supply ?? [];
  const demand = data?.demand ?? [];

  // Generate buttons dynamically for months 1 through 12
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} Month${i + 1 > 1 ? "s" : ""}`,
    value: `${i + 1}`,
  }));

  return (
    <Box p="md">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={2}>
            Predictive Analysis - Next {monthsAhead} Month{monthsAhead > 1 ? "s" : ""}
          </Title>
          <Text c="dimmed" size="sm">
            Forecasts future blood donation supply and demand using TensorFlow AI.
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

      {/* Month Selector */}
      <SegmentedControl
        value={monthsAhead.toString()}
        onChange={(val) => setMonthsAhead(Number(val))}
        data={monthOptions}
        mb="md"
      />

      <div ref={reportRef}>
        {/* Supply Chart */}
        <Paper withBorder p="lg" radius="lg" shadow="sm" mb="lg">
          <Title order={5} mb="xs">
            Predicted Blood Supply - Next {monthsAhead} Month{monthsAhead > 1 ? "s" : ""}
          </Title>
          <Text size="sm" c="dimmed">
            Forecasted total future donations per blood type.
          </Text>
          <Box mt="md">
            {supply.length ? (
              <BarChart
                h={250}
                withLegend={false}
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
            Predicted Blood Demand - Next {monthsAhead} Month{monthsAhead > 1 ? "s" : ""}
          </Title>
          <Text size="sm" c="dimmed">
            Forecasted future blood requests per blood type.
          </Text>
          <Box mt="md">
            {demand.length ? (
              <BarChart
                h={250}
                withLegend={false}
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

        {/* Notes */}
        <Paper withBorder p="lg" radius="lg" shadow="sm">
          <Title order={5}>Key Prediction Notes</Title>
          <Text size="sm" mt="xs" c="dimmed">
            Model forecasts the next {monthsAhead} month{monthsAhead > 1 ? "s" : ""}.
            <br />
            Each blood type includes:
            <br />– Historical patterns
            <br />– Supply forecast
            <br />– Demand forecast
          </Text>

          {/* Supply Notes */}
          <Title order={6} mt="md">
            Supply (Donations)
          </Title>
          {supply.map((p) => (
            <div key={p.type} style={{ marginTop: 6 }}>
              <b>{p.type}</b> → Next Month: <b>{p.predicted[0]}</b>
            </div>
          ))}

          {/* Demand Notes */}
          <Title order={6} mt="md">
            Demand (Requests)
          </Title>
          {demand.map((p) => (
            <div key={p.type} style={{ marginTop: 6 }}>
              <b>{p.type}</b> → Next Month: <b>{p.predicted[0]}</b>
            </div>
          ))}
        </Paper>
      </div>
    </Box>
  );
};

export default StatisticsLayout;
