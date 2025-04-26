"use client";

import { useState, useEffect } from "react";
import { Button, Text, Title, Paper } from "@mantine/core";

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
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      withBorder
      mt="md"
    >
      <Title order={3} size="h3">
        Install App
      </Title>

      <Button mt="md" fullWidth>
        Add to Home Screen
      </Button>

      {isIOS && (
        <Text color="dimmed" mt="sm">
          To install this app on your iOS device, tap the share button ⎋ and then &quot;Add to Home Screen&quot; ➕.
        </Text>
      )}
    </Paper>
  );
}
