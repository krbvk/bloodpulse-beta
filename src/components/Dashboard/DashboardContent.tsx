import { Box, Text, Card, Grid, Paper, Title } from '@mantine/core';
import type { Session } from 'next-auth';

type Props = {
  session: Session | null;
};

const DashboardContent = ({ session }: Props) => {
  return (
    <Box
      px="md"
      py="lg"
      style={{
        overflowY: 'hidden',
        maxHeight: '100%',
      }}
    >
      {/* Display user info */}
      {session?.user && (
        <Text fw={500} size="lg" mb="md">
          Welcome back, {session.user.name}!
        </Text>
      )}

      <Title order={2} mb="md">
        Latest News
      </Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} mb="xs">
              Blood Donation Drive
            </Text>
            <Text size="sm" c="dimmed">
              Join us for a special donation event this weekend. Help us save lives!
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} mb="xs">
              Emergency Blood Request
            </Text>
            <Text size="sm" c="dimmed">
              A local hospital is in urgent need of O-negative blood. Please consider donating.
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Title order={2} mt="xl" mb="md">
        Announcements
      </Title>
      <Paper shadow="xs" p="md" radius="md" withBorder>
        <Text fw={500} mb="xs">
          New Donor Registration System
        </Text>
        <Text size="sm" c="dimmed">
          We&rsquo;ve revamped the donor registration process to make it faster and easier. Sign up today!
        </Text>
      </Paper>

      <Title order={2} mt="xl" mb="md">
        Updates
      </Title>
      <Paper shadow="xs" p="md" radius="md" withBorder>
        <Text fw={500} mb="xs">
          Blood Donation Statistics
        </Text>
        <Text size="sm" c="dimmed">
          We&apos;ve seen a 25% increase in donations this quarter! Thank you for your support!
        </Text>
      </Paper>
    </Box>
  );
};

export default DashboardContent;
