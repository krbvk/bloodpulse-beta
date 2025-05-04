"use client";

import { Box, Stack, Flex } from "@mantine/core";
import { GoogleSignInButton } from "../GoogleSignin/GoogleSignInButton";
import { FacebookSignInButton } from "../Facebook/FacebookSignInButton";
import { ResendSignIn } from "../Resend/Resend";

export default function Options() {
  return (
    <Flex
    
      align="center"
      justify="center"
      style={{
        height: "100vh",
        backgroundImage: `
        linear-gradient(to right, #d32f2f 2px, transparent 2px),
        linear-gradient(to bottom, #d32f2f 2px, transparent 2px)
      `,
        backgroundSize: "100px 100px",
        backgroundPosition: "center center",
      }}
    >
      <Box
        style={{
          padding: 24,
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: 12,
          maxWidth: 500,
          width: "100%",
        }}
      >
        <Flex direction="column" align="center" justify="center">
          <Stack gap="md" align="center" style={{ width: "100%" }}>
            <GoogleSignInButton />
            <FacebookSignInButton />
            <ResendSignIn />
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
}
