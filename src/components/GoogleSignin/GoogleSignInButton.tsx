"use client";

import { signIn, useSession } from "next-auth/react";
import { Button, Text, Stack, Paper } from "@mantine/core";
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
    <Paper
      shadow="md"
      radius="lg"
      p="xl"
      mt={96}
      mx="auto"
      withBorder
      style={{ maxWidth: 400, backgroundColor: "#fff0f0" }}
    >
      <Stack gap="lg">
        <Button
          onClick={handleSignIn}
          fullWidth
          size="lg"
          color="red"
          variant="filled"
        >
          Sign In with Google
        </Button>
      </Stack>
    </Paper>
  );
}
