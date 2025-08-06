"use client";

import { Box, Group, Text, Button, Container, Flex, Drawer, Stack } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from '@mantine/hooks';
import { IconHome, IconInfoCircle, IconLogin } from '@tabler/icons-react';
import Image from "next/image";

const Navbar = () => {
  const [opened, setOpened] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleDrawer = () => setOpened((prev) => !prev);

  const closeDrawer = () => setOpened(false);

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
          {!isMobile && (
            <Group gap="md">
              <Button component={Link} href="/" variant="subtle" color="dark" size="md" radius="md" leftSection={<IconHome size={18} />}              >
                Home
              </Button>
              <Button component={Link} href="/about" variant="subtle" color="dark" size="md" radius="md" leftSection={<IconInfoCircle size={18} />}>
                About Us
              </Button>
            </Group>
          )}
          <Flex align="center" gap="xs">
            <Text
              size="xl"
              fw={900}
              style={{
                color: "#FF4D4D",
                letterSpacing: "1px",
                fontFamily: "monospace",
                userSelect: "none",
              }}
            >
              BLOODPULSE:
            </Text>
            <Image
              src="/web-app-manifest-192x192.png"
              alt="BloodPulse Logo"
              width={32}
              height={32}
            />
          </Flex>
          {!isMobile && (
            <Group gap="sm">
              <Button component={Link} href="/login" variant="filled" color="red" size="md" radius="md" leftSection={<IconLogin size={18} />}>
                Sign In / Sign Up
              </Button>
            </Group>
          )}
          {isMobile && (
            <Button variant="subtle" onClick={toggleDrawer} style={{ zIndex: 1001, color: "#FF4B2B", fontSize: "25px" }}>
              &#9776;
            </Button>
          )}
        </Flex>
        <Drawer
          opened={opened}
          onClose={closeDrawer}
          position="top"
          size="auto"
          padding="lg"
          withCloseButton={false}
          transitionProps={{
            transition: "slide-up",
            duration: 400,
            timingFunction: "ease",
          }}
        >
          <Stack gap="md" style={{ marginTop: '50px' }}> 
            <Button
              component={Link}
              href="/"
              variant="subtle"
              color="dark"
              size="md"
              radius="md"
              onClick={closeDrawer}
              style={{ color: "black", display: "flex", alignItems: "center" }}
            >
              <IconHome size={20} style={{ marginRight: '10px' }} /> 
              Home
            </Button>
            <Button
              component={Link}
              href="/about"
              variant="subtle"
              color="dark"
              size="md"
              radius="md"
              onClick={closeDrawer}
              style={{ color: "black", display: "flex", alignItems: "center" }}
            >
              <IconInfoCircle size={20} style={{ marginRight: '10px' }} /> 
              About
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="filled"
              color="red"
              size="md"
              radius="md"
              onClick={closeDrawer}
              style={{ color: "black", display: "flex", alignItems: "center" }}
            >
              <IconLogin size={20} style={{ marginRight: '10px' }} />
              Sign In / Sign Up
            </Button>
          </Stack>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Navbar;
