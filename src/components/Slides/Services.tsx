import {
  Card,
  Box,
  Title,
  Text,
  Stack,
  Grid,
  Button,
} from "@mantine/core";
import {
  IconHeart,
  IconCalendar,
  IconSearch,
} from "@tabler/icons-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import ServiceImageSrc from "@/components/Slides/ServiceImage1.svg";

const ServiceImage = ServiceImageSrc as StaticImageData;

export default function Services() {
  const services = [
    {
      icon: <IconHeart size={18} />,
      text: "Become a Donor — we can help if you want to donate blood.",
    },
    {
      icon: <IconCalendar size={18} />,
      text: "Blood booking — we can help you book an appointment.",
    },
    {
      icon: <IconSearch size={18} />,
      text: "Blood type filtering — you can browse and search the blood type you need.",
    },
  ];

  return (
    <Card
      radius="0"
      p={0}
      m={0}
      style={{
        backgroundImage: "linear-gradient(135deg, #fdecea 0%, #fff 100%)",
        border: "none",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        gutter="xl"
        style={{
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {/* Image Box */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box
            style={{
              height: "100%",
              minHeight: 400,
              backgroundColor: "#fff",
              border: "2px solid #FF4D4D",
              borderRadius: 12,
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Image
              src={ServiceImage}
              alt="Service"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </Box>
        </Grid.Col>

        {/* Text Box */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            shadow="sm"
            padding="xl"
            radius="md"
            style={{
              height: "100%",
              minHeight: 400,
              background: "#fff",
              border: "2px solid #FF4D4D",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.1)";
            }}
          >
            <Title
              order={2}
              mb="lg"
              style={{
                fontWeight: 800,
                fontSize: 30,
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              What{" "}
              <Text
                span
                variant="gradient"
                gradient={{ from: "#FF4D4D", to: "#FF4D4D" }}
                style={{ fontSize: 30, fontWeight: 800 }}
              >
                We Can Offer
              </Text>
            </Title>

            <Stack gap="lg" mb="lg">
              {services.map((item, i) => (
                <Box
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    transition: "background 0.2s, box-shadow 0.2s",
                    padding: "0.5rem",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFF5F5";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#FF4D4D",
                      color: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Text size="sm">{item.text}</Text>
                </Box>
              ))}
            </Stack>

            <Box mt="auto" style={{ textAlign: "center" }}>
              <Link href="/about">
                <Button
                  variant="filled"
                  color="red"
                  size="md"
                  radius="xs"
                >
                  Learn More About Us
                </Button>
              </Link>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
