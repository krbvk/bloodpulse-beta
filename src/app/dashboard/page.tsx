"use client";

import { useSession } from "next-auth/react";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { Box, Flex, Center } from "@mantine/core";
import { useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (status === "loading") {
    return (
      <Center h="100vh">
        <CustomLoader />
      </Center>
    );
  }

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Box style={{ height: "60px", flexShrink: 0 }}>
        <DashboardNavbar toggleSidebar={toggleSidebar} session={session} />
      </Box>

      {/* Main content area below navbar */}
      <Flex style={{ flex: 1, overflow: "hidden" }}>
        <DashboardSidebar isOpen={isSidebarOpen} session={session} />

        <Box
          style={{
            flex: 1,
            marginLeft: isSidebarOpen ? 250 : 0,
            transition: "margin-left 0.3s ease-in-out",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
            padding: "20px",
          }}
        >
          <DashboardContent session={session} />
        </Box>
      </Flex>
    </Box>
  );
}
