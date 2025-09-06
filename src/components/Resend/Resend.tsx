"use client";

import { signIn, useSession } from "next-auth/react";
import {
  Button,
  Text,
  Stack,
  Paper,
  TextInput,
  Notification,
  Modal,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IconMail } from "@tabler/icons-react";
import CustomLoader from "../Loader/CustomLoader";

export function ResendSignIn() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(formRef.current!);
    const emailValue = formData.get("email");

    if (typeof emailValue !== "string") {
      console.error("Email must be a string");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ email: emailValue }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      setEmail(emailValue);
      setShowNotification(true);
      setOtpModalOpen(true);
      setTimeout(() => setShowNotification(false), 5000);
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);

    const res = await signIn("otp-login", {
      email,
      code: otpCode,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      setOtpModalOpen(false);
      router.push("/dashboard");
    } else {
      alert("Invalid OTP. Please try again.");
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
    <>
      <Paper
        shadow="md"
        radius="lg"
        p="xl"
        mt="md"
        mx="auto"
        withBorder
        style={{ maxWidth: 400, width: "100%", backgroundColor: "white" }}
      >
        <form ref={formRef} onSubmit={handleSendOtp} style={{ width: "100%" }}>
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
              Send Login Code
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
              maxWidth: "90vw",
            }}
          >
            We’ve sent a 6-digit OTP to your email. Please enter it below.
          </Notification>
        )}
      </Paper>

      {/* OTP Modal */}
      <Modal
        opened={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title="Enter OTP"
        centered
      >
        <Stack gap="md">
          <TextInput
            label={`OTP sent to ${email}`}
            placeholder="Enter 6-digit code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.currentTarget.value)}
          />
          <Button onClick={handleVerifyOtp} fullWidth color="blue">
            Verify Code
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
