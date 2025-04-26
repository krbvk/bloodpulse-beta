"use client";

import { Box, Group, Text, Button, Container, Flex } from "@mantine/core";

const Navbar = () => {
  return (
    <Box
      component="header"
      w="100%"
      bg="white"
      pos="fixed"
      top={0}
      left={0}
      style={{
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container size="lg" py="sm">
        <Flex align="center" justify="space-between">
          {/* Left - Navigation Links */}
          <Group gap="md">
            <Button variant="subtle" color="dark" size="md" radius="md">
              Home
            </Button>
            <Button variant="subtle" color="dark" size="md" radius="md">
              About
            </Button>
          </Group>

          {/* Center - Logo */}
          <Text
            size="xl"
            fw={900}
            style={{
              color: "#FF4B2B",
              letterSpacing: "1px",
              fontFamily: "monospace",
              userSelect: "none",
            }}
          >
            BLOODPULSE: LOGO
          </Text>

          {/* Right - Auth Buttons */}
          <Group gap="sm">
            <Button variant="filled" color="red" size="md" radius="md">
              Sign In / Sign Up
            </Button>
          </Group>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
