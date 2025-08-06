"use client";

import {
  Box,
  Card,
  Stack,
  Text,
  Title,
  Button,
  Group,
  rem,
} from "@mantine/core";
import {
  IconHeart,
  IconCalendar,
  IconCalendarEvent,
} from "@tabler/icons-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import ServiceImageSrc from "@/components/Slides/ServiceImage1.svg";
import React from "react";

const ServiceImage = ServiceImageSrc as StaticImageData;

export default function Services() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hover / tap effect handlers
  const handleHoverIn = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
  };

  const handleHoverOut = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
  };

  const services = [
    {
      icon: <IconHeart size={isMobile ? 16 : 24} />,
      text: "Become a Donor — we can help if you want to donate blood.",
    },
    {
      icon: <IconCalendar size={isMobile ? 16 : 24} />,
      text: "Blood Booking — we can help you book an appointment.",
    },
    {
      icon: <IconCalendarEvent size={isMobile ? 16 : 24} />,
      text: "Blood Donation Events — join our scheduled blood drives in Valenzuela City.",
    },
  ];

  return (
    <Box
      w="100%"
      px="md"
      py={isMobile ? "2rem" : "5rem"}
      style={{
        background: "linear-gradient(135deg, #fff 0%, #fdecea 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: isMobile ? "100vh" : "auto",
      }}
    >
      <Group
        justify="center"
        align="center"
        gap={isMobile ? "2rem" : "4rem"}
        style={{
          flexDirection: isMobile ? "column" : "row",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Image Section */}
        <Box
          ta="center"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 0 : "2rem",
          }}
        >
          <Image
            src={ServiceImage}
            alt="Service illustration"
            style={{
              width: isMobile ? "180px" : "100%",
              maxWidth: isMobile ? "250px" : "550px",
              height: "auto",
              objectFit: "contain",
              transform: isMobile ? "none" : "translateY(-10px)",
              filter: "drop-shadow(0px 8px 20px rgba(0,0,0,0.1))",
              transition: "filter 0.3s ease",
            }}
          />
        </Box>

        {/* Content Section */}
        <Stack style={{ flex: 1 }} gap={isMobile ? "sm" : "xl"} align="center">
          {/* Title */}
          <Title
            order={2}
            fw={800}
            style={{
              fontSize: isMobile ? "22px" : "38px",
              textAlign: "center",
              color: "#1a1a1a",
            }}
          >
            What{" "}
            <Text
              span
              style={{
                background: "linear-gradient(90deg, #FF4D4D, #FF6B6B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: isMobile ? "22px" : "38px",
              }}
            >
              We Can Offer
            </Text>
          </Title>

          {/* Subtitle */}
          <Text
            size={isMobile ? "sm" : "md"}
            c="dimmed"
            style={{
              textAlign: "center",
              maxWidth: isMobile ? "320px" : "500px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Whether you&apos;re donating blood, booking an appointment, or
            joining a blood drive — we make the process simple and accessible.
          </Text>

          {/* Service Cards */}
          <Stack
            gap={isMobile ? "xs" : "sm"}
            w="100%"
            style={{ maxWidth: isMobile ? "320px" : "100%" }}
          >
            {services.map((item, i) => (
              <Card
                key={i}
                radius="md"
                padding={isMobile ? "xs" : "md"}
                style={{
                  border: "1px solid #f4c7c3",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                onTouchStart={handleHoverIn}
                onTouchEnd={handleHoverOut}
              >
                <Group align="center" gap="md" wrap="nowrap">
                  <Box
                    w={rem(isMobile ? 24 : 40)}
                    h={rem(isMobile ? 24 : 40)}
                    style={{
                      borderRadius: "50%",
                      background: "#ffebee",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#d32f2f",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Text
                    size={isMobile ? "xs" : "md"}
                    style={{
                      lineHeight: 1.4,
                      color: "#333",
                      flex: 1,
                    }}
                  >
                    {item.text}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>

          {/* Button */}
          <Box style={{ textAlign: "center" }}>
            <Link href="/about#services">
              <Button
                size={isMobile ? "xs" : "md"}
                radius="md"
                style={{
                  background:
                    "linear-gradient(90deg, #FF4D4D 0%, #FF6B6B 100%)",
                  boxShadow: "0 4px 14px rgba(255, 77, 77, 0.3)",
                  border: "none",
                  padding: isMobile ? "4px 10px" : undefined,
                  fontSize: isMobile ? "0.75rem" : undefined,
                }}
              >
                Learn more about our service
              </Button>
            </Link>
          </Box>
        </Stack>
      </Group>
    </Box>
  );
}
