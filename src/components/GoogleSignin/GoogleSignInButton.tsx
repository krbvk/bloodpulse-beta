"use client";

import { signIn, useSession } from "next-auth/react";
import { Button, Text, Box } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconBrandGoogle } from '@tabler/icons-react';

export function GoogleSignInButton() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    const response = await signIn("google");
    if (response?.ok) {
      router.push("/dashboard");
    }
  };

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  return (
    <Box style={{ width: 300 }}>
      <Button
        fullWidth
        h={50}
        onClick={handleSignIn}
        size="lg"
        color="red"
        variant="filled"
        leftSection={<IconBrandGoogle size={24} />}
      >
        Sign In with Google
      </Button>
    </Box>
  );
}
