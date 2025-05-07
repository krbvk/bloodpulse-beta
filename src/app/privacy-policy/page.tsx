'use client';

import { useEffect } from 'react';
import { Modal, Text, Group, Anchor, Divider, Stack, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FacebookSignInButton } from "@/components/Facebook/FacebookSignInButton" 

export default function FacebookLoginDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    open();
  }, [open]);

  return (
    <Modal opened={opened} onClose={close} title="Continue with Facebook" centered>
      <Stack gap="md">
        <Group align="center">
          <Avatar
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            size="lg"
          />
          <div>
            <Text fw={600}>BloodPulse</Text>
            <Text size="xs" c="dimmed">
              This app will receive: your name and profile picture
            </Text>
          </div>
        </Group>

        <Divider />

        {/* Policy Links */}
        <Text size="sm" c="dimmed">
          By continuing, you agree to our{' '}
          <Anchor href="/privacy-policy" target="_blank" underline="always">
            Privacy Policy
          </Anchor>{' '}
          and{' '}
          <Anchor href="/terms-of-service" target="_blank" underline="always">
            Terms of Service
          </Anchor>
          .
        </Text>

        <Group justify="center">
            <FacebookSignInButton />
        </Group>
      </Stack>
    </Modal>
  );
}
