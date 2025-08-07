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
  Stack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FaHeartbeat } from 'react-icons/fa';
import { IconX } from '@tabler/icons-react';

type Service = {
  title: string;
  description: string | string[];
  display: string;
  imgSrc: string;
};

const servicesData: Service[] = [
  {
    title: 'Become a Blood Donor',
    description: [
      'Create an account or log in to BloodPulse using your Gmail.',
      'Book a donation appointment (see “Book a Donation Appointment Card”).',
      "Wait for a confirmation email from Red Cross Youth - Our Lady of Fatima University, Valenzuela Campus. They will either approve your scheduled appointment or suggest a new time if you're not eligible or need to reschedule.",
      'Arrive at the donation site at the confirmed time.',
      'Fill out the donor form provided on-site.',
      'Undergo screening to check your eligibility and determine your blood type.',
      'Proceed with your blood donation.',
      'Receive your Donor Card after a successful donation.',
    ],
    display: 'Step-by-step guide to start your blood donor journey.',
    imgSrc: '/IntroductionImage1.svg',
  },
  {
    title: 'Book a Donation Appointment',
    description: [
      'Create an account or log in to BloodPulse using your Gmail.',
      'Go to the "Book Appointment" section from your dashboard.',
      'Select the subject of appointment: Blood Donation or Blood Request.',
      'Choose your preferred date and time for the appointment.',
      'Click the "Send Appointment Request" button and wait for a confirmation email from Red Cross Youth - Our Lady of Fatima University Valenzuela Campus.',
    ],
    display: 'Schedule your donation in a few simple steps — quick, easy, and secure.',
    imgSrc: '/IntroductionImage1.svg',
  },
  {
    title: 'Blood Donation Events',
    description: [
      'Create an account or log in to BloodPulse using your Gmail.',
      'Once logged in, check the "News & Announcements" section for updates on blood drives and events by Red Cross Youth - Our Lady of Fatima University, Valenzuela Campus.',
      'You can also visit their official Facebook page for announcements and schedules.',
    ],
    display: 'Stay updated on upcoming blood drives and events near you.',
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

  const renderDescription = (description: string | string[]) => {
    if (Array.isArray(description)) {
      return (
        <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
          {description.map((item, index) => (
            <li key={index} style={{ marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return <Text>{description}</Text>;
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
                {service.display}
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
          content: {
            marginTop: isMobile ? 60 : 0,
          }
        }}
      >
        {isMobile ? (
          <Stack gap="sm" px="xs">
            {/* ✅ FIXED TITLE AND ICON ON MOBILE WITH ICON BEFORE TITLE */}
            <Box pos="relative" mb="sm">
              <Group justify="center" align="center" gap="xs" px="lg" wrap="nowrap">
                <FaHeartbeat size={20} color="#FF4D4D" />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  {selectedService?.title}
                </Text>
              </Group>

              <IconX
                onClick={closeModal}
                size={20}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 8,
                  color: '#999',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4D4D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
              />
            </Box>

            <Image
              src={selectedService?.imgSrc}
              alt={selectedService?.title}
              radius="md"
              height={200}
              fit="cover"
              style={{ borderRadius: 10, marginTop: 8 }}
            />

            <Divider color="#b0b0b0" my="sm" />

            <Box px="xs">
              <Text size="md" fw={600} mb="xs" ta="center" style={{ color: '#333' }}>
                Your Guide
              </Text>
              <Divider mb="sm" color="#b0b0b0" />
              <Box style={{ textAlign: 'justify', fontSize: 14, lineHeight: 1.6 }}>
                {selectedService && renderDescription(selectedService.description)}
              </Box>
            </Box>
          </Stack>
        ) : (
          <>
            <Box
              mb="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

              <Grid.Col
                span={6}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 400,
                  overflowY: 'auto',
                }}
              >
                <Box px="md" style={{ flexGrow: 1 }}>
                  <Text size="lg" fw={600} mb="sm" ta="center">
                    Your Guide
                  </Text>
                  <Divider mb="md" color="#b0b0b0" />
                  <Box style={{ textAlign: 'justify', lineHeight: 1.6 }}>
                    {selectedService && renderDescription(selectedService.description)}
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Modal>
    </Box>
  );
};

export default Services;
