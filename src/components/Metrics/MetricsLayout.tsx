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

/* ------------------------------- Types --------------------------------- */
type Demographic = { label: string; value: number };
type BloodTypeStat = { type: string; needed: number; donated: number };

/* ----------------------------- Components ------------------------------ */
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Paper withBorder p="md" radius="lg" shadow="sm">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="xs" c="dimmed">{label}</Text>
          <Text fw={700} fz={28}>{value}</Text>
        </Stack>
        <ThemeIcon size="lg" radius="md" color="red" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

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

function PieChartTemplate({ data, colors }: { data: { type: string; percentage: number }[]; colors: string[] }) {
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
            <Cell key={`pie-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ----------------------------- Main ------------d------------------------ */
const MetricsLayout: React.FC = () => {
  const theme = useMantineTheme();
  const { data: neededVsDonated } = api.statistics.getNeededVsDonated.useQuery();
  const { data: demographics } = api.statistics.getDonorDemographics.useQuery();

  const { data: getTotalUsers } = api.user.getTotalUsers.useQuery();


  const bloodTypeStats: BloodTypeStat[] = neededVsDonated?.bloodTypeStats ?? [];
  const mostNeededBloodType = neededVsDonated?.mostNeeded ?? { type: "", needed: 0 };
  const mostDonatedBloodType = neededVsDonated?.mostDonated ?? { type: "", donated: 0 };
  const donorGender: Demographic[] = demographics?.gender ?? [];
  const donorAge: Demographic[] = demographics?.age ?? [];

  const neededBloodTypes = bloodTypeStats.map(({ type, needed }) => ({ type, percentage: needed }));
  const donatedBloodTypes = bloodTypeStats.map(({ type, donated }) => ({ type, percentage: donated }));

  return (
    <Box p="md">
      <Title order={2} mb="xs">Dashboard</Title>
      <Text c="dimmed" size="sm" mb="md">
        Current blood needs, donations, and demographics
      </Text>

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
        <StatCard
  label="Number of Users"
  value={`${getTotalUsers?.count ?? 0}`}
  icon={<IconUsers size={18} />}
/>

      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
        <Paper withBorder p="lg" radius="lg" shadow="sm">
          <Title order={5} mb="xs">Most Needed Blood Types</Title>
          <PieChartTemplate
            data={neededBloodTypes}
            colors={["#e03131", "#ffa8a8", "#fab005", "#845ef7", "#f59f00", "#1971c2"]}
          />
        </Paper>

        <Paper withBorder p="lg" radius="lg" shadow="sm">
          <Title order={5} mb="xs">Most Donated Blood Types</Title>
          <PieChartTemplate
            data={donatedBloodTypes}
            colors={["#1971c2", "#a5d8ff", "#fab005", "#5f3dc4", "#e03131", "#ffa8a8"]}
          />
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
                  color: `red.${idx + 5}` as const,
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
  );
};

export default MetricsLayout;
