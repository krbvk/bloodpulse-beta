"use client";

import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Flex,
  Paper,
  Text,
  Title,
  Grid,
  Divider,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomLoader from "@/components/Loader/CustomLoader"

export default function ProfileLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return <CustomLoader />;
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
