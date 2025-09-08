"use client";

import React, { useEffect, useState } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DonorProfileLayout from "@/components/Profile/DonorProfileLayout";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    data: isUserDonor,
    isLoading: isUserDonorLoading,
  } = api.donor.getIsUserDonor.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Prevent scrolling when sidebar is open on mobile
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

  // Authentication & role check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (status === "authenticated" && !isUserDonorLoading) {
      const role = session?.user?.role;
      const allowed = role === "ADMIN" || isUserDonor;

      if (!allowed) {
        router.replace("/dashboard");
      }
    }
  }, [status, isUserDonorLoading, isUserDonor, session?.user?.role, router]);

  if (status === "loading" || isUserDonorLoading) {
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
          isOpen={sidebarOpen}
          session={session}
          isUserDonor={isUserDonor?.isDonor}
        />

        {/* Profile content */}
        <Box
          style={{
            flex: 1,
            // Shift content on desktop only, overlay on mobile
            marginLeft: !isMobile && sidebarOpen ? 250 : 0,
            transition: "margin-left 0.3s ease-in-out",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
            padding: "20px",
          }}
        >
          <DonorProfileLayout />
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
