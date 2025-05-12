"use client";

import React, { useState } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import CustomLoader from "@/components/Loader/CustomLoader";
import AppointmentLayout from "@/components/Appointments/AppointmentLayout";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Box style={{ height: "60px", flexShrink: 0 }}>
        <DashboardNavbar toggleSidebar={toggleSidebar} session={session} />
      </Box>

      {/* Main content below navbar */}
      <Flex style={{ flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} session={session} />

        {/* Appointment content area */}
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
          {status === "loading" ? (
            <Center h="100%">
              <CustomLoader />
            </Center>
          ) : status === "unauthenticated" ? (
            <Center h="100%">
              <CustomLoader />
            </Center>
          ) : (
            <AppointmentLayout />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
