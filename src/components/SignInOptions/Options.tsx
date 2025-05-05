'use client';

import {
  Box,
  Stack,
  Flex,
  Title,
  Text,
  Divider,
  rem,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GoogleSignInButton } from '../GoogleSignin/GoogleSignInButton';
import { FacebookSignInButton } from '../Facebook/FacebookSignInButton';
import { ResendSignIn } from '../Resend/Resend';

export default function Options() {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <Box
      style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: 16,
        width: '90%',
        maxWidth: 500,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
        padding: isMobile ? rem(12) : rem(24),
        margin: '0 auto',
      }}
    >
      <Flex direction="column" align="center" justify="center">
        {/* Header Section */}
        <Stack gap={isMobile ? 6 : 10} align="center" mb="md">
          <Title
            order={2}
            style={{
              color: '#FF4D4D',
              fontWeight: 700,
              fontSize: isMobile ? rem(20) : rem(26),
              textAlign: 'center',
            }}
          >
            BLOODPULSE: LOGO
          </Title>
          <Text
            style={{
              fontSize: isMobile ? rem(18) : rem(25),
              color: 'black',
              textAlign: 'center',
            }}
          >
            Sign Up or Log In
          </Text>
        </Stack>

        {/* Sign-in Buttons */}
        <Stack
          gap="md"
          align="center"
          style={{
            width: '100%',
          }}
        >
          <GoogleSignInButton />
          <FacebookSignInButton />
          <Divider
            label={
              <span
                style={{
                  fontWeight: 600,
                  color: '#444',
                  fontSize: isMobile ? rem(12) : rem(14),
                }}
              >
                OR
              </span>
            }
            labelPosition="center"
            my="xs"
            color="dark"
            size="sm"
          />
          <ResendSignIn />
        </Stack>
      </Flex>
    </Box>
  );
}
