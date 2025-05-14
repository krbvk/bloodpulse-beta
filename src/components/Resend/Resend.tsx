"use client";

import { signIn, useSession } from "next-auth/react";
import {
  Button,
  Text,
  Stack,
  Paper,
  TextInput,
  Notification,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IconMail } from "@tabler/icons-react";
import CustomLoader from "../Loader/CustomLoader";

export function ResendSignIn() {
  const { status } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const resendAction = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(formRef.current!);
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
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CustomLoader />
      </div>
    );
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
      <form ref={formRef} onSubmit={resendAction} style={{ width: "100%" }}>
        <Stack gap="lg">
          <Text style={{ textAlign: "center" }} size="md" c="black">
            Continue with Email
          </Text>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            name="email"
            type="email"
            required
          />
          <Button type="submit" size="lg" color="blue" fullWidth>
            Send login link
          </Button>
        </Stack>
      </form>

      {showNotification && (
        <Notification
          icon={<IconMail size={18} />}
          title="Check your email!"
          color="green"
          onClose={() => setShowNotification(false)}
          style={{
            marginTop: "20px",
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "600px",
            maxWidth: "90vw"
          }}
        >
          Check your email for the sign-in link! 
          <br />
          If you can&apos;t find the email, be sure to check your spam or junk folder.
        </Notification>
      )}
    </Paper>
  );
}
