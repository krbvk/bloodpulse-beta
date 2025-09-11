'use client';

import {
  Box,
  Stack,
  Flex,
  Title,
  Text,
  Divider,
  rem,
  Image as MantineImage, // 👈 alias Mantine's Image
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GoogleSignInButton } from '../GoogleSignin/GoogleSignInButton';
import { ResendSignIn } from '../Resend/Resend';
import NextImage from 'next/image';
import Head from 'next/head';

export default function Options() {
  const isMobile = useMediaQuery('(max-width: 600px)');

  const sharedBoxStyles = {
    border: '1px solid #ccc',
    borderRadius: isMobile ? 0 : 5,
    width: '100%',
    maxWidth: 500,
    padding: isMobile ? rem(12) : rem(24),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
  };

  return (
    <>
    <Head>
      <link rel="preload" as="image" href="/signin-banner.svg" />
    </Head>
    <Flex
      direction={isMobile ? 'column' : 'row'}
      justify="center"
      align="stretch"
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        borderRadius: isMobile ? 0 : 5,
        overflow: 'hidden',
        height: isMobile ? 'auto' : '500px',
      }}
    >
      {/* Left Box Container (Hero Banner) */}
      <Box
        style={{
          ...sharedBoxStyles,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          padding: 0,
          borderRadius: isMobile ? 0 : 5,
          position: 'relative', // required for NextImage with "fill"
        }}
      >
        <NextImage
          src="/signin-banner.svg"
          alt="Hero Banner"
          fill
          priority // 👈 preloads this image
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* Right Box Container */}
      <Box
        style={{
          ...sharedBoxStyles,
          backgroundColor: 'white',
          height: '100%',
        }}
      >
        <Flex direction="column" align="center" justify="center" style={{ height: '100%' }}>
          <Stack gap={isMobile ? 6 : 10} align="center" mb="md">
            <Flex align="center" gap="xs" justify="center">
              <Title
                order={2}
                style={{
                  color: '#FF4D4D',
                  fontWeight: 700,
                  fontSize: isMobile ? rem(20) : rem(26),
                  fontFamily: 'monospace',
                  userSelect: 'none',
                }}
              >
                BLOODPULSE:
              </Title>
              <MantineImage
                src="/web-app-manifest-192x192.png"
                alt="BloodPulse Logo"
                width={28}
                height={28}
                style={{ marginTop: 2 }}
              />
            </Flex>
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

          <Stack gap="md" align="center" style={{ width: '100%' }}>
            <GoogleSignInButton />
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
    </Flex>
    </>
  );
}
