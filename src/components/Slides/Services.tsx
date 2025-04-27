import { Card, Box, Title, Text, Group, Stack } from "@mantine/core";
import Image, { type StaticImageData } from "next/image";
import ServiceImageSrc from "@/components/Slides/ServiceImage1.svg";

const ServiceImage = ServiceImageSrc as StaticImageData;

export default function Services() {
  return (
    <Card
      radius="md"
      p="xl"
      style={{
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Title
        order={2}
        style={{
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 32,
          color: "#000",
          textAlign: "center",
        }}
      >
        What <span style={{ color: "red" }}>We Can Offer</span>
      </Title>

      <Group align="flex-start" justify="center" gap="xl" grow>
        <Box
          style={{
            width: "55%",
            height: 300,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Image
            src={ServiceImage}
            alt="Slide graphic"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Card
          shadow="sm"
          padding="md"
          radius="md"
          style={{
            background: "#fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            border: "1px solid red",
            width: "35%",
            minHeight: 300,
          }}
        >
          <Stack gap="lg">
            {[
              "Become a Donor — we can help if you want to donate blood.",
              "Blood booking — we can help you book an appointment.",
              "Blood type filtering — you can browse and search the blood type you need.",
            ].map((text, i) => (
              <Box key={i} style={{ textAlign: "left" }}>
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  {i + 1}
                </Box>
                <Text size="sm">{text}</Text>
              </Box>
            ))}
          </Stack>
        </Card>
      </Group>
    </Card>
  );
}
