"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Text, Box, Flex, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  IconLogout,
  IconHome,
  IconUser,
  IconListCheck,
  IconCalendarPlus,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";

type SidebarProps = {
  isOpen: boolean;
  session: Session | null;
};

const DashboardSidebar = ({ isOpen, session }: SidebarProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // console.log("Session Data:", session);
  // console.log("User Role:", role);

  const { data: isUserDonor, isLoading: donorStatusLoading } = api.donor.getIsUserDonor.useQuery(undefined, {
    enabled: !!session?.user?.email,
  });

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role !== "ADMIN" && window.location.pathname === "/donors") {
      router.push("/dashboard");
    }
  }, [session?.user?.role, router]);

    if (!session || !session.user) {
      return null;
    }

  if (loading) {
    return <CustomLoader />;
  }

  const { role } = session.user;

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

      <Flex direction="column" gap={30} align="flex-start">
        <UnstyledButton onClick={() => router.push("/dashboard")}>
          <Flex align="center" gap="xs">
            <IconHome size={20} color="white" />
            <Text size="sm" c="white">Dashboard</Text>
          </Flex>
        </UnstyledButton>

        {!isUserDonor && (role === "USER" || role === "ADMIN") && (
        <UnstyledButton onClick={() => router.push("/profile")}>
          <Flex align="center" gap="xs">
            <IconUser size={20} color="white" />
            <Text size="sm" c="white">User Profile</Text>
          </Flex>
        </UnstyledButton>
        )}

        {isUserDonor && (role === "ADMIN" || role === "USER") && (
          <UnstyledButton onClick={() => router.push("/donor-profile")}>
            <Flex align="center" gap="xs">
              <IconUser size={20} color="white" />
              <Text size="sm" c="white">Donor Profile</Text>
            </Flex>
          </UnstyledButton>
        )}

        {role === "ADMIN" && (
          <UnstyledButton onClick={() => router.push("/donors")}>
            <Flex align="center" gap="xs">
              <IconListCheck size={20} color="white" />
              <Text size="sm" c="white">Donor List</Text>
            </Flex>
          </UnstyledButton>
        )}
        
        <UnstyledButton onClick={() => router.push("/appointments")}>
          <Flex align="center" gap="xs">
            <IconCalendarPlus size={20} color="white" />
            <Text size="sm" c="white">Book Appointment</Text>
          </Flex>
        </UnstyledButton>

        <UnstyledButton onClick={handleSignOut}>
          <Flex align="center" gap="xs">
            <IconLogout size={20} color="white" />
            <Text size="sm" c="white">Sign Out</Text>
          </Flex>
        </UnstyledButton>
      </Flex>
    </Box>
  );
};

export default DashboardSidebar;
