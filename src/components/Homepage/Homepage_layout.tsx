"use client";

import { useSession, signOut } from "next-auth/react";
import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

const HomePageLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return (
      <Box
        maxW="sm"
        mx="auto"
        mt={24}
        p={8}
        bg="red.50"
        borderRadius="lg"
        boxShadow="md"
      >
        <Text>Unauthorized! Please sign in to access this page.</Text>
      </Box>
    );
  }

  const { name, email, image } = session.user ?? {};
  const initials = name ? getInitials(name) : "";

  let imageUrl = image ?? "";

  if (imageUrl && !imageUrl.includes("sz=")) {
    imageUrl = `${imageUrl}?sz=200`; 
  }

  console.log("User Image URL:", imageUrl);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={24}
      p={8}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack gap={6}>
        {imageUrl ? (
          <Box position="relative" width="120px" height="120px">
            <Image
              src={imageUrl}
              alt={name || "User Avatar"}
              layout="fill"
              objectFit="cover"
              style={{
                borderRadius: "50%",
                boxShadow: "md",
              }}
            />
          </Box>
        ) : (
          <Box
            borderRadius="full"
            boxSize="120px"
            bg="gray.300"
            display="flex"
            justifyContent="center"
            alignItems="center"
            color="white"
            fontSize="3xl"
            boxShadow="md"
          >
            {initials}
          </Box>
        )}
        <Text fontSize="2xl" fontWeight="bold" color="red.800" textAlign="center">
          Welcome, {name}
        </Text>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          {email}
        </Text>

        <Button
          onClick={handleSignOut}
          colorScheme="red"
          width="100%"
          size="lg"
          boxShadow="md"
        >
          Sign Out
        </Button>
      </VStack>
    </Box>
  );
};

export default HomePageLayout;
