"use client";

import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { Box, Flex } from "@mantine/core";
import { useState } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <DashboardNavbar toggleSidebar={toggleSidebar} />
      <Flex style={{ flex: 1 }}>
        <DashboardSidebar isOpen={isSidebarOpen} />
        <Box
          style={{
            marginLeft: isSidebarOpen ? 250 : 0,
            flex: 1,
            padding: "20px",
            marginTop: "60px",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {/* Main Content */}
        </Box>
      </Flex>
    </Box>
  );
}
