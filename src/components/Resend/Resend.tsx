"use client";

import { signIn, useSession } from "next-auth/react";
import {
  Button,
  Text,
  Stack,
  Paper,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function ResendSignIn() {
  const { status } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const resendAction = async (formData: FormData) => {
    const email = formData.get("email");

    if (typeof email !== "string") {
      console.error("Email must be a string");
      return;
    }

    setLoading(true);

    const res = await signIn("resend", {
      email,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/resend-email"); 
    }
  };

  if (status === "loading" || loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Paper
      shadow="md"
      radius="lg"
      p="xl"
      mt="md"
      mx="auto"
      withBorder
      style={{ maxWidth: 400, width: "100%", backgroundColor: "white" }}
    >
      <form action={resendAction} ref={formRef} style={{ width: "100%" }}>
        <Stack gap="lg">
          <Text style={{ textAlign: "center"}} size="md" c="black">
            or sign in through email
          </Text>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            name="email"
            type="email"
            required
          />
          <Button type="submit" size="lg" color="blue" fullWidth>
            Sign in with Email
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
