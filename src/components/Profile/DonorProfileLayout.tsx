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
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";

type Gender = "Male" | "Female" | "Other";

export default function DonorProfileLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [editOpened, setEditOpened] = useState(false);
  const [sidebarOpened, setSidebarOpened] = useState(false); // overlay sidebar state
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<{
    name: string;
    age: number;
    gender: Gender;
    contactEmail: string;
    bloodType: string;
  }>({
    name: "",
    age: 0,
    gender: "Male",
    contactEmail: "",
    bloodType: "",
  });

  // Fetch donor profile
  const { data: donor, isLoading, refetch } = api.donor.getIsUserDonor.useQuery();
  const updateProfile = api.donor.updateProfile.useMutation();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");

    if (donor) {
      setFormValues({
        name: donor.name,
        age: Number(donor.age),
        gender: donor.gender as Gender,
        contactEmail: donor.contactEmail ?? "",
        bloodType: donor.bloodType ?? "",
      });
    }
  }, [status, donor, router]);

  if (status !== "authenticated" || isLoading) return <CustomLoader />;

  const { email, image } = session.user;

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await updateProfile.mutateAsync(formValues);
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
      {/* Sidebar Drawer (overlay) */}
      <Drawer
        opened={sidebarOpened}
        onClose={() => setSidebarOpened(false)}
        title="Menu"
        padding="md"
        size="250px"
      >
        {/* Replace with your actual Sidebar content */}
        <Text>Dashboard</Text>
        <Text>Profile</Text>
        <Text>Settings</Text>
      </Drawer>

      {/* Content Area */}
      <Box px={{ base: "md", sm: "lg" }} py="lg" style={{ maxWidth: 900, margin: "0 auto" }}>
        <Flex justify="space-between" align="center" mb="lg">
          <Title order={2} style={{ textAlign: "center", flex: 1 }}>
            Donor Profile
          </Title>
        </Flex>

        <Paper shadow="sm" radius="md" p={{ base: "md", sm: "xl" }} withBorder>
          {/* Profile Header */}
          <Flex direction="column" align="center" mb="xl">
            <Avatar src={image ?? "/placeholder-avatar.png"} size={100} radius="xl" alt={donor?.name ?? "User Avatar"} />
            <Text fw={700} size="lg" mt="md" style={{ textAlign: "center" }}>
              {donor?.name ?? "No Name Set"}
            </Text>
            <Text size="sm" c="dimmed" mt={4} style={{ textAlign: "center" }}>
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

            <Button mt="md" variant="outline" onClick={() => setEditOpened(true)}>
              Edit Profile
            </Button>
          </Flex>

          <Divider my="md" />

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text size="xs" c="dimmed" fw={500} mb={4}>
                Full Name
              </Text>
              <Text fw={500}>{donor?.name ?? "No Name Set"}</Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text size="xs" c="dimmed" fw={500} mb={4}>
                Email Address
              </Text>
              <Text fw={500}>{email ?? "—"}</Text>
            </Grid.Col>

            {donor?.isDonor && (
              <>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Age
                  </Text>
                  <Text fw={500}>{Number(donor?.age ?? 0)}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Gender
                  </Text>
                  <Text fw={500}>{donor?.gender ?? "—"}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Contact Email
                  </Text>
                  <Text fw={500}>{donor?.contactEmail ?? "—"}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Blood Type
                  </Text>
                  <Text fw={500}>{donor?.bloodType ?? "—"}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="xs" c="dimmed" fw={500} mb={4}>
                    Number of Donations
                  </Text>
                  <Text fw={500}>{Number(donor?.donationCount ?? 0)}</Text>
                </Grid.Col>
              </>
            )}
          </Grid>
        </Paper>

        {/* Edit Modal */}
        <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Profile" centered>
          <TextInput
            label="Full Name"
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.currentTarget.value })}
            mb="sm"
          />

          <NumberInput
            label="Age"
            value={formValues.age}
            onChange={(value) => setFormValues({ ...formValues, age: Number(value ?? 0) })}
            mb="sm"
            min={0}
          />

          <Select
            label="Gender"
            data={["Male", "Female", "Other"]}
            value={formValues.gender}
            onChange={(value) => value && setFormValues({ ...formValues, gender: value as Gender })}
            mb="sm"
          />

          <TextInput
            label="Contact Email"
            value={formValues.contactEmail}
            onChange={(e) => setFormValues({ ...formValues, contactEmail: e.currentTarget.value })}
            mb="sm"
          />

          <Group mt="md" style={{ justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setEditOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} loading={saving}>
              Save
            </Button>
          </Group>
        </Modal>
      </Box>
    </Box>
  );
}
