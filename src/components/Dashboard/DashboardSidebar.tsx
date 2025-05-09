"use client";

import { useSession, signOut } from "next-auth/react";
import { Text, Box, Flex, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  IconLogout,
  IconHome,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

type SidebarProps = {
  isOpen: boolean;
};

const DashboardSidebar = ({ isOpen }: SidebarProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;
  if (!session) return null;

  const { name } = session.user ?? {};

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Box
      style={{
        height: "100vh",
        width: 250,
        position: "fixed",
        top: 60,
        left: isOpen ? 0 : -260,
        backgroundColor: "#222222",
        color: "white",
        padding: "20px 10px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 6px rgba(0, 0, 0, 0.1)",
        transition: "left 0.3s ease-in-out",
        zIndex: 1000,
      }}
    >
      <Flex justify="center" mb="xl">
        <Text fw={700} size="lg" color="white">
          My Dashboard
        </Text>
      </Flex>

      <Flex justify="center" mb="xl">
        <Text size="sm" color="white">
          Welcome, {name}
        </Text>
      </Flex>

      <Flex direction="column" gap="sm" align="flex-start">
        <UnstyledButton onClick={() => router.push("/dashboard")}>
          <Flex align="center" gap="xs">
            <IconHome size={20} color="white" />
            <Text size="sm" color="white">Dashboard</Text>
          </Flex>
        </UnstyledButton>

        <UnstyledButton onClick={() => router.push("/profile")}>
          <Flex align="center" gap="xs">
            <IconUser size={20} color="white" />
            <Text size="sm" color="white">Profile</Text>
          </Flex>
        </UnstyledButton>

        <UnstyledButton onClick={() => router.push("/settings")}>
          <Flex align="center" gap="xs">
            <IconSettings size={20} color="white" />
            <Text size="sm" color="white">Settings</Text>
          </Flex>
        </UnstyledButton>

        <UnstyledButton onClick={handleSignOut}>
          <Flex align="center" gap="xs">
            <IconLogout size={20} color="white" />
            <Text size="sm" color="white">Sign Out</Text>
          </Flex>
        </UnstyledButton>
      </Flex>
    </Box>
  );
};

export default DashboardSidebar;
