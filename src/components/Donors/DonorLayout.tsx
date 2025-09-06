"use client";

import {
  Box,
  Title,
  Input,
  Flex,
  Stack,
  Grid,
  Paper,
  Modal,
  Button,
  TextInput,
  Select,
  ActionIcon,
  Tooltip,
  Checkbox,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState, useMemo, useEffect } from "react";
import { api } from "@/trpc/react";
import { IconSearch, IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import CustomLoader from "../Loader/CustomLoader";
import { useRouter } from "next/navigation";

interface Donor {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  contactEmail: string;
  donationCount: number;
  gender: string;
  age: number;
}

export default function DonorLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: donors = [], isLoading } =
    api.donor.getAll.useQuery() as { data: Donor[]; isLoading: boolean };
  const utils = api.useUtils();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [addModalOpened, setAddModalOpened] = useState<boolean>(false);
  const [selectedDonorsToDelete, setSelectedDonorsToDelete] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableDonor, setEditableDonor] = useState<Donor | null>(null);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [deleteConfirmOpened, setDeleteConfirmOpened] = useState(false);

  const [newDonor, setNewDonor] = useState<Omit<Donor, "id">>({
    name: "",
    email: "",
    bloodType: "",
    contactEmail: "",
    donationCount: 0,
    gender: "Male",
    age: 18,
  });

  const addDonor = api.donor.create.useMutation({
    onSuccess: async () => {
      await utils.donor.getAll.invalidate();
      setAddModalOpened(false);
      setNewDonor({
        name: "",
        email: "",
        bloodType: "",
        contactEmail: "",
        donationCount: 0,
        gender: "Male",
        age: 18,
      });
    },
  });

  const deleteDonor = api.donor.delete.useMutation({
    onSuccess: async () => {
      await utils.donor.getAll.invalidate();
      setSelectedDonorsToDelete([]);
      setSelectMode(false);
    },
  });

  const updateDonor = api.donor.update.useMutation({
    onSuccess: async () => {
      await utils.donor.getAll.invalidate();
      setIsEditing(false);
      setModalOpened(false);
    },
  });

  const filteredDonors = useMemo(() => {
    if (!searchQuery) {
      return donors;
    }
    return donors.filter(
      (donor) => donor.bloodType.toLowerCase() === searchQuery.toLowerCase()
    );
  }, [donors, searchQuery]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "authenticated" || isLoading) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <CustomLoader />
      </Flex>
    );
  }

  const handleDeleteSelected = () => {
    setDeleteConfirmOpened(true);
  };

  const validateEmail = (email: string) => {
    const regex = /^[\w-.]+@(gmail|yahoo|fatima)\.[a-z]{2,}$/i;
    return regex.test(email);
  };

  return (
    <Box px="lg" py="lg" maw={900} mx="auto">
      <Title order={2} ta="center" mb="lg">
        Donor List
      </Title>

      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Stack align="center" gap="sm" mb="lg">
          <Flex gap="sm" align="center" wrap="wrap">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter blood type (e.g., O)"
              w={250}
              radius="xl"
              leftSection={<IconSearch size={16} />}
            />
            <Tooltip label="Add Donor" withArrow>
              <ActionIcon
                variant="filled"
                color="blue"
                size="md"
                onClick={() => setAddModalOpened(true)}
              >
                <IconPlus size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete Donor(s)" withArrow>
              <ActionIcon
                variant="filled"
                color={selectMode ? "gray" : "red"}
                size="md"
                onClick={() => setSelectMode(!selectMode)}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Stack>

        <Text size="sm" ta="center" mb="sm">
          Found {filteredDonors.length} donor
          {filteredDonors.length !== 1 ? "s" : ""}
        </Text>

        {filteredDonors.length === 0 ? (
          <Text ta="center" c="dimmed">
            No donors found.
          </Text>
        ) : (
          <Grid gutter="md">
            {filteredDonors.map((donor) => (
              <Grid.Col
                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                key={donor.id}
              >
                <Box
                  p="md"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  {selectMode && (
                    <Checkbox
                      checked={selectedDonorsToDelete.includes(donor.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDonorsToDelete((prev) => [...prev, donor.id]);
                        } else {
                          setSelectedDonorsToDelete((prev) =>
                            prev.filter((id) => id !== donor.id)
                          );
                        }
                      }}
                      style={{ position: "absolute", top: "8px", left: "8px" }}
                    />
                  )}

                  <Stack align="center" gap="xs">
                    <Text fw={700} size="lg" ta="center">
                      {donor.name}
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                      Blood Type: {donor.bloodType}
                    </Text>
                    {!selectMode && (
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => {
                          setSelectedDonor(donor);
                          setModalOpened(true);
                        }}
                      >
                        View Full Details
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {selectMode && selectedDonorsToDelete.length > 0 && (
          <Flex justify="center" mt="lg">
            <Button color="red" onClick={handleDeleteSelected}>
              Delete Selected ({selectedDonorsToDelete.length})
            </Button>
          </Flex>
        )}
      </Paper>

      {/* View Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Donor Details"
        centered
      >
        <Stack gap="xs">
          <Text>
            <strong>Name:</strong> {selectedDonor?.name}
          </Text>
          <Text>
            <strong>Email:</strong> {selectedDonor?.email}
          </Text>
          <Text>
            <strong>Blood Type:</strong> {selectedDonor?.bloodType}
          </Text>
          <Text>
            <strong>Gender:</strong> {selectedDonor?.gender}
          </Text>
          <Text>
            <strong>Age:</strong> {selectedDonor?.age}
          </Text>
          <Text>
            <strong>Contact Email:</strong> {selectedDonor?.contactEmail}
          </Text>
          <Text>
            <strong>Number of times donated:</strong>{" "}
            {selectedDonor?.donationCount}
          </Text>
          <Flex justify="end" mt="sm">
            <Button
              size="sm"
              leftSection={<IconEdit size={16} />}
              onClick={() => {
                setEditableDonor(selectedDonor);
                setIsEditing(true);
              }}
            >
              Edit Donor
            </Button>
          </Flex>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Donor"
        centered
        size="lg"
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (editableDonor) updateDonor.mutate(editableDonor);
          }}
        >
          <Stack gap="md" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Title order={5} c="blue">
              Personal Information
            </Title>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Full Name"
                  required
                  value={editableDonor?.name ?? ""}
                  onChange={(e) =>
                    setEditableDonor({ ...editableDonor!, name: e.target.value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Gender"
                  placeholder="Select"
                  data={["Male", "Female", "Others"]}
                  value={editableDonor?.gender ?? "Male"}
                  onChange={(val) =>
                    setEditableDonor({ ...editableDonor!, gender: val ?? "Male" })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Age"
                  type="number"
                  min={18}
                  value={editableDonor?.age.toString() ?? "18"}
                  onChange={(e) =>
                    setEditableDonor({
                      ...editableDonor!,
                      age: Number(e.target.value),
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Blood Type"
                  placeholder="Select"
                  data={[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    "O+",
                    "O-",
                  ]}
                  value={editableDonor?.bloodType ?? ""}
                  onChange={(val) =>
                    setEditableDonor({
                      ...editableDonor!,
                      bloodType: val ?? "",
                    })
                  }
                />
              </Grid.Col>
            </Grid>

            <Title order={5} c="blue">
              Contact Information
            </Title>
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Primary Email"
                  required
                  value={editableDonor?.email ?? ""}
                  onChange={(e) =>
                    setEditableDonor({ ...editableDonor!, email: e.target.value })
                  }
                  error={
                    editableDonor?.email && !validateEmail(editableDonor.email)
                      ? "Enter a valid email address (gmail, yahoo, or fatima)"
                      : updateDonor.error?.data?.code === "CONFLICT"
                        ? "Another user already uses this email."
                        : null
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Alternate Contact Email"
                  value={editableDonor?.contactEmail ?? ""}
                  onChange={(e) =>
                    setEditableDonor({
                      ...editableDonor!,
                      contactEmail: e.target.value,
                    })
                  }
                  error={
                    editableDonor?.contactEmail &&
                    !validateEmail(editableDonor.contactEmail)
                      ? "Enter a valid email address (gmail, yahoo, or fatima)"
                      : null
                  }
                />
              </Grid.Col>
            </Grid>

            <Title order={5} c="blue">
              Donation Information
            </Title>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Donation Count"
                  type="number"
                  min={0}
                  value={editableDonor?.donationCount.toString() ?? "0"}
                  onChange={(e) =>
                    setEditableDonor({
                      ...editableDonor!,
                      donationCount: Number(e.target.value),
                    })
                  }
                />
              </Grid.Col>
            </Grid>

            <Flex justify="flex-end" gap="sm" mt="md">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="green"
                loading={updateDonor.status === "pending"}
              >
                Save Changes
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmOpened}
        onClose={() => setDeleteConfirmOpened(false)}
        title="Confirm Deletion"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete {selectedDonorsToDelete.length} donor
            {selectedDonorsToDelete.length !== 1 ? "s" : ""}? This action cannot be undone.
          </Text>
          <Flex justify="flex-end" gap="sm" mt="md">
            <Button variant="outline" onClick={() => setDeleteConfirmOpened(false)}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                selectedDonorsToDelete.forEach((donorId: string) => {
                  deleteDonor.mutate(donorId);
                });
                setDeleteConfirmOpened(false);
              }}
              loading={deleteDonor.status === "pending"}
            >
              Delete
            </Button>
          </Flex>
        </Stack>
      </Modal>

      {/* Add Donor Modal */}
      <Modal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        title="Add New Donor"
        centered
        size="lg"
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            addDonor.mutate(newDonor);
          }}
        >
          <Stack gap="md" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Title order={5} c="blue">
              Personal Information
            </Title>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Full Name"
                  required
                  value={newDonor.name}
                  onChange={(e) =>
                    setNewDonor({ ...newDonor, name: e.target.value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Gender"
                  placeholder="Select"
                  data={["Male", "Female", "Others"]}
                  value={newDonor.gender}
                  onChange={(val) =>
                    setNewDonor({ ...newDonor, gender: val ?? "Male" })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Age"
                  type="number"
                  min={18}
                  value={newDonor.age.toString()}
                  onChange={(e) =>
                    setNewDonor({ ...newDonor, age: Number(e.target.value) })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Blood Type"
                  placeholder="Select"
                  data={[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    "O+",
                    "O-",
                  ]}
                  value={newDonor.bloodType}
                  onChange={(val) =>
                    setNewDonor({ ...newDonor, bloodType: val ?? "" })
                  }
                />
              </Grid.Col>
            </Grid>

            <Title order={5} c="blue">
              Contact Information
            </Title>
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Primary Email"
                  required
                  value={newDonor.email}
                  onChange={(e) =>
                    setNewDonor({ ...newDonor, email: e.target.value })
                  }
                  error={
                    newDonor.email && !validateEmail(newDonor.email)
                      ? "Enter a valid email address (gmail, yahoo, or fatima)"
                      : addDonor.error?.data?.code === "CONFLICT"
                        ? "Another user already uses this email."
                        : null
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Alternate Contact Email"
                  value={newDonor.contactEmail}
                  onChange={(e) =>
                    setNewDonor({ ...newDonor, contactEmail: e.target.value })
                  }
                  error={
                    newDonor.contactEmail && !validateEmail(newDonor.contactEmail)
                      ? "Enter a valid email address (gmail, yahoo, or fatima)"
                      : null
                  }
                />
              </Grid.Col>
            </Grid>

            <Title order={5} c="blue">
              Donation Information
            </Title>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Donation Count"
                  type="number"
                  min={0}
                  value={newDonor.donationCount.toString()}
                  onChange={(e) =>
                    setNewDonor({
                      ...newDonor,
                      donationCount: Number(e.target.value),
                    })
                  }
                />
              </Grid.Col>
            </Grid>

            <Flex justify="flex-end" gap="sm" mt="md">
              <Button variant="outline" onClick={() => setAddModalOpened(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                loading={addDonor.status === "pending"}
              >
                Add Donor
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
