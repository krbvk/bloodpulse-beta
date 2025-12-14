import { Paper, Text, Stack, Group } from "@mantine/core";

export function BloodToolTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <Paper p="sm" shadow="md" radius="md" withBorder>
      <Stack gap={4}>
        <Text fw={600}>{label}</Text>

        {payload.map((item: any) => (
          <Group key={item.name} gap="xs" justify="space-between">
            <Text size="sm" c="dimmed">
              {item.name}
            </Text>
            <Text size="sm" fw={600} c={item.color}>
              {item.value}
            </Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
