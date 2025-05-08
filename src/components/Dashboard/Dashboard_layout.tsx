"use client";

import { useSession, signOut } from "next-auth/react";
import { Button, Text, Stack, Paper, Box, Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import Image from "next/image";

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

const isGoogleImage = (url: string) => {
  return url.includes("lh3.googleusercontent.com");
};

const DashboardLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return (
      <Paper
        radius="lg"
        p="xl"
        mt={96}
        mx="auto"
        withBorder
        style={{ maxWidth: 400, backgroundColor: "#fff0f0" }}
      >
        <Text color="red">Unauthorized! Please sign in to access this page.</Text>
      </Paper>
    );
  }

  const { name, email, image } = session.user ?? {};
  const initials = name ? getInitials(name) : "";

  let imageUrl = image ?? "";
  if (imageUrl && !imageUrl.includes("sz=")) {
    const separator = imageUrl.includes("?") ? "&" : "?";
    imageUrl = `${imageUrl}${separator}sz=200`;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Paper
      shadow="lg"
      radius="lg"
      p="xl"
      mt={96}
      mx="auto"
      withBorder
      style={{ maxWidth: 400, backgroundColor: "#ffffff" }}
    >
      <Stack gap="lg" align="center">
        {imageUrl ? (
          isGoogleImage(imageUrl) ? (
            <Box style={{ position: "relative", width: 120, height: 120 }}>
              <Image
                src={imageUrl}
                alt={name ?? "User Avatar"}
                fill
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                sizes="(max-width: 768px) 120px, 200px"
              />
            </Box>
          ) : (
            <Box
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={imageUrl}
                alt={name ?? "User Avatar"}
                width={120}
                height={120}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          )
        ) : (
          <Avatar
            radius="xl"
            size={120}
            color="gray"
            style={{ backgroundColor: "#ccc", fontSize: 36 }}
          >
            {initials}
          </Avatar>
        )}
        <Text size="xl" fw={700} c="red.8" ta="center">
          Welcome, {name}
        </Text>
        <Text size="md" c="gray.6" ta="center">
          {email}
        </Text>

        <Button
          onClick={handleSignOut}
          fullWidth
          size="lg"
          color="red"
          variant="filled"
        >
          Sign Out
        </Button>
      </Stack>
    </Paper>
  );
};

export default DashboardLayout;
