"use client";

import { signIn, useSession } from "next-auth/react";
import { Button, Text, Box } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconBrandFacebook } from '@tabler/icons-react';

export function FacebookSignInButton() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    const response = await signIn("facebook");
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
        color="blue"
        variant="filled"
        leftSection={<IconBrandFacebook size={24} />}
      >
        Sign In with Facebook
      </Button>
    </Box>
  );
}
