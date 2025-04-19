"use client";

import { signIn, signOut, useSession } from "next-auth/react"; 
import { Button, Text, VStack, Box, Image } from "@chakra-ui/react";  // Chakra UI's Image component

// Function to get the initials from the user's name
const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);  // Get first two initials
};

export function SignIn() {
  const { data: session, status } = useSession(); 

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  // If no session (user not logged in), show the sign-in button
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
        <VStack gap={6}>
          <Text fontSize="2xl" fontWeight="bold" color="red.800">
            Welcome to Bloodpulse
          </Text>
          <Button
            onClick={() => signIn("google")}
            colorScheme="red"
            width="100%"
            size="lg"
          >
            Sign In with Google
          </Button>
        </VStack>
      </Box>
    );
  }

  // If session exists (user is logged in), show user info
  const { name, email, image } = session.user || {};
  const initials = name ? getInitials(name) : "";

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
        {image ? (
          <Image 
            src={image}
            alt={name || "User Avatar"}
            boxSize="120px"
            borderRadius="full"
            objectFit="cover"
            boxShadow="md"
          />
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
          onClick={() => signOut()}
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
}
