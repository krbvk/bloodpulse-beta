"use client";

import { Text, Paper, Center, Flex } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

export default function EmailMessage() {
  return (
    <Paper
      shadow="md"
      radius="lg"
      mt="md"
      mx="auto"
      withBorder
      style={{
        maxWidth: 400,
        width: "100%",
        backgroundColor: "rgba(30, 143, 255, 0.77)",
        paddingTop: "24px",
        paddingRight: "24px",
        paddingBottom: "20px",
        paddingLeft: "24px",
      }}
    >
      <Center style={{ marginBottom: "20px" }}>
        <Flex align="center" gap="10px">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #1e90ff",
              backgroundColor: "#1e90ff", 
              borderRadius: "50%", 
              padding: "4px",
            }}
          >
            <IconMail size={32} color="white" />
          </div>
          <Text style={{ textAlign: "left" }} c="white">
            Check your email for the sign-in link!
          </Text>
        </Flex>
      </Center>
      <Text
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
          color: "white",
        }}
      >
        If you can't find the email, be sure to check your spam or junk folder.
      </Text>
    </Paper>
  );
}
