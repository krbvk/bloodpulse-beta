"use client";

import { useState, useEffect } from "react";
import { Button, Text, Heading } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) return null;

  return (
    <Box shadow="sm" padding="lg" borderRadius="md" borderWidth="1px" mt="md">
      <Heading as="h3" size="md">Install App</Heading>
      <Button mt="md">Add to Home Screen</Button>
      {isIOS && (
        <Text color="dimmed" mt="sm">
          To install this app on your iOS device, tap the share button ⎋ and then &quot;Add to Home Screen&quot; ➕.
        </Text>
      )}
    </Box>
  );
}
