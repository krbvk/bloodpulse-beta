"use client";

import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Flex,
  Paper,
  Text,
  Title,
  Loader,
  Center,
  Grid,
  Divider,
} from "@mantine/core";

export default function ProfileLayout() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (!session?.user) {
    return (
      <Center h="100vh" px="md">
        <Text size="md" style={{textAlign: "center"}}>
          User not logged in
        </Text>
      </Center>
    );
  }

  const { name, email, image } = session.user;

  return (
    <Box px={{ base: "md", sm: "lg" }} py="lg" style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title order={2} mb="lg" style={{textAlign: "center"}}>
        My Profile
      </Title>

      <Paper shadow="sm" radius="md" p={{ base: "md", sm: "xl" }} withBorder>
        {/* Profile Header */}
        <Flex direction="column" align="center" mb="xl">
          <Avatar
            src={image ?? "/placeholder-avatar.png"}
            size={100}
            radius="xl"
            alt={name ?? "User Avatar"}
          />
          <Text fw={700} size="lg" mt="md" style={{textAlign: "center"}}>
            {name}
          </Text>
          <Text size="sm" c="dimmed" mt={4} style={{textAlign: "center"}}>
            {email}
          </Text>
        </Flex>

        <Divider my="md" />

        {/* Profile Details */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Full Name
            </Text>
            <Text fw={500}>{name ?? "—"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Email Address
            </Text>
            <Text fw={500}>{email ?? "—"}</Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>
  );
}
