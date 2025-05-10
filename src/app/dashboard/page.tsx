"use client";

import DashboardContent from "@/components/Dashboard/DashboardContent";
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
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Box style={{ height: "60px", flexShrink: 0 }}>
        <DashboardNavbar toggleSidebar={toggleSidebar} />
      </Box>

      {/* Main content area below navbar */}
      <Flex style={{ flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <DashboardSidebar isOpen={isSidebarOpen} />

        {/* Main content */}
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
          <DashboardContent />
        </Box>
      </Flex>
    </Box>
  );
}
