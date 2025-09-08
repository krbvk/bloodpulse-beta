'use client';

import {
  Box,
  Stack,
  Flex,
  Title,
  Text,
  Divider,
  rem,
  Image,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GoogleSignInButton } from '../GoogleSignin/GoogleSignInButton';
import { ResendSignIn } from '../Resend/Resend';

export default function Options() {
  const isMobile = useMediaQuery('(max-width: 600px)');

  const sharedBoxStyles = {
    border: '1px solid #ccc',
    borderRadius: isMobile ? rem(12) : 5,
    padding: isMobile ? rem(20) : rem(24),
    boxShadow: isMobile ? '0 6px 18px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
  };

  return (
    <Flex
      direction={isMobile ? 'column' : 'row'}
      justify="center"
      align="stretch"
      style={{
        width: '100%',
         maxWidth: isMobile ? '900' : '790px',
        margin: '0 auto',
        borderRadius: isMobile ? 0 : 5,
        overflow: 'hidden',
        height: isMobile ? 'auto' : '500px',
      }}
    >
      {/* Left Box: Image */}
      <Box
        style={{
          ...sharedBoxStyles,
          width: isMobile ? '100%' : '50%',
          height: isMobile ? 'auto' : '100%',
          padding: 0,
          marginTop: isMobile ? '10%' : 0,
          marginBottom: isMobile ? '5%' : 0,
        }}
      >
        <Image
          src="/signin.svg"
          alt="Hero Banner"
          style={{
            width: '100%',
            height: isMobile ? 'auto' : '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 0,
          }}
        />
      </Box>

      {/* Right Box: Form */}
      <Box
        style={{
          ...sharedBoxStyles,
          width: isMobile ? '90%' : '50%',
          margin: isMobile ? '0 auto 10%' : 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack gap={isMobile ? 10 : 12} align="center" mb="md">
          <Flex align="center" gap="xs" justify="center">
            <Title
              order={2}
              style={{
                color: '#FF4D4D',
                fontWeight: 700,
                fontSize: isMobile ? rem(22) : rem(26),
                fontFamily: 'monospace',
                userSelect: 'none',
                textAlign: 'center',
              }}
            >
              BLOODPULSE:
            </Title>
            <Image
              src="/web-app-manifest-192x192.png"
              alt="BloodPulse Logo"
              width={28}
              height={28}
              style={{ marginTop: 2 }}
            />
          </Flex>
          <Text
            style={{
              fontSize: isMobile ? rem(20) : rem(25),
              color: 'black',
              textAlign: 'center',
            }}
          >
            Sign Up or Log In
          </Text>
        </Stack>

        <Stack gap="md" align="center" style={{ width: '100%' }}>
          <GoogleSignInButton fullWidth={isMobile} />
          <Divider
            label={
              <span
                style={{
                  fontWeight: 600,
                  color: '#444',
                  fontSize: isMobile ? rem(13) : rem(14),
                }}
              >
                OR
              </span>
            }
            labelPosition="center"
            my="sm"
            color="dark"
            size="sm"
          />
          <ResendSignIn fullWidth={isMobile} />
        </Stack>
      </Box>
    </Flex>
  );
}
