"use client";

import { signIn, useSession } from "next-auth/react"; 
import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SignIn() {
  const { status } = useSession(); 
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/homepage");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    const response = await signIn("google");

    if (response?.ok) {
      router.push("/homepage");
    } 
  };

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

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
        <Button
          onClick={handleSignIn}
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
