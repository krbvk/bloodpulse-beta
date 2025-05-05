import { Card, Container, Text, Stack, Overlay, Button } from "@mantine/core";
import Link from "next/link";
import {IconDroplet, IconClock, IconHeartHandshake } from "@tabler/icons-react";
import Head from "next/head";

export default function Introduction() {
  return (
    <>
        <Head>
            <link rel="preload" href="/IntroductionImage1.svg" as="image" />
        </Head>
    <Card
      radius="0"
      p={0}
      m={0}
      style={{
        backgroundImage: "url('/IntroductionImage1.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Overlay
        color="#000"
        opacity={0.5}
        zIndex={0}
        style={{ position: "absolute", inset: 0 }}
      />

      <Container
        size="100%"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
          padding: "2rem 4rem",
        }}
      >
        {/* Left side */}
        <Stack
          gap="sm"
          style={{
            maxWidth: 600,
            textAlign: "left",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <Text
            size="48px"
            style={{
              fontWeight: 800,
              color: "#FF4D4D",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            Donate Blood
          </Text>

          <Text
            size="42px"
            style={{
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            Become a Hero Today
          </Text>

          <Text
            size="lg"
            style={{
              color: "#f1f1f1",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            One donation can save countless lives. Together, we bring life to those who need it most.
          </Text>

          <Text
            size="md"
            style={{
              color: "#dddddd",
              marginTop: "0.1rem",
              textAlign: "center",
            }}
          >
            &ldquo;Every drop counts. Be the reason someone gets a second chance at life. Step up and be a real-life hero.&rdquo;
          </Text>

          <Button
            component={Link}
            href="/login"
            size="lg"
            radius="md"
            color="red"
            mt="md"
            style={{ marginTop: "2rem", width: "fit-content", alignSelf: "center" }}
          >
            JOIN US NOW
          </Button>
        </Stack>

        {/* Right side */}
        <Stack
        gap="md"
        style={{
            maxWidth: 500,
            color: "#ffffff",
            padding: "2rem",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 77, 77, 0.4)",
            borderRadius: "12px",
        }}
        >
        {/* Impact stats */}
        <Text size="xl" style={{ fontWeight: 700, color: "#FF4D4D", textAlign: "center" }}>
            Why It Matters
        </Text>

        <Stack gap="sm" style={{ fontSize: "1.1rem", color: "#f0f0f0" }}>
            <Stack style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <IconHeartHandshake color="#FF4D4D" />
            <Text>One donation can save up to <strong>three lives</strong></Text>
        </Stack>

        <Stack style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <IconDroplet color="#FF4D4D" />
            <Text>Someone needs blood every <strong>2 seconds</strong></Text>
        </Stack>

        <Stack style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <IconClock color="#FF4D4D" />
            <Text>The process takes just <strong>10 minutes</strong></Text>
        </Stack>
        </Stack>

        {/* Testimonial */}
        <Text
            size="md"
            style={{
            fontStyle: "italic",
            marginTop: "1rem",
            color: "#e0e0e0",
            }}
        >
              &ldquo;I never thought a small act could mean so much — until I saw the gratitude in their eyes.&rdquo;
        </Text>
        <Text size="sm" style={{ textAlign: "right", color: "#aaaaaa" }}>
            — Klyde Cedric D.0
        </Text>
        </Stack>
      </Container>
    </Card>
    </>
  );
}
