"use client";

import { useSession } from "next-auth/react";
import {
  Box,
  Paper,
  Text,
  Title,
  Grid,
  Divider,
  Button,
  Flex,
  Avatar,
  Badge,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Group,
  Drawer,
  Stack,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";
import { useForm } from "@mantine/form";

type Gender = "Male" | "Female" | "Other";

export default function DonorProfileLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [editOpened, setEditOpened] = useState(false);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: donor, isLoading, refetch } = api.donor.getIsUserDonor.useQuery();
  const updateProfile = api.donor.updateProfile.useMutation();

  // ✅ Mantine form with validation
  const form = useForm({
    initialValues: {
      name: "",
      age: 0,
      gender: "Male" as Gender,
      contactEmail: "",
      bloodType: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0
          ? "Name is required"
          : /^[A-Za-z\s]+$/.test(value)
          ? null
          : "Name must only contain letters and spaces",

      age: (value) => {
        if (value === undefined || value <= 0) return "Please enter a valid age";
        if (value < 18) return "Age must be 18 or above";
        if (value > 150) return "Please enter a realistic age";
        return null;
      },

      contactEmail: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");

    if (donor) {
      form.setValues({
        name: donor.name ?? "",
        age: Number(donor.age ?? 0),
        gender: donor.gender as Gender,
        contactEmail: donor.contactEmail ?? "",
        bloodType: donor.bloodType ?? "",
      });
    }
  }, [status, donor, router]);

  if (status !== "authenticated" || isLoading) return <CustomLoader />;

  const { email, image } = session.user;

  // ✅ Updated save handler with age restriction
  const handleEditSave = async (values: typeof form.values) => {
    if (values.age < 18) {
      form.setFieldError("age", "Age must be 18 or above");
      return;
    }

    setSaving(true);
    try {
      await updateProfile.mutateAsync(values);
      await refetch();
      setEditOpened(false);
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* Sidebar Drawer */}
      <Drawer
        opened={sidebarOpened}
        onClose={() => setSidebarOpened(false)}
        title="Menu"
        padding="md"
        size="250px"
      >
        <Text>Dashboard</Text>
        <Text>Profile</Text>
        <Text>Settings</Text>
      </Drawer>

      {/* Content Area */}
      <Box px={{ base: "md", sm: "lg" }} py="lg" style={{ maxWidth: 900, margin: "0 auto" }}>
        <Paper shadow="md" radius="lg" p={{ base: "md", sm: "xl" }} withBorder>
          <Flex justify="space-between" align="center" mb="lg">
            <Title order={2} style={{ textAlign: "center", flex: 1 }}>
              Donor Profile
            </Title>
          </Flex>

          {/* Profile Header */}
          <Flex direction="column" align="center" mb="xl">
            <Avatar
              src={image ?? "/placeholder-avatar.png"}
              size={120}
              radius={9999}
              alt={donor?.name ?? "User Avatar"}
            />
            <Text fw={700} size="xl" mt="md" ta="center">
              {donor?.name ?? "No Name Set"}
            </Text>
            <Text
              size="sm"
              c="dimmed"
              mt={4}
              ta="center"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                maxWidth: "100%",
              }}
            >
              {email}
            </Text>
            {donor?.isDonor ? (
              <Badge mt="sm" color="red">
                Active Donor
              </Badge>
            ) : (
              <Badge mt="sm" color="gray" variant="light">
                Not a Donor
              </Badge>
            )}

            <Button
              mt="md"
              variant="gradient"
              gradient={{ from: "red", to: "pink" }}
              onClick={() => setEditOpened(true)}
            >
              Edit Profile
            </Button>
          </Flex>

          <Divider my="md" />

          {/* Profile Info */}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text size="xs" c="dimmed" fw={500} mb={4}>
                Full Name
              </Text>
              <Text
                fw={600}
                style={{ wordBreak: "break-word", overflowWrap: "anywhere", maxWidth: "100%" }}
              >
                {donor?.name ?? "No Name Set"}
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text size="xs" c="dimmed" fw={500} mb={4}>
                Email Address
              </Text>
              <Text
                fw={600}
                style={{ wordBreak: "break-word", overflowWrap: "anywhere", maxWidth: "100%" }}
              >
                {email ?? "—"}
              </Text>
            </Grid.Col>

            {donor?.isDonor && (
              <>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Age
                  </Text>
                  <Text fw={600}>
                    {Number(donor?.age ?? 0) > 100 ? "100+" : donor?.age ?? "—"}
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Gender
                  </Text>
                  <Text fw={600}>{donor?.gender ?? "—"}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Contact Email
                  </Text>
                  <Text
                    fw={600}
                    style={{ wordBreak: "break-word", overflowWrap: "anywhere", maxWidth: "100%" }}
                  >
                    {donor?.contactEmail ?? "—"}
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Blood Type
                  </Text>
                  <Text fw={600}>{donor?.bloodType ?? "—"}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Number of Donations
                  </Text>
                  <Text fw={600}>{Number(donor?.donationCount ?? 0)}</Text>
                </Grid.Col>
              </>
            )}
          </Grid>
        </Paper>

        {/* Edit Modal */}
        <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Profile" centered>
          <form onSubmit={form.onSubmit(handleEditSave)}>
            <Stack>
              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                radius="md"
                withAsterisk
                {...form.getInputProps("name")}
              />

              <NumberInput
                label="Age"
                placeholder="Enter your age"
                min={1}
                max={150}
                radius="md"
                withAsterisk
                {...form.getInputProps("age")}
              />

              <Select
                label="Gender"
                placeholder="Select gender"
                radius="md"
                data={["Male", "Female", "Other"]}
                {...form.getInputProps("gender")}
              />

              <TextInput
                label="Contact Email"
                placeholder="Enter your contact email"
                radius="md"
                withAsterisk
                {...form.getInputProps("contactEmail")}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  type="submit"
                  radius="md"
                  loading={saving}
                  variant="gradient"
                  gradient={{ from: "red", to: "pink" }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="light"
                  color="gray"
                  radius="md"
                  onClick={() => setEditOpened(false)}
                >
                  Cancel
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Box>
    </Box>
  );
}
