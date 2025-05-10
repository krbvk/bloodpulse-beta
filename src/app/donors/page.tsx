"use client";

import React, { useState } from "react";
import { Box, Center, Flex, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DonorLayout from "@/components/Donors/DonorLayout";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (status === "loading") {
    return (
      <Center h="100vh">
        <Loader size="lg" />
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
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} session={session} />

        {/* Donor content */}
        <Box
          style={{
            flex: 1,
            marginLeft: sidebarOpen ? 250 : 0,
            transition: "margin-left 0.3s ease-in-out",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
            padding: "20px",
          }}
        >
          <DonorLayout />
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
