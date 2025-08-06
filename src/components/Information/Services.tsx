'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  Image,
  Text,
  SimpleGrid,
  Title,
  Modal,
  Group,
  Divider,
  Grid,
  Stack
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FaHeartbeat } from 'react-icons/fa';
import { IconX } from '@tabler/icons-react';

type Service = {
  title: string;
  description: string;
  imgSrc: string;
};

const servicesData: Service[] = [
  {
    title: 'Blood Donation',
    description:
      'Donate blood to save lives. Your small act of kindness makes a big difference.',
    imgSrc: '/IntroductionImage1.svg',
  },
  {
    title: 'Blood Booking',
    description:
      'Easily book an appointment to donate blood. We help you find the nearest blood donation center and schedule your donation at a convenient time.',
    imgSrc: '/IntroductionImage1.svg',
  },
  {
    title: 'Blood Donation Events',
    description:
      'Blood donation events — join our scheduled blood drives in Valenzuela City.',
    imgSrc: '/IntroductionImage1.svg',
  },
];

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const openModal = (service: Service) => {
    setSelectedService(service);
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
    setSelectedService(null);
  };

  return (
    <Box py="xl">
      <Title order={2} ta="center" mb="xs" style={{ fontWeight: 800, fontSize: 32 }}>
        <span style={{ color: '#000' }}>Our </span>
        <span style={{ color: '#FF4D4D' }}>Services</span>
      </Title>

      <Text
        ta="center"
        size="sm"
        c="dimmed"
        mb="xl"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        Explore the range of services we offer to support lifesaving efforts and promote
        well-being. Each one is designed with compassion, care, and urgency in mind.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {servicesData.map((service, index) => (
          <Card
            key={index}
            shadow="md"
            padding="lg"
            radius="lg"
            withBorder
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              transform: hoveredIndex === index ? 'translateY(-5px)' : 'none',
              boxShadow: hoveredIndex === index ? '0 10px 20px rgba(0, 0, 0, 0.1)' : undefined,
              cursor: 'pointer',
            }}
            onClick={() => openModal(service)}
          >
            <Image
              src={service.imgSrc}
              alt={service.title}
              height={180}
              radius="md"
              style={{ objectFit: 'cover', marginBottom: '1rem' }}
            />
            <Box px="sm">
              <Text
                size="lg"
                fw={600}
                style={{
                  color: '#333',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                {service.title}
              </Text>
              <Text size="sm" c="dimmed" style={{ textAlign: 'center', lineHeight: 1.5, marginBottom: 12 }}>
                {service.description}
              </Text>
              <Text
                size="xs"
                c="#FF4D4D"
                ta="center"
                fw={500}
                style={{ fontStyle: 'italic' }}
              >
                Click to learn more 
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        size={isMobile ? "100%" : "80%"}
        centered
        withCloseButton={false}
        radius="md"
        styles={{
          body: {
            padding: isMobile ? 16 : 24,
            overflowY: isMobile ? 'auto' : 'unset',
          },
        }}
      >
        <Box
          mb="md"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: isMobile ? 32 : 0,
            position: 'relative',
          }}
        >
          <Group justify="center" align="center" gap="xs">
            <FaHeartbeat size={28} color="#FF4D4D" />
            <Text style={{ fontSize: 24, fontWeight: 700 }}>
              {selectedService?.title}
            </Text>
          </Group>

          <IconX
            onClick={closeModal}
            size={24}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#999',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4D4D')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
          />
        </Box>

        {isMobile ? (
          <Stack gap="lg" px="xs">
            <Image
              src={selectedService?.imgSrc}
              alt={selectedService?.title}
              radius="md"
              height={300}
              fit="cover"
              style={{ borderRadius: 12 }}
            />
            <Divider color="#b0b0b0" />
            <Box px="xs">
              <Text size="xl" fw={700} mb="sm" ta="center" style={{ color: '#333' }}>
                How It Works
              </Text>
              <Divider mb="md" color="#b0b0b0" />
              <Text size="md" style={{ textAlign: 'justify', lineHeight: 1.75}}>
                {selectedService?.description}
              </Text>
            </Box>
          </Stack>
        ) : (
          <Grid align="stretch">
            <Grid.Col
              span={5}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Image
                src={selectedService?.imgSrc}
                alt={selectedService?.title}
                radius="md"
                height={400}
                width="100%"
                fit="cover"
                style={{ borderRadius: 12 }}
              />
            </Grid.Col>

            <Grid.Col span={1} style={{ display: 'flex', justifyContent: 'center' }}>
              <Divider orientation="vertical" size="sm" color="#b0b0b0" />
            </Grid.Col>

            <Grid.Col span={6}>
              <Box px="md" style={{ display: 'flex', flexDirection: 'column' }}>
                <Text size="lg" fw={600} mb="sm" ta="center">
                  How It Works
                </Text>
                <Divider mb="md" color="#b0b0b0" />
                <Text size="sm" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
                  {selectedService?.description}
                </Text>
              </Box>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </Box>
  );
};

export default Services;
