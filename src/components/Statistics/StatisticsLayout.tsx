"use client";

import { useRef } from "react";
import {
  Box,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Group,
  Button,
  Loader,
} from "@mantine/core";
import { IconDownload, IconTrendingUp } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { BarChart } from "@mantine/charts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PredictLayout from "@/components/Statistics/PredictLayout";


const StatisticsLayout: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  
  const { data: bloodRequestReasons, isLoading: loadingReasons } =
    api.statistics.getBloodRequestReasonsStats.useQuery();

  const { data: neededVsDonated, isLoading: loadingBlood } =
    api.statistics.getNeededVsDonated.useQuery();

  const { data: demographics, isLoading: loadingDemo } =
    api.statistics.getDonorDemographics.useQuery();

    
  // 📄 Generate PDF function
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const input = reportRef.current;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save("Bloodpulse_Statistics_Report.pdf");
  };

  if (loadingBlood || loadingDemo || loadingReasons) {
    return (
      <Box p="xl" ta="center">
        <Loader />
        <Text mt="sm" c="dimmed">
          Loading statistics...
        </Text>
      </Box>
    );
  }

  return (
    <Box p="md">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={2}>Statistics & Analysis</Title>
          <Text c="dimmed" size="sm">
            Analytical insights, comparisons, and trends derived from metrics
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

      <div ref={reportRef}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* === Average Donations per Blood Type === */}
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">
              Average Donations per Blood Type
            </Title>
            <Text size="sm" c="dimmed">
              Displays the average number of donations made for each blood type.
            </Text>

            <Box mt="md">
              {neededVsDonated && neededVsDonated.bloodTypeStats.length > 0 ? (
                <>
                  <BarChart
                    h={220}
                    withLegend={false}
                    data={neededVsDonated.bloodTypeStats.map((b) => ({
                      name: b.type,
                      Donated: b.donated,
                      Needed: b.needed,
                    }))}
                    dataKey="name"
                    series={[
                      { name: "Donated", color: "teal" },
                      { name: "Needed", color: "red" },
                    ]}
                  />

                  <Box mt="sm">
                    {neededVsDonated.bloodTypeStats.map((b, i) => (
                      <Group key={i} gap="xs" justify="space-between" mb={4}>
                        <Group gap="xs">
                          <Box
                            w={10}
                            h={10}
                            bg="teal"
                            style={{ borderRadius: "50%" }}
                          />
                          <Text size="sm" fw={500}>
                            {b.type}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Donated: <b>{b.donated}</b> | Needed:{" "}
                          <b style={{ color: "red" }}>{b.needed}</b>
                        </Text>
                      </Group>
                    ))}
                  </Box>
                </>
              ) : (
                <Text ta="center" c="dimmed">
                  No blood type data available
                </Text>
              )}
            </Box>
          </Paper>

          {/* === Blood Type Balance Overview === */}
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">
              Blood Type Balance Overview
            </Title>
            <Text size="sm" c="dimmed">
              Compares donations versus needs to show which blood types have
              surplus or shortage.
            </Text>

            <Box mt="md">
              {neededVsDonated && neededVsDonated.bloodTypeStats.length > 0 ? (
                <>
                  <BarChart
                    h={220}
                    withLegend={false}
                    data={neededVsDonated.bloodTypeStats.map((b) => ({
                      name: b.type,
                      Surplus: b.donated - b.needed,
                    }))}
                    dataKey="name"
                    series={[{ name: "Surplus", color: "teal" }]}
                  />

                  <Box mt="sm">
                    {neededVsDonated.bloodTypeStats.map((b, i) => {
                      const diff = b.donated - b.needed;
                      return (
                        <Group key={i} justify="space-between" mb={4}>
                          <Text size="sm" fw={500}>
                            {b.type}
                          </Text>
                          <Text
                            size="sm"
                            c={diff >= 0 ? "teal" : "red"}
                            fw={600}
                          >
                            {diff >= 0
                              ? `+${diff} surplus`
                              : `${diff} shortage`}
                          </Text>
                        </Group>
                      );
                    })}
                  </Box>
                </>
              ) : (
                <Text ta="center" c="dimmed">
                  No blood type balance data available
                </Text>
              )}
            </Box>
          </Paper>
        </SimpleGrid>

        {/* === Gender-based Donation Analysis === */}
        <Paper withBorder p="lg" radius="lg" shadow="sm" mt="lg">
          <Title order={5} mb="xs">
            Gender-based Donation Analysis
          </Title>
          <Text size="sm" c="dimmed">
            Compares how many percent of donors are male or female.
          </Text>

          <Box mt="md">
            {demographics && demographics.gender.length > 0 ? (
              <>
                <BarChart
                  h={220}
                  withLegend={false}
                  data={demographics.gender}
                  dataKey="label"
                  series={[{ name: "value", color: "blue" }]}
                />

                <Box mt="sm">
                  {demographics.gender.map((g, i) => (
                    <Group
                      key={i}
                      gap="xs"
                      justify="space-between"
                      mb={4}
                    >
                      <Group gap="xs">
                        <Box
                          w={10}
                          h={10}
                          bg="blue"
                          style={{ borderRadius: "50%" }}
                        />
                        <Text size="sm" fw={500}>
                          {g.label}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        <b>{g.value}</b>%
                      </Text>
                    </Group>
                  ))}
                </Box>
              </>
            ) : (
              <Text c="dimmed">No gender data available</Text>
            )}
          </Box>
        </Paper>

        
        {/* === Blood Request Reasons === */}
        <Paper withBorder p="lg" radius="lg" shadow="sm" mt="lg">
          <Title order={5} mb="xs">
            Blood Request Reasons
          </Title>
          <Text size="sm" c="dimmed">
            Displays the most common reasons patients request blood.
          </Text>

          <Box mt="md">
            {bloodRequestReasons?.reasons?.length ? (
              <>
                <BarChart
                  h={220}
                  withLegend={false}
                  data={bloodRequestReasons.reasons}
                  dataKey="name"
                  series={[{ name: "count", color: "orange" }]}
                />

                <Box mt="sm">
                  {bloodRequestReasons.reasons.map((r, i) => (
                    <Group key={i} justify="space-between" mb={4}>
                      <Text size="sm" fw={500}>
                        {r.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {r.count} requests
                      </Text>
                    </Group>
                  ))}
                </Box>
              </>
            ) : (
              <Text ta="center" c="dimmed">
                No blood request data available
              </Text>
            )}
          </Box>
        </Paper>
        
        

      <Paper withBorder p="lg" radius="lg" shadow="sm" mt="lg">
  <Group>
    <IconTrendingUp color="red" />
    <Title order={5}>Key Observations</Title>
  </Group>
  <Text size="sm" mt="xs" c="dimmed">
    - {neededVsDonated?.mostDonated?.type ?? "N/A"} remains the most donated blood type.
    <br />
    - {neededVsDonated?.mostNeeded?.type ?? "N/A"} shows the highest demand among patients.
    <br />
    - Majority of donors are in the 18–25 age group.
    <br />
    - Male donors account for approximately{" "}
    {demographics?.gender?.find((g) => g.label === "Male")?.value ?? "N/A"}%
    of total donors.
    <br />
    - The most common reason for blood requests is{" "}
    <b>
      {bloodRequestReasons?.reasons?.[0]?.name ?? "not yet recorded"}
    </b>
    , with{" "}
    {bloodRequestReasons?.reasons?.[0]?.count ?? 0} requests.
  </Text>
</Paper>

<PredictLayout />
      </div>
    </Box>
  );
};

export default StatisticsLayout;
