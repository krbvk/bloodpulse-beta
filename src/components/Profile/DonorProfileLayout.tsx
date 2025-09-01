"use client";

import { useSession } from "next-auth/react";
import { Box, Paper, Text, Title, Grid, Divider, Button, Flex, Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";

interface Donor {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  contactEmail: string;
  donationCount: number;
}

export default function DonorProfileLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: donors = [], isLoading } = api.donor.getAll.useQuery() as { data: Donor[]; isLoading: boolean };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "authenticated" || isLoading) {
    return <CustomLoader />;
  }

  const { name, email, image } = session.user;

  const donor = donors.find(d => d.email.toLowerCase() === (email ?? "").toLowerCase());

  const { bloodType, contactEmail, donationCount } = donor ?? {};

  const isDonor =
    (bloodType ?? "").trim() !== "" &&
    (contactEmail ?? "").trim() !== "" &&
    donationCount !== null && donationCount !== undefined;

  return (
    <Box px={{ base: "md", sm: "lg" }} py="lg" style={{ maxWidth: 900, margin: "0 auto"}}>
      <Title order={2} mb="lg" style={{ textAlign: "center",}}>
        Donor Profile
      </Title>

      <Paper shadow="sm" radius="md" p={{ base: "md", sm: "xl" }} withBorder>
        <Flex direction="column" align="center" mb="xl">
            <Avatar
            src={image ?? "/placeholder-avatar.png"}
            size={100}
            radius="xl"
            alt={name ?? "User Avatar"}
            />
            <Text fw={700} size="lg" mt="md" style={{textAlign: "center"}}>
            {name ? `, ${name}` : "No Name Set"}
            </Text>
            <Text size="sm" c="dimmed" mt={4} style={{textAlign: "center"}}>
            {email}
            </Text>
        </Flex>
        
        <Divider my="md" />
        <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="xs" c="dimmed" fw={500} mb={4}>
            Full Name
          </Text>
          <Text fw={500}>{name ?? "No Name Set"}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="xs" c="dimmed" fw={500} mb={4}>
            Email Address
          </Text>
          <Text fw={500}>{email ?? "—"}</Text>
        </Grid.Col>
        </Grid>
        {isDonor ? (
          <>
            {/* Profile Details */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Blood Type
                </Text>
                <Text fw={500}>{bloodType ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Contact Email
                </Text>
                <Text fw={500}>{contactEmail ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Number of times donated
                </Text>
                <Text fw={500}>{donationCount ?? "—"}</Text>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <>
            <Divider my="md" />
            <Text style={{ textAlign: "left" }} c="red" fw={600}>
              If some data are missing like blood type, contact, etc. It means you are not part of our donor list yet.
            </Text>
            <Text style={{ textAlign: "left" }} mt="md">
              Want to be part of our donor list and help others? Book an appointment to donate blood, and not only will you be added to our list, but you&apos;ll also be helping those in need.
            </Text>
            <Button
              mt="md"
              variant="filled"
              color="red"
              fullWidth
              onClick={() => router.push("/appointments")}
            >
              Book an Appointment
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
