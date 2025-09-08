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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import CustomLoader from "@/components/Loader/CustomLoader";

export default function ProfileLayout() {
  const { status } = useSession();
  const { data: profile, isLoading, refetch } = api.user.getProfile.useQuery();
  const updateProfile = api.user.updateProfile.useMutation();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      gender: "",
      age: undefined as number | undefined,
      email: "",
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

  const handleSubmit = (values: typeof form.values) => {
    updateProfile.mutate(
      {
        name: values.name,
        gender: values.gender,
        age: values.age,
      },
      {
        onSuccess: async () => {
          await refetch();
          setIsEditing(false); // close form after save
        },
      }
    );
  };

  return (
    <Box
      px={{ base: "md", sm: "lg" }}
      py="lg"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <Title order={2} mb="lg" style={{ textAlign: "center" }}>
        My Profile
      </Title>

      <Paper shadow="sm" radius="md" p={{ base: "md", sm: "xl" }} withBorder>
        <Flex direction="column" align="center" mb="xl">
          <Avatar
            src={profile?.image ?? "/placeholder-avatar.png"}
            size={100}
            radius="xl"
            alt={profile?.name ?? "User Avatar"}
          />
          <Text fw={700} size="lg" mt="md" style={{ textAlign: "center" }}>
            {profile?.name ?? "No Name Set"}
          </Text>
          <Text size="sm" c="dimmed" mt={4} style={{ textAlign: "center" }}>
            {profile?.email}
          </Text>

          {!isEditing && (
            <Button variant="light" mt="md" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Flex>

        <Divider my="md" />

        {!isEditing ? (
          <>
            {/* Profile Details */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Full Name
                </Text>
                <Text fw={500}>{profile?.name ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Email Address
                </Text>
                <Text fw={500}>{profile?.email ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Gender
                </Text>
                <Text fw={500}>{profile?.gender ?? "—"}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>
                  Age
                </Text>
                <Text fw={500}>{profile?.age ?? "—"}</Text>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <>
            {/* Edit Form */}
            <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
              <Stack>
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...form.getInputProps("name")}
                />

                <Select
                  label="Gender"
                  placeholder="Select gender"
                  data={["Male", "Female", "Other"]}
                  {...form.getInputProps("gender")}
                />

                <NumberInput
                  label="Age"
                  placeholder="Enter your age"
                  min={1}
                  {...form.getInputProps("age")}
                />

                <Flex gap="md">
                  <Button type="submit" loading={updateProfile.isPending}>
                    Save Changes
                  </Button>
                  <Button
                    variant="light"
                    color="gray"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Flex>
              </Stack>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
}
