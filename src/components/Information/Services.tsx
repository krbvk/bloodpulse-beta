'use client';

import React, { useState } from 'react';
import { Box, Card, Image, Text, SimpleGrid, Title } from '@mantine/core';

const servicesData = [
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
    title: 'Blood Type Filtering',
    description:
      'Looking for a specific blood type? We offer a filtering service that lets you search for the blood type you need, helping you find the right match quickly in emergencies.',
    imgSrc: '/IntroductionImage1.svg',
  },
];

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box py="xl" >
      <Title order={2} ta="center" mb="xs" style={{ fontWeight: 800, fontSize: 32}}>
        <span style={{ color: '#000' }}>Our </span>
        <span style={{ color: '#FF4D4D' }}>Services</span>
      </Title>

      <Text ta="center" size="sm" c="dimmed" mb="xl" style={{ maxWidth: 600, margin: '0 auto' }}>
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
              boxShadow:
                hoveredIndex === index ? '0 10px 20px rgba(0, 0, 0, 0.1)' : undefined,
              cursor: 'pointer',
            }}
          >
            <Image
              src={service.imgSrc}
              alt={service.title}
              height={180}
              radius="md"
              style={{
                objectFit: 'cover',
                marginBottom: '1rem',
              }}
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
              <Text
                size="sm"
                c="dimmed"
                style={{
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                {service.description}
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Services;
