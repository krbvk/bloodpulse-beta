"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Group,
  Title,
  Text,
  Badge,
  Divider,
  RingProgress,
  Progress,
  Stack,
  ThemeIcon,
  SimpleGrid,
  useMantineTheme,
  Menu,
  Button,
} from "@mantine/core";
import {
  IconDroplet,
  IconUsers,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDownload,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import { api } from "@/trpc/react";
import type { FileChild } from "docx";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

/* ------------------------------- Types --------------------------------- */
type Demographic = { label: string; value: number };
type BloodTypeStat = { type: string; needed: number; donated: number };

/* --------------------------- Helper utils ------------------------------- */

async function dataUrlToUint8Array(dataUrl: string): Promise<Uint8Array> {
  const res = await fetch(dataUrl);
  const ab = await res.arrayBuffer();
  return new Uint8Array(ab);
}

/* ---------------------------- Small Components -------------------------- */

function StatCard({
  label,
  value,
  icon,
  delta,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: number;
}) {
  const isUp = (delta ?? 0) >= 0;
  return (
    <Paper withBorder p="md" radius="lg" shadow="sm">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          <Text fw={700} fz={28}>
            {value}
          </Text>
          {typeof delta === "number" && (
            <Group gap={6}>
              <ThemeIcon size="sm" radius="xl" color={isUp ? "green" : "red"} variant="light">
                {isUp ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
              </ThemeIcon>
              <Text size="sm" c={isUp ? "green.7" : "red.7"} fw={600}>
                {Math.abs(delta)}%
              </Text>
              <Text size="xs" c="dimmed">
                vs last month
              </Text>
            </Group>
          )}
        </Stack>
        <ThemeIcon size="lg" radius="md" color="red" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

/* ----------------------------- Chart components ------------------------ */

function BloodTypeChart({ bloodTypeStats }: { bloodTypeStats: BloodTypeStat[] }) {
  const mostNeeded = bloodTypeStats.reduce(
    (a, b) => (b.needed > a.needed ? b : a),
    { type: "", needed: 0, donated: 0 }
  );
  const mostDonated = bloodTypeStats.reduce(
    (a, b) => (b.donated > a.donated ? b : a),
    { type: "", needed: 0, donated: 0 }
  );

  return (
    <Box style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bloodTypeStats}
          layout="vertical"
          margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="type" type="category" width={40} />
          <Tooltip />
          <Bar dataKey="needed" name="Needed">
            {bloodTypeStats.map((entry, idx) => (
              <Cell key={`needed-${idx}`} fill={entry.type === mostNeeded.type ? "#e03131" : "#ffa8a8"} />
            ))}
          </Bar>
          <Bar dataKey="donated" name="Donated">
            {bloodTypeStats.map((entry, idx) => (
              <Cell key={`donated-${idx}`} fill={entry.type === mostDonated.type ? "#1971c2" : "#a5d8ff"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function NeededBloodTypePieChart({ data }: { data: { type: string; percentage: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="percentage" nameKey="type" cx="50%" cy="50%" outerRadius={100} label={({ type }) => String(type)}>
          {data.map((_, index) => (
            <Cell key={`needed-pie-${index}`} fill={["#e03131", "#ffa8a8", "#fab005", "#845ef7", "#f59f00", "#1971c2"][index % 6]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function DonatedBloodTypePieChart({ data }: { data: { type: string; percentage: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="percentage" nameKey="type" cx="50%" cy="50%" outerRadius={100} label={({ type }) => String(type)}>
          {data.map((_, index) => (
            <Cell key={`donated-pie-${index}`} fill={["#1971c2", "#a5d8ff", "#fab005", "#5f3dc4", "#e03131", "#ffa8a8"][index % 6]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ---------------------------- Main page -------------------------------- */

const StatisticsLayout: React.FC = () => {
  const theme = useMantineTheme();

  // API queries (keep as you already had)
  const { data: neededVsDonated } = api.statistics.getNeededVsDonated.useQuery();
  const { data: demographics } = api.statistics.getDonorDemographics.useQuery();

  // Refs for capturing charts
  const barChartRef = useRef<HTMLDivElement | null>(null);
  const neededPieRef = useRef<HTMLDivElement | null>(null);
  const donatedPieRef = useRef<HTMLDivElement | null>(null);
  const demographicsRef = useRef<HTMLDivElement | null>(null);

  // Exporting state
  const [exporting, setExporting] = useState(false);

  // Data transforms
  const bloodTypeStats: BloodTypeStat[] = neededVsDonated?.bloodTypeStats ?? [];
  const mostNeededBloodType = neededVsDonated?.mostNeeded ?? { type: "", needed: 0, donated: 0 };
  const mostDonatedBloodType = neededVsDonated?.mostDonated ?? { type: "", needed: 0, donated: 0 };

  const neededBloodTypes = bloodTypeStats.map(({ type, needed }) => ({ type, percentage: needed }));
  const donatedBloodTypes = bloodTypeStats.map(({ type, donated }) => ({ type, percentage: donated }));

  const donorGender: Demographic[] = demographics?.gender ?? [];
  const donorAge: Demographic[] = demographics?.age ?? [];

  // Text summary fallback
  const generateReportText = (): string => {
    let text = "Statistics Report\n\n";
    text += `Most needed blood type: ${mostNeededBloodType.type} (${mostNeededBloodType.needed})\n`;
    text += `Most donated blood type: ${mostDonatedBloodType.type} (${mostDonatedBloodType.donated})\n\n`;
    text += "Blood Type Stats (Needed vs Donated):\n";
    bloodTypeStats.forEach(({ type, needed, donated }) => {
      text += ` - ${type}: Needed ${needed}, Donated ${donated}\n`;
    });
    text += "\nDonor Gender Distribution:\n";
    donorGender.forEach(({ label, value }) => (text += ` - ${label}: ${value}%\n`));
    text += "\nDonor Age Groups:\n";
    donorAge.forEach(({ label, value }) => (text += ` - ${label}: ${value}%\n`));
    return text;
  };

  /* ------------------------------- PDF --------------------------------- */
  const downloadPDF = async () => {
    setExporting(true);
    try {
      // capture images
      const captureEl = async (el: HTMLDivElement | null, scale = 2) => {
        if (!el) return null;
        const canvas = await html2canvas(el, { scale, useCORS: true, allowTaint: true });
        return canvas.toDataURL("image/png");
      };

      const barImg = await captureEl(barChartRef.current);
      const neededPieImg = await captureEl(neededPieRef.current);
      const donatedPieImg = await captureEl(donatedPieRef.current);
      const demographicsImg = await captureEl(demographicsRef.current);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Cover page
      doc.setFillColor(235, 87, 87); // subtle accent
      doc.rect(0, 0, pageWidth, 140, "F");
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text("OLFU RCY", 40, 60);
      doc.setFontSize(18);
      doc.text("BloodPulse - Statistics Report", 40, 90);
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 115);

      doc.addPage();

      // Summary section
      doc.setFontSize(16);
      doc.setTextColor(34, 34, 34);
      doc.text("Executive Summary", 40, 40);
      doc.setFontSize(11);
      const summaryLines: string[] = doc.splitTextToSize(generateReportText(), pageWidth - 80) as string[];
      doc.text(summaryLines, 40, 60);

      // Insert Bar chart full width
      let yCursor = 60 + summaryLines.length * 12 + 20;
      if (barImg) {
        const imgProps = doc.getImageProperties(barImg);
        const imgW = pageWidth - 80;
        const ratio = imgProps.width / imgW;
        const imgH = imgProps.height / ratio;
        if (yCursor + imgH > pageHeight - 40) {
          doc.addPage();
          yCursor = 40;
        }
        doc.text("Blood Type Needs vs Donations", 40, yCursor - 8);
        doc.addImage(barImg, "PNG", 40, yCursor, imgW, imgH);
        yCursor += imgH + 20;
      }

      // Add pies side-by-side if space, else stacked
      const pieW = (pageWidth - 120) / 2;
      const piesOnSamePage = yCursor + pieW * 0.6 < pageHeight - 40;
      if (!piesOnSamePage) {
        doc.addPage();
        yCursor = 40;
      }
      doc.text("Most Needed Blood Types", 40, yCursor - 8);
      if (neededPieImg) doc.addImage(neededPieImg, "PNG", 40, yCursor, pieW, pieW);
      doc.text("Most Donated Blood Types", 60 + pieW, yCursor - 8);
      if (donatedPieImg) doc.addImage(donatedPieImg, "PNG", 60 + pieW, yCursor, pieW, pieW);

      // demographics below pies (new page if necessary)
      const demY = yCursor + pieW + 20;
      if (demY + 200 > pageHeight - 40) {
        doc.addPage();
      }
      doc.text("Donor Demographics", 40, demY - 8);
      if (demographicsImg) {
        // scale to page width
        const imgProps = doc.getImageProperties(demographicsImg);
        const width = pageWidth - 80;
        const ratio = imgProps.width / width;
        const height = imgProps.height / ratio;
        doc.addImage(demographicsImg, "PNG", 40, demY, width, height);
      }

      // Save
      doc.save("statistics_report.pdf");
    } catch (err) {
      // fallback: save a text summary
      console.error("PDF export failed", err);
      const blob = new Blob([generateReportText()], { type: "text/plain" });
      const saveTyped = (saveAs as unknown) as (blob: Blob, filename?: string) => void;
      saveTyped(blob, "statistics_report.txt");
    } finally {
      setExporting(false);
    }
  };

  /* ------------------------------- DOCX -------------------------------- */
  const downloadDOCX = async () => {
    setExporting(true);
    try {
      // helper capture
      const captureEl = async (el: HTMLDivElement | null, scale = 2) => {
        if (!el) return null;
        const canvas = await html2canvas(el, { scale, useCORS: true, allowTaint: true });
        return canvas.toDataURL("image/png");
      };

      const barImg = await captureEl(barChartRef.current, 2);
      const neededPieImg = await captureEl(neededPieRef.current, 2);
      const donatedPieImg = await captureEl(donatedPieRef.current, 2);
      const demographicsImg = await captureEl(demographicsRef.current, 2);

      const children: FileChild[] = [];

      // Cover
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "OLFU RCY", bold: true, size: 40 })],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "BloodPulse - Statistics Report", break: 1, size: 28 }),
            new TextRun({ text: `\nGenerated: ${new Date().toLocaleString()}`, size: 10, italics: true }),
          ],
        })
      );
      children.push(new Paragraph({ text: "" }));

      // Summary
      children.push(new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }));
      children.push(new Paragraph({ text: generateReportText() }));

      // Charts
      children.push(new Paragraph({ text: "Charts", heading: HeadingLevel.HEADING_1 }));

      const pushImageIfExists = async (dataUrl: string | null, caption?: string) => {
        if (!dataUrl) return;
        const uint8 = await dataUrlToUint8Array(dataUrl);
        const imageRun = new ImageRun({
          data: uint8,
          transformation: { width: 600, height: 300 },
          type: "png",
        });
        children.push(new Paragraph({ children: [imageRun] }));
        if (caption) children.push(new Paragraph({ text: caption, spacing: { after: 200 } }));
      };

      await pushImageIfExists(barImg, "Blood Type Needs vs Donations");
      await pushImageIfExists(neededPieImg, "Most Needed Blood Types");
      await pushImageIfExists(donatedPieImg, "Most Donated Blood Types");
      await pushImageIfExists(demographicsImg, "Donor Demographics");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const saveTyped = (saveAs as unknown) as (blob: Blob, filename?: string) => void;
      saveTyped(blob, "statistics_report.docx");
    } catch (err) {
      console.error("DOCX export failed", err);
      const blob = new Blob([generateReportText()], { type: "text/plain" });
      const saveTyped = (saveAs as unknown) as (blob: Blob, filename?: string) => void;
      saveTyped(blob, "statistics_report.txt");
    } finally {
      setExporting(false);
    }
  };

  /* ------------------------------- UI ---------------------------------- */

  return (
    <Box style={{ height: "100vh", padding: theme.spacing.md }}>
      <Box px="lg" py="md" mih="100%">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2}>Statistics</Title>
            <Text c="dimmed" size="sm">
              Overview of donations, donors, and demand
            </Text>
          </div>

          <Menu shadow="md" width={240}>
            <Menu.Target>
              <Button leftSection={<IconDownload size={16} />} variant="outline">
                Download Report
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={downloadPDF} disabled={exporting}>
                {exporting ? "Preparing PDF..." : "PDF"}
              </Menu.Item>
              <Menu.Item onClick={downloadDOCX} disabled={exporting}>
                {exporting ? "Preparing DOCX..." : "DOCX"}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="lg">
          <StatCard label="Most needed blood type" value={`${mostNeededBloodType.type} (${mostNeededBloodType.needed})`} icon={<IconDroplet size={18} />} />
          <StatCard label="Most donated blood type" value={`${mostDonatedBloodType.type} (${mostDonatedBloodType.donated})`} icon={<IconUsers size={18} />} />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">
              Most Needed Blood Types
            </Title>
            <div ref={neededPieRef as React.RefObject<HTMLDivElement>}>
              <NeededBloodTypePieChart data={neededBloodTypes} />
            </div>
          </Paper>

          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">
              Most Donated Blood Types
            </Title>
            <div ref={donatedPieRef as React.RefObject<HTMLDivElement>}>
              <DonatedBloodTypePieChart data={donatedBloodTypes} />
            </div>
          </Paper>
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder p="lg" radius="lg" shadow="sm">
              <Title order={5} mb="xs">
                Blood Type Needs vs Donations
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                Visual comparison of demand and donations by blood type
              </Text>
              <div ref={barChartRef as React.RefObject<HTMLDivElement>}>
                <BloodTypeChart bloodTypeStats={bloodTypeStats} />
              </div>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper withBorder p="lg" radius="lg" shadow="sm">
              <Title order={5} mb="xs">
                Donor Demographics
              </Title>
              <Text size="sm" c="dimmed">
                Gender distribution
              </Text>

              <div ref={demographicsRef as React.RefObject<HTMLDivElement>}>
                <Group mt="sm" justify="space-between" align="center">
                  <RingProgress
                    size={140}
                    thickness={12}
                    sections={donorGender.map((g, idx) => ({
                      value: g.value,
                      color: `red.${idx + 5}` as const,
                    }))}
                    label={
                      <Stack gap={0} align="center">
                        <Text fw={700}>100%</Text>
                        <Text size="xs" c="dimmed">
                          Donors
                        </Text>
                      </Stack>
                    }
                  />
                  <Stack gap={6}>
                    {donorGender.map((g, idx) => (
                      <Group key={g.label} gap="xs">
                        <Badge variant="filled" color={["red", "blue", "green", "yellow", "purple"][idx % 5]} size="xs" radius="sm">
                          &nbsp;
                        </Badge>
                        <Text size="sm">
                          {g.label}: <Text span fw={600}>{g.value}%</Text>
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Group>

                <Divider my="md" />

                <Text size="sm" c="dimmed" mb={6}>
                  Age groups
                </Text>
                <Stack gap="sm">
                  {donorAge.map((a) => (
                    <div key={a.label}>
                      <Group justify="space-between">
                        <Text size="sm">{a.label}</Text>
                        <Text size="sm" c="dimmed">
                          {a.value}%
                        </Text>
                      </Group>
                      <Progress value={a.value} color="red" />
                    </div>
                  ))}
                </Stack>
              </div>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsLayout;
