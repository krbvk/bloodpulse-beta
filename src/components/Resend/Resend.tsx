"use client";

import { signIn } from "next-auth/react";
import {
  Button, Text, Stack, Paper, TextInput, Notification,
} from "@mantine/core";
import { useState, useRef } from "react";
import { IconMail } from "@tabler/icons-react";

export function ResendSignIn() {
  const formRef = useRef<HTMLFormElement>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const emailInput = formData.get("email") as string;
    setEmail(emailInput);

    setLoading(true);
    const res = await fetch("/api/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput }),
    });
    if (res.ok) {
      setNotification("OTP sent to your email!");
      setShowOtp(true);
    } else {
      setNotification("Failed to send OTP");
    }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const otp = formData.get("otp") as string;

    setLoading(true);
    const res = await signIn("credentials", {
      email,
      otp,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    if (res?.url) {
      window.location.href = res.url;
    }
  };

  return (
    <Paper shadow="md" radius="lg" p="xl" mt="md" mx="auto" withBorder style={{ maxWidth: 400, width: "100%" }}>
      <form ref={formRef} onSubmit={showOtp ? verifyOtp : requestOtp}>
        <Stack gap="lg">
          <Text ta="center" size="md">Login with Email OTP</Text>

          {!showOtp ? (
            <TextInput label="Email" name="email" type="email" required />
          ) : (
            <TextInput label="Enter OTP" name="otp" required />
          )}

          <Button type="submit" size="lg" color="blue" fullWidth>
            {showOtp ? "Verify OTP" : "Send OTP"}
          </Button>
        </Stack>
      </form>

      {notification && (
        <Notification
          icon={<IconMail size={18} />}
          color="green"
          onClose={() => setNotification("")}
          style={{ marginTop: "20px" }}
        >
          {notification}
        </Notification>
      )}
    </Paper>
  );
}

