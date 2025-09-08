"use client";

import React, { useState, useEffect } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import CustomLoader from "@/components/Loader/CustomLoader";
import AppointmentLayout from "@/components/Appointments/AppointmentLayout";
import { api } from "@/trpc/react";
import { useMediaQuery } from "@mantine/hooks";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const { data: isUserDonor, isLoading: donorStatusLoading } =
    api.donor.getIsUserDonor.useQuery(undefined, {
      enabled: !!session?.user?.email,
    });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Prevent content from moving/scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [isMobile, sidebarOpen]);

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Box style={{ height: "60px", flexShrink: 0 }}>
        <DashboardNavbar toggleSidebar={toggleSidebar} session={session} />
      </Box>

      {/* Main content below navbar */}
      <Flex style={{ flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          session={session}
          isUserDonor={isUserDonor?.isDonor}
        />

        {/* Appointment content area */}
        <Box
          style={{
            flex: 1,
            // Only shift content on desktop, not mobile
            marginLeft: !isMobile && sidebarOpen ? 250 : 0,
            transition: "margin-left 0.3s ease-in-out",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
            padding: "20px",
          }}
        >
          {status === "loading" || donorStatusLoading ? (
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
