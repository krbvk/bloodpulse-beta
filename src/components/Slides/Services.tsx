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
  IconSearch,
} from "@tabler/icons-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import ServiceImageSrc from "@/components/Slides/ServiceImage1.svg";

const ServiceImage = ServiceImageSrc as StaticImageData;

export default function Services() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const services = [
    {
      icon: <IconHeart size={isMobile ? 16 : 20} />,
      text: "Become a Donor — we can help if you want to donate blood.",
    },
    {
      icon: <IconCalendar size={isMobile ? 16 : 20} />,
      text: "Blood booking — we can help you book an appointment.",
    },
    {
      icon: <IconSearch size={isMobile ? 16 : 20} />,
      text: "Blood type filtering — you can browse and search the blood type you need.",
    },
  ];

  return (
    <Box
      w="100%"
      h={isMobile ? "100vh" : "100vh"}
      px="lg"
      py={isMobile ? "lg" : "xl"}
      style={{
        backgroundImage: "linear-gradient(135deg, #fdecea 0%, #fff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        w="100%"
        maw={1000}
        p={isMobile ? "md" : "lg"}
        radius="md"
        withBorder
        style={{
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          maxHeight: isMobile ? "80vh" : "unset",
        }}
        shadow="xl"
      >
        <Group
          wrap="wrap"
          justify="center"
          align="center"
          gap={isMobile ? "sm" : "xl"}
          w="100%"
          style={{
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Image */}
          <Box
            w={{ base: "100%", md: "40%" }}
            ta="center"
            style={{
              maxHeight: isMobile ? "100px" : "300px",
            }}
          >
            <Image
              src={ServiceImage}
              alt="Service"
              style={{
                width: isMobile ? "150px" : "100%",
                maxWidth: "500px",
                height: "auto",
                objectFit: "contain",
                marginInline: "auto",
              }}
            />
          </Box>

          {/* Text Section */}
          <Stack
            w={{ base: "100%", md: "55%" }}
            gap={isMobile ? 12 : "lg"}
            align="center"
            justify="center"
          >
            <Title order={2} ta="center" fw={800} fz={isMobile ? 20 : 30} mb={isMobile ? 4 : 0}>
              What{" "}
              <Text
                span
                variant="gradient"
                gradient={{ from: "#FF4D4D", to: "#FF4D4D" }}
                style={{ fontSize: isMobile ? 20 : 30 }}
              >
                We Can Offer
              </Text>
            </Title>

            <Stack w="100%" gap={isMobile ? 10 : "md"}>
              {services.map((item, i) => (
                <Card
                  key={i}
                  withBorder
                  radius="md"
                  padding={isMobile ? 8 : "md"}
                  shadow="sm"
                  component="div"
                  style={{
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  <Group align="center" gap="xs">
                    <Box
                      w={rem(isMobile ? 22 : 36)}
                      h={rem(isMobile ? 22 : 36)}
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "#FF4D4D",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Text size={isMobile ? "xs" : "sm"} c="black">
                      {item.text}
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>

            <Link href="/about">
              <Button
                variant="filled"
                color="red"
                size={isMobile ? "xs" : "md"}
                radius="xs"
                mt={isMobile ? 8 : 0}
                style={{
                  animation: "pulse 2s infinite",
                  padding: isMobile ? "6px 10px" : undefined,
                  fontSize: isMobile ? "0.75rem" : undefined,
                }}
              >
                Learn more about our service
              </Button>
            </Link>
          </Stack>
        </Group>

        {/* Pulse animation keyframes */}
        <style jsx global>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.6);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 77, 77, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
            }
          }
        `}</style>
      </Card>
    </Box>
  );
}
