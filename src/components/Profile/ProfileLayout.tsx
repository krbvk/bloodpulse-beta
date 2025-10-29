"use client";

import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import {
  Avatar,
  Box,
  Flex,
  Paper,
  Text,
  Title,
  Grid,
  Divider,
  Button,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Modal,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import CustomLoader from "@/components/Loader/CustomLoader";

export default function ProfileLayout() {
  const { status } = useSession();
  const { data: profile, isLoading, refetch } = api.user.getProfile.useQuery();
  const updateProfile = api.user.updateProfile.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Validation
  const form = useForm({
    initialValues: {
      name: "",
      gender: "",
      age: undefined as number | undefined,
      email: "",
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
    if (value > 125) return "Please enter a realistic age";
    return null;
  },
},

  });

  useEffect(() => {
    if (profile) {
      form.setValues({
        name: profile.name ?? "",
        gender: profile.gender ?? "",
        age: profile.age ?? undefined,
        email: profile.email ?? "",
      });
    }
  }, [profile]);

  if (status !== "authenticated" || isLoading) {
    return <CustomLoader />;
  }

const handleSubmit = (values: typeof form.values): void => {
  // Check age restriction
  if (values.age !== undefined && values.age < 18) {
    form.setFieldError("age", "Age must be 18 or above");
    return;
  }

  const payload: Record<string, unknown> = {};

  if (values.name?.trim()) payload.name = values.name.trim();
  if (values.gender?.trim()) payload.gender = values.gender.trim();
  if (typeof values.age === "number" && values.age >= 18) payload.age = values.age;

  if (Object.keys(payload).length > 0) {
    updateProfile.mutate(payload, {
      onSuccess: () => {
        void refetch().then(() => setIsEditing(false));
      },
    });
  }
};


  return (
    <Box
      px={{ base: "md", sm: "lg" }}
      py="lg"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >

      <Paper
        shadow="md"
        radius="lg"
        p={{ base: "md", sm: "xl" }}
        withBorder
        style={{
          backgroundColor: "var(--mantine-color-body)",
        }}
      > 
      <Title order={2} mb="lg" ta="center" fw={700}>
        My Profile
      </Title>
        {/* Profile Header */}
        <Flex direction="column" align="center" mb="xl">
          <Avatar
            src={profile?.image ?? "/placeholder-avatar.png"}
            size={120}
            radius={9999}
            alt={profile?.name ?? "User Avatar"}
          />
          <Text fw={700} size="xl" mt="md" ta="center">
            {profile?.name ?? "No Name Set"}
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
            {profile?.email}
          </Text>

          <Button
            variant="gradient"
            gradient={{ from: "red", to: "pink" }}
            mt="md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        </Flex>

        <Divider my="md" />

        {/* Profile Details */}
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Full Name
            </Text>
            <Text fw={600}>{profile?.name ?? "—"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Email
            </Text>
            <Text fw={600} style={{ wordBreak: "break-word" }}>
              {profile?.email ?? "—"}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Gender
            </Text>
            <Text fw={600}>{profile?.gender ?? "—"}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Age
            </Text>
            <Text fw={600}>{profile?.age ?? "—"}</Text>
          </Grid.Col>
        </Grid>
        <Divider my="lg" />
        <Text size="sm" c="dimmed" ta="center" mt="md">
          <strong>Note:</strong> This profile is for your website account only.  
          You will still need to fill up a form onsite if you are donating blood or making a blood request.
        </Text>
      </Paper>

      {/* Edit Modal */}
      <Modal
        opened={isEditing}
        onClose={() => setIsEditing(false)}
        title={<Text fw={700}>Edit Profile</Text>}
        centered
        radius="lg"
        overlayProps={{ blur: 3 }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              radius="md"
              withAsterisk
              {...form.getInputProps("name")}
            />

            <Select
              label="Gender"
              placeholder="Select gender"
              radius="md"
              data={["Male", "Female", "Other"]}
              {...form.getInputProps("gender")}
            />

            <NumberInput
              label="Age"
              placeholder="Enter your age"
              min={1}
              max={125}
              radius="md"
              withAsterisk
              {...form.getInputProps("age")}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                color="gray"
                radius="md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                radius="md"
                loading={updateProfile.isPending}
                variant="gradient"
                gradient={{ from: "red", to: "pink" }}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
