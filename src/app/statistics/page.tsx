"use client";

import React, { useEffect, useState } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import StatisticsLayout from "@/components/Statistics/StatisticsLayout";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";

const StatisticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const { data: isUserDonor, isLoading: donorStatusLoading } =
    api.donor.getIsUserDonor.useQuery(undefined, {
      enabled: !!session?.user?.email,
    });

  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Redirect if not authenticated or not ADMIN
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (status === "authenticated") {
      const role = session?.user?.role;
      const allowed = role === "ADMIN";

      if (!allowed) {
        router.replace("/dashboard");
      }
    }
  }, [status, donorStatusLoading, session?.user?.role, router]);

  // Lock body scroll on mobile when sidebar is open
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

  if (status === "loading" || donorStatusLoading) {
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

      {/* Main content area */}
      <Flex style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Sidebar */}
        <DashboardSidebar
  isOpen={sidebarOpen}
  session={session}
  isUserDonor={isUserDonor?.isDonor} // this is now boolean | undefined
/>


        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <Box
            onClick={toggleSidebar}
            style={{
              position: "fixed",
              top: 60, // below navbar
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 998,
            }}
          />
        )}

        {/* Statistics content */}
        <Box
          style={{
            flex: 1,
            marginLeft: !isMobile && sidebarOpen ? 250 : 0,
            transition: "margin-left 0.3s ease-in-out",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
            padding: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <StatisticsLayout />
        </Box>
      </Flex>
    </Box>
  );
};

export default StatisticsPage;
