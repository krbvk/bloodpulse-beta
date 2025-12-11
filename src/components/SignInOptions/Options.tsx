'use client';

import {
  Box,
  Stack,
  Flex,
  Title,
  Text,
  Divider,
  rem,
  Image as MantineImage,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { GoogleSignInButton } from '../GoogleSignin/GoogleSignInButton';
import { ResendSignIn } from '../Resend/Resend';
import TermsOfService from '../Legal/TermsOfService';
import PrivacyPolicy from '../Legal/PrivacyPolicy';

import NextImage from 'next/image';
import Head from 'next/head';

export default function Options() {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

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
          height: isMobile ? 'auto' : '550px',
        }}
      >
        {/* LEFT IMAGE BOX */}
        <Box
          style={{
            ...sharedBoxStyles,
            width: '100%',
            height: isMobile ? '350px' : '100%',
            overflow: 'hidden',
            padding: 0,
            borderRadius: isMobile ? 0 : 5,
            position: 'relative',
          }}
        >
          <NextImage
            src="/signin-banner.svg"
            alt="Hero Banner"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </Box>

        {/* RIGHT BOX CONTENT */}
        <Box style={{ ...sharedBoxStyles, backgroundColor: 'white', height: '100%' }}>
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

              <Text
                mt="sm"
                style={{
                  fontSize: rem(12),
                  textAlign: 'center',
                  color: '#555',
                  maxWidth: 350,
                  lineHeight: 1.4,
                }}
              >
                By creating an account, you agree to our{' '}
                <span
                  onClick={() => setTosOpen(true)}
                  style={{ color: '#FF4D4D', cursor: 'pointer', fontWeight: 600 }}
                >
                  Terms of Service
                </span>{' '}
                and{' '}
                <span
                  onClick={() => setPrivacyOpen(true)}
                  style={{ color: '#FF4D4D', cursor: 'pointer', fontWeight: 600 }}
                >
                  Privacy Policy
                </span>
                . Please read them carefully before continuing.
              </Text>
            </Stack>
          </Flex>
        </Box>
      </Flex>

      <TermsOfService opened={tosOpen} onClose={() => setTosOpen(false)} />
      <PrivacyPolicy opened={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
