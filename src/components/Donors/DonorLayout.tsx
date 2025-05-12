"use client";

import { Box, Title, Input, Group, Text, Grid, Paper, Flex, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState, useMemo, useEffect } from "react";
import { api } from "@/trpc/react";
import { IconSearch } from "@tabler/icons-react";
import CustomLoader from "../Loader/CustomLoader";
import { useRouter } from "next/navigation";

export default function DonorLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: donors = [], isLoading } = api.donor.getAll.useQuery();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDonors = useMemo(() => {
    if (!donors) return [];
    return donors.filter((donor) =>
      donor.bloodType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [donors, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername = username?.slice(0, 2) + "*".repeat(Math.max(username?.length ?? 0 - 2, 0));
    return `${maskedUsername}@${domain}`;
  };

    useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <Box
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomLoader />
      </Box>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <Box px={{ base: "md", sm: "lg" }} py="lg" style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title order={2} mb="lg" style={{ textAlign: "center" }}>
        Donor List
      </Title>

      <Paper shadow="sm" radius="md" p={{ base: "md", sm: "xl" }} withBorder>
        <Box mb="lg">
          <Group align="center" justify="center" mb="lg" style={{ display: "flex", gap: "8px" }}>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter blood type (e.g., O)"
              style={{ width: 250 }}
              radius="xl"
              leftSection={<IconSearch />}
            />
          </Group>
        </Box>

        <Text size="sm" mb="md" style={{ textAlign: "center" }}>
          Found {filteredDonors.length} donor{filteredDonors.length !== 1 ? "s" : ""}
        </Text>

        {filteredDonors.length === 0 ? (
          <Text style={{ textAlign: "center" }} c="dimmed">
            No donors found.
          </Text>
        ) : (
          <Grid gutter="md">
            {filteredDonors.map((donor) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={donor.id}>
                <Box mb="sm" p="md" style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
                  <Flex align="center" direction="column" mb="md">
                    <Text fw={700} size="lg" style={{ textAlign: "center" }}>
                      {getInitials(donor.name)}
                    </Text>
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {maskEmail(donor.email)}
                    </Text>
                    <Text size="md" mt="sm" style={{ textAlign: "center" }}>
                      Blood Type: {donor.bloodType}
                    </Text>
                  </Flex>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
