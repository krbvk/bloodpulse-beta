"use client";

import { useState, useEffect } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DonorLayout from "@/components/Donors/DonorLayout";
import CustomLoader from "@/components/Loader/CustomLoader";
import { api } from "@/trpc/react";
import { useMediaQuery } from "@mantine/hooks";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: isUserDonor, isLoading: donorStatusLoading } =
    api.donor.getIsUserDonor.useQuery(undefined, {
      enabled: !!session?.user?.email,
    });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/"); // Kick out if not logged in
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.replace("/dashboard"); // Kick out if not admin
      }
    }
  }, [status, session?.user?.role, router]);

  // Lock/unlock scroll when sidebar is open on mobile
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

  if (session?.user?.role !== "ADMIN") {
    return null;
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
          isUserDonor={isUserDonor?.isDonor}
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

        {/* Donor content */}
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
          <DonorLayout />
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
