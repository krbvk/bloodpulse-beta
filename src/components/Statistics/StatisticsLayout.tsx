"use client";

import React from "react";
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
} from "@mantine/core";
import {
  IconDroplet,
  IconUsers,
  IconArrowUpRight,
  IconArrowDownRight,
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

/* -------------------------------------------------------------------------- */
/*                                  Dummy Data                                */
/* -------------------------------------------------------------------------- */

const donorGender: { label: string; value: number; color: string }[] = [
  { label: "Male", value: 55, color: "red.6" },
  { label: "Female", value: 43, color: "pink.5" },
  { label: "Other", value: 2, color: "gray.5" },
];

const donorAge: { label: string; value: number }[] = [
  { label: "18–25", value: 40 },
  { label: "26–35", value: 35 },
  { label: "36–50", value: 20 },
  { label: "51+", value: 5 },
];

const mostNeededBloodType = { type: "O+", demandRate: 38 };
const mostDonatedBloodType = { type: "A+", donationRate: 34 };

const bloodTypeStats: { type: string; needed: number; donated: number }[] = [
  { type: "O+", needed: 38, donated: 25 },
  { type: "A+", needed: 30, donated: 34 },
  { type: "B+", needed: 15, donated: 20 },
  { type: "AB+", needed: 10, donated: 8 },
  { type: "O-", needed: 5, donated: 7 },
  { type: "A-", needed: 2, donated: 3 },
];

const neededBloodTypes = bloodTypeStats.map(({ type, needed }) => ({
  type,
  percentage: needed,
}));
const donatedBloodTypes = bloodTypeStats.map(({ type, donated }) => ({
  type,
  percentage: donated,
}));

/* -------------------------------------------------------------------------- */
/*                                  Components                                */
/* -------------------------------------------------------------------------- */

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
              <ThemeIcon
                size="sm"
                radius="xl"
                color={isUp ? "green" : "red"}
                variant="light"
              >
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

function BloodTypeChart() {
  const mostNeeded = bloodTypeStats.reduce((a, b) =>
    b.needed > a.needed ? b : a
  );
  const mostDonated = bloodTypeStats.reduce((a, b) =>
    b.donated > a.donated ? b : a
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
          <Bar dataKey="needed" name="Needed (%)">
            {bloodTypeStats.map((entry, idx) => (
              <Cell
                key={`needed-${idx}`}
                fill={entry.type === mostNeeded.type ? "#e03131" : "#ffa8a8"}
              />
            ))}
          </Bar>
          <Bar dataKey="donated" name="Donated (%)">
            {bloodTypeStats.map((entry, idx) => (
              <Cell
                key={`donated-${idx}`}
                fill={entry.type === mostDonated.type ? "#1971c2" : "#a5d8ff"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

interface LabelProps {
  type: string;   // or number, depending on your data
  value?: string | number;
  [key: string]: unknown; // fallback for extra props
}
function NeededBloodTypePieChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={neededBloodTypes}
          dataKey="percentage"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ type }: LabelProps) => String(type)}

        >
          {neededBloodTypes.map((_, index) => (
            <Cell
              key={`needed-pie-${index}`}
              fill={[
                "#e03131",
                "#ffa8a8",
                "#fab005",
                "#845ef7",
                "#f59f00",
                "#1971c2",
              ][index % 6]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
interface ChartLabelProps {
  type?: string;
  value?: string | number;
  index?: number;
  [key: string]: unknown;
}
function DonatedBloodTypePieChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={donatedBloodTypes}
          dataKey="percentage"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(props: ChartLabelProps) => String(props.type ?? props.value ?? "")}
        >
          {donatedBloodTypes.map((_, index) => (
            <Cell
              key={`donated-pie-${index}`}
              fill={[
                "#1971c2",
                "#a5d8ff",
                "#fab005",
                "#5f3dc4",
                "#e03131",
                "#ffa8a8",
              ][index % 6]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

const StatisticsLayout = () => {
  const theme = useMantineTheme();

  return (
    <Box style={{ height: "100vh", padding: theme.spacing.md, overflowY: "auto" }}>
      <Box px="lg" py="md" mih="100%">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2}>Statistics</Title>
            <Text c="dimmed" size="sm">
              Overview of donations, donors, and demand (dummy data)
            </Text>
          </div>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="lg">
          <StatCard
            label="Most needed blood type"
            value={`${mostNeededBloodType.type} (${mostNeededBloodType.demandRate}%)`}
            icon={<IconDroplet size={18} />}
          />
          <StatCard
            label="Most donated blood type"
            value={`${mostDonatedBloodType.type} (${mostDonatedBloodType.donationRate}%)`}
            icon={<IconUsers size={18} />}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">Most Needed Blood Types</Title>
            <NeededBloodTypePieChart />
          </Paper>
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">Most Donated Blood Types</Title>
            <DonatedBloodTypePieChart />
          </Paper>
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder p="lg" radius="lg" shadow="sm">
              <Title order={5} mb="xs">Blood Type Needs vs Donations</Title>
              <Text size="sm" c="dimmed" mb="md">
                Visual comparison of demand and donations by blood type
              </Text>
              <BloodTypeChart />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper withBorder p="lg" radius="lg" shadow="sm">
              <Title order={5} mb="xs">Donor Demographics</Title>
              <Text size="sm" c="dimmed">Gender distribution</Text>

              <Group mt="sm" justify="space-between" align="center">
                <RingProgress
                  size={140}
                  thickness={12}
                  sections={donorGender.map((g) => ({
                    value: g.value,
                    color: g.color,
                  }))}
                  label={
                    <Stack gap={0} align="center">
                      <Text fw={700}>100%</Text>
                      <Text size="xs" c="dimmed">Donors</Text>
                    </Stack>
                  }
                />
                <Stack gap={6}>
                  {donorGender.map((g) => (
                    <Group key={g.label} gap="xs">
                      <Badge variant="filled" color={g.color} size="xs" radius="sm">
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

              <Text size="sm" c="dimmed" mb={6}>Age groups</Text>
              <Stack gap="sm">
                {donorAge.map((a) => (
                  <div key={a.label}>
                    <Group justify="space-between">
                      <Text size="sm">{a.label}</Text>
                      <Text size="sm" c="dimmed">{a.value}%</Text>
                    </Group>
                    <Progress value={a.value} color="red" />
                  </div>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsLayout;
