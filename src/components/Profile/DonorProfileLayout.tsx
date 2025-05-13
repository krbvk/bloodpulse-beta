"use client";

import { useSession } from "next-auth/react";
import { Box, Paper, Text, Title, Grid, Divider, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";

export default function DonorProfileLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: donor, isLoading } = api.donor.getById.useQuery(session?.user.id ?? "");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "authenticated" || isLoading) {
    return <CustomLoader />;
  }

  const { name, email } = session.user;
  const { bloodType, phoneNumber, donationCount } = donor ?? {};

  const isDonor = bloodType && phoneNumber && donationCount;

  return (
    <Box px={{ base: "md", sm: "lg" }} py="lg" style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title order={2} mb="lg" style={{ textAlign: "center" }}>
        Donor History
      </Title>

      <Paper shadow="sm" radius="md" p={{ base: "md", sm: "xl" }} withBorder>
        {isDonor ? (
          <>
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

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Blood Type
                </Text>
                <Text fw={500}>{bloodType ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Phone Number
                </Text>
                <Text fw={500}>{phoneNumber ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Donation Count
                </Text>
                <Text fw={500}>{donationCount ?? "—"}</Text>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <>
            <Text style={{ textAlign: "center" }} c="red" fw={600}>
              If this data is missing, it means you are not part of our donor list yet.
            </Text>
            <Text style={{ textAlign: "center" }} mt="md">
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
