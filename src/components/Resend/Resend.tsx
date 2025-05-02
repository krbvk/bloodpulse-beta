"use client";

import { signIn, useSession } from "next-auth/react";
import {
  Button,
  Text,
  Stack,
  Paper,
  TextInput,
  Group,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function ResendSignIn() {
  const { status } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [emailSent, setEmailSent] = useState(false); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const resendAction = async (formData: FormData) => {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    setLoading(true); 

    const res = await signIn("resend", {
      ...data,
      redirect: false, 
    });

    setLoading(false); 

    if (res?.ok) {
      setEmailSent(true); 
    } else {
      setEmailSent(false);
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
      mt={48}
      mx="auto"
      withBorder
      style={{ maxWidth: 400, backgroundColor: "#fff0f0" }}
    >
      {emailSent ? (
        <Text style={{ textAlign: "center", color: "green" }}>
          Check your email for the sign-in link!
        </Text>
      ) : (
        <form action={resendAction} ref={formRef}>
          <Stack gap="lg">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              name="email"
              type="email"
              required
            />
            <Group grow>
              <Button type="submit" size="lg" color="blue">
                Sign in with Email (Resend)
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
