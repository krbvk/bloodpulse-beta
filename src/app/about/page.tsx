'use client';

import React from 'react';
import Navbar from '@/components/Navbar/Homepage';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Box,
  Flex,
  rem,
} from '@mantine/core';
import MissionCard from '@/components/Information/Mission';
import VisionCard from '@/components/Information/Vision';
import Services from '@/components/Information/Services';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', backgroundImage: "linear-gradient(to right, #fdecea, #fff)", }}>
        <Container size="lg" py="xl" style={{ marginTop: '50px' }}>
          <Flex
            direction="column"
            align="center"
            justify="flex-start"
            style={{ textAlign: 'center' }}
          >
            <Stack gap="md" align="center" w="100%">
              <Title
                order={2}
                style={{
                  fontWeight: 800,
                  color: 'black',
                  fontSize: rem(32),
                }}
              >
                About <span style={{ color: '#FF4D4D' }}>BloodPulse</span>
              </Title>

              <Text size="md" c="dimmed" maw={600}>
                Learn more about the mission and vision that fuel our purpose in building a
                life-saving blood donation network.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl" w="100%">
              <MissionCard />
              <VisionCard />
            </SimpleGrid>
            <Box id="services" w="100%" mt="xl">
              <Services />
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
