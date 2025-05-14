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
  Divider,
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
}

export default function DonorLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: donors = [], isLoading } = api.donor.getAll.useQuery() as { data: Donor[]; isLoading: boolean };
  const utils = api.useUtils();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [addModalOpened, setAddModalOpened] = useState<boolean>(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [selectedDonorsToDelete, setSelectedDonorsToDelete] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableDonor, setEditableDonor] = useState<Donor | null>(null);
  const [newDonor, setNewDonor] = useState<Omit<Donor, "id">>({
    name: "",
    email: "",
    bloodType: "",
    contactEmail: "",
    donationCount: 0,
  });

  const addDonor = api.donor.create.useMutation({
    onSuccess: async () => {
      await utils.donor.getAll.invalidate();
      setAddModalOpened(false);
      setNewDonor({ name: "", email: "", bloodType: "", contactEmail: "", donationCount: 0 });
    },
  });

  const deleteDonor = api.donor.delete.useMutation({
    onSuccess: async () => {
      await utils.donor.getAll.invalidate();
      setDeleteModalOpened(false);
      setSelectedDonorsToDelete([]);
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
    return donors.filter((donor) =>
      donor.bloodType.toLowerCase().includes(searchQuery.toLowerCase())
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
    selectedDonorsToDelete.forEach((donorId: string) => {
      deleteDonor.mutate(donorId);
    });
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
              <ActionIcon variant="filled" color="blue" size="md" onClick={() => setAddModalOpened(true)}>
                <IconPlus size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete Donor(s)" withArrow>
              <ActionIcon variant="filled" color="red" size="md" onClick={() => setDeleteModalOpened(true)}>
                <IconTrash size={20} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Stack>

        <Text size="sm" ta="center" mb="sm">
          Found {filteredDonors.length} donor{filteredDonors.length !== 1 ? "s" : ""}
        </Text>

        {filteredDonors.length === 0 ? (
          <Text ta="center" c="dimmed">
            No donors found.
          </Text>
        ) : (
          <Grid gutter="md">
            {filteredDonors.map((donor) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={donor.id}>
                <Box p="md" style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
                  <Stack align="center" gap="xs">
                    <Text fw={700} size="lg" ta="center">
                      {donor.name}
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                      Blood Type: {donor.bloodType}
                    </Text>
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
                  </Stack>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Paper>

      <Modal opened={modalOpened} onClose={() => { setModalOpened(false); setIsEditing(false); }} title="Donor Details" centered closeButtonProps={{"aria-label": "Close", onClick: () => {
        setModalOpened(false);
        setIsEditing(false);
      }}}>
        {!isEditing ? (
          <Stack gap="xs">
            <Text><strong>Name:</strong> {selectedDonor?.name}</Text>
            <Text><strong>Email:</strong> {selectedDonor?.email}</Text>
            <Text><strong>Blood Type:</strong> {selectedDonor?.bloodType}</Text>
            <Text><strong>Contact Email:</strong> {selectedDonor?.contactEmail}</Text>
            <Text><strong>Number of times donated:</strong> {selectedDonor?.donationCount}</Text>
            <ActionIcon onClick={() => { setIsEditing(true); setEditableDonor(selectedDonor); }}>
              <IconEdit size={18} />
            </ActionIcon>
          </Stack>
        ) : (
          <Stack>
            <TextInput
              label="Name"
              value={editableDonor?.name ?? ""}
              onChange={(e) => setEditableDonor({ ...editableDonor!, name: e.target.value })}
            />
            <TextInput
              label="Email"
              value={editableDonor?.email ?? ""}
              onChange={(e) => setEditableDonor({ ...editableDonor!, email: e.target.value })}
            />
            <Select
              label="Blood Type"
              data={["A", "B", "AB", "O"]}
              value={editableDonor?.bloodType ?? ""}
              onChange={(val) => setEditableDonor({ ...editableDonor!, bloodType: val ?? "" })}
            />
            <TextInput
              label="Contact Email"
              value={editableDonor?.contactEmail ?? ""}
              onChange={(e) => setEditableDonor({ ...editableDonor!, contactEmail: e.target.value })}
            />
            <TextInput
              label="Donation Count"
              type="number"
              value={editableDonor?.donationCount.toString() ?? "0"}
              onChange={(e) => setEditableDonor({ ...editableDonor!, donationCount: Number(e.target.value) })}
            />
            <Flex justify="end" gap="sm" mt="md">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button
                color="green"
                onClick={() => {
                  if (editableDonor) updateDonor.mutate(editableDonor);
                }}
                loading={updateDonor.status === "pending"}
              >
                Save Changes
              </Button>
            </Flex>
          </Stack>
        )}
      </Modal>

      <Modal opened={addModalOpened} onClose={() => setAddModalOpened(false)} title="Add Donor" centered>
        <Stack>
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            value={newDonor.name}
            onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
          />
          <TextInput
            label="Email"
            placeholder="john@example.com"
            value={newDonor.email}
            error={emailError}
            onChange={(e) => {
              const value = e.target.value;
              setNewDonor({ ...newDonor, email: value });

              const validDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
              const isValidFormat = validDomains.some((domain) => value.endsWith(domain));
              const isEmailUsed = donors.some((donor) => donor.email.toLowerCase() === value.toLowerCase());

              if (!value.includes("@") || !isValidFormat) {
                setEmailError("Email must be from gmail.com, yahoo.com, outlook.com, or hotmail.com");
              } else if (isEmailUsed) {
                setEmailError("This email is already used by another donor");
              } else {
                setEmailError("");
              }
            }}
          />
          <Select
            label="Blood Type"
            placeholder="Select"
            data={["A", "B", "AB", "O"]}
            value={newDonor.bloodType}
            onChange={(val) => setNewDonor({ ...newDonor, bloodType: val ?? "" })}
          />
          <TextInput
            label="Contact Email"
            placeholder="donoremail@example.com"
            value={newDonor.contactEmail}
            onChange={(e) => setNewDonor({ ...newDonor, contactEmail: e.target.value })}
          />
          <TextInput
            label="Donation Count"
            placeholder="0"
            type="number"
            min={0}
            value={newDonor.donationCount.toString()}
            onChange={(e) => setNewDonor({ ...newDonor, donationCount: Number(e.target.value) })}
          />
          <Button
            onClick={() => addDonor.mutate({ ...newDonor })}
            loading={addDonor.status === "pending"}
            fullWidth
            disabled={!newDonor.email || !!emailError}
          >
            Submit
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Donor(s)"
        centered
        size="lg"
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            Select the donor(s) you want to delete. This action cannot be undone.
          </Text>
          <Box
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "0.5rem",
            }}
          >
            <Stack gap="xs">
              {filteredDonors.length === 0 ? (
                <Text ta="center" c="dimmed">
                  No donors available to delete.
                </Text>
              ) : (
                filteredDonors.map((donor) => (
                  <Checkbox
                    key={donor.id}
                    label={
                      <Text size="sm">
                        Name: {donor.name} &mdash; Email: {donor.email}
                      </Text>
                    }
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
                  />
                ))
              )}
            </Stack>
          </Box>
          <Divider />
          <Flex justify="space-between" align="center">
            <Text size="xs" c="dimmed">
              Selected: {selectedDonorsToDelete.length}
            </Text>
            <Flex gap="sm">
              <Button variant="outline" onClick={() => setDeleteModalOpened(false)}>
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleDeleteSelected}
                disabled={selectedDonorsToDelete.length === 0}
                loading={deleteDonor.status === "pending"}
              >
                Delete Selected
              </Button>
            </Flex>
          </Flex>
        </Stack>
      </Modal>
    </Box>
  );
}
