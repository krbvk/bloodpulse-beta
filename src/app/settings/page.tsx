"use client";

import React, { useState } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const { data: isUserDonor, isLoading: donorStatusLoading } = api.donor.getIsUserDonor.useQuery(undefined, {
          enabled: !!session?.user?.email,
  });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
        <DashboardSidebar isOpen={sidebarOpen} session={session} isUserDonor={isUserDonor}/>

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
          {/* <ProfileLayout /> */}
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
