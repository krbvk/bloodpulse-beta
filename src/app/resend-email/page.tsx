"use client";

import Navbar from "@/components/Navbar/Homepage";
import EmailMessage from "@/components/Resend/Message";
import { Box, Text, Paper } from "@mantine/core";

export default function Message() {
  return (
    <div>
      <Navbar />
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundImage: `
          linear-gradient(to right, #d32f2f 2px, transparent 2px),
          linear-gradient(to bottom, #d32f2f 2px, transparent 2px)
        `,
          backgroundSize: "100px 100px",
          backgroundPosition: "center center",
        }}
      >
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          withBorder
          style={{
            maxWidth: 550, 
            width: "100%",
            backgroundColor: "#333", 
            borderColor: "rgba(0, 0, 0, 0.7)", 
          }}
        >
          <Text
            size="xl"
            style={{
              marginBottom: "30px", 
              fontSize: "40px", 
              fontWeight: 800, 
              textAlign: "center",
              color: "white", 
            }}
          >
            BLOODPULSE:LOGO
          </Text>

          <Text
            size="lg"
            style={{
              marginBottom: "30px", 
              textAlign: "center",
              color: "white", 
              fontWeight: 600, 
            }}
          >
            Sign Up or Log In
          </Text>

          <EmailMessage />
        </Paper>
      </Box>
    </div>
  );
}
