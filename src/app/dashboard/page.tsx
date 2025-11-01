"use client";

import { useSession } from "next-auth/react";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { Box, Flex, Center } from "@mantine/core";
import { useState, useEffect } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";
import { useMediaQuery } from "@mantine/hooks";
import MetricsLayout from "@/components/Metrics/MetricsLayout";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { data: isUserDonor, isLoading: donorStatusLoading } =
    api.donor.getIsUserDonor.useQuery(undefined, {
      enabled: !!session?.user?.email,
    });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [isMobile, isSidebarOpen]);

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

      {/* Main content area below navbar */}
      <Flex style={{ flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          session={session}
          isUserDonor={isUserDonor?.isDonor}
        />


        {/* Content area */}
     <Box
  style={{
    flex: 1,
    marginLeft: !isMobile && isSidebarOpen ? 250 : 0,
    transition: "margin-left 0.3s ease-in-out",
    overflowY: "auto",
    height: "calc(100vh - 60px)",
    padding: "20px",
  }}
>
  <MetricsLayout />
 <DashboardContent session={session} />


         
        </Box>
      </Flex>
    </Box>
  );
}
