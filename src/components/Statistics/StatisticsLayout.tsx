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

import { api } from "@/trpc/react";

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

function BloodTypeChart({
  bloodTypeStats,
}: {
  bloodTypeStats: { type: string; needed: number; donated: number }[];
}) {
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
              <Cell
                key={`needed-${idx}`}
                fill={entry.type === mostNeeded.type ? "#e03131" : "#ffa8a8"}
              />
            ))}
          </Bar>
          <Bar dataKey="donated" name="Donated">
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

function NeededBloodTypePieChart({
  data,
}: {
  data: { type: string; percentage: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ type }) => String(type)}
        >
          {data.map((_, index) => (
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

function DonatedBloodTypePieChart({
  data,
}: {
  data: { type: string; percentage: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ type }) => String(type)}
        >
          {data.map((_, index) => (
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

  // Queries
  const { data: neededVsDonated } = api.statistics.getNeededVsDonated.useQuery();
  const { data: demographics } = api.statistics.getDonorDemographics.useQuery();

  // Transform data
  const bloodTypeStats = neededVsDonated?.bloodTypeStats ?? [];
  const mostNeededBloodType = neededVsDonated?.mostNeeded ?? {
    type: "",
    needed: 0,
    donated: 0,
  };
  const mostDonatedBloodType = neededVsDonated?.mostDonated ?? {
    type: "",
    needed: 0,
    donated: 0,
  };

  const neededBloodTypes = bloodTypeStats.map(({ type, needed }) => ({
    type,
    percentage: needed,
  }));
  const donatedBloodTypes = bloodTypeStats.map(({ type, donated }) => ({
    type,
    percentage: donated,
  }));

  const donorGender = demographics?.gender ?? [];
  const donorAge = demographics?.age ?? [];

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
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="lg">
          <StatCard
            label="Most needed blood type"
            value={`${mostNeededBloodType.type} (${mostNeededBloodType.needed})`}
            icon={<IconDroplet size={18} />}
          />
          <StatCard
            label="Most donated blood type"
            value={`${mostDonatedBloodType.type} (${mostDonatedBloodType.donated})`}
            icon={<IconUsers size={18} />}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">Most Needed Blood Types</Title>
            <NeededBloodTypePieChart data={neededBloodTypes} />
          </Paper>
          <Paper withBorder p="lg" radius="lg" shadow="sm">
            <Title order={5} mb="xs">Most Donated Blood Types</Title>
            <DonatedBloodTypePieChart data={donatedBloodTypes} />
          </Paper>
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder p="lg" radius="lg" shadow="sm">
              <Title order={5} mb="xs">Blood Type Needs vs Donations</Title>
              <Text size="sm" c="dimmed" mb="md">
                Visual comparison of demand and donations by blood type
              </Text>
              <BloodTypeChart bloodTypeStats={bloodTypeStats} />
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
  sections={donorGender.map((g, idx) => ({
    value: g.value,
    color: `red.${idx + 5}` as const, // e.g., red.5, red.6, etc.
  }))}


                  label={
                    <Stack gap={0} align="center">
                      <Text fw={700}>100%</Text>
                      <Text size="xs" c="dimmed">Donors</Text>
                    </Stack>
                  }
                />
                <Stack gap={6}>
                  {donorGender.map((g, idx) => (
                    <Group key={g.label} gap="xs">
                      <Badge
                        variant="filled"
                        color={["red", "blue", "green", "yellow", "purple"][idx % 5]}
                        size="xs"
                        radius="sm"
                      >
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
