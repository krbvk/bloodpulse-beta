import { Card, Box, Title, Text, Group, Stack } from "@mantine/core";
import Image, { type StaticImageData } from "next/image";
import ServiceImageSrc from "@/components/Slides/ServiceImage1.svg";

const ServiceImage = ServiceImageSrc as StaticImageData;

export default function Services() {
  return (
    <Card
      radius="0"
      p={0}
      m={0}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        width: "100vw",  // Full viewport width
        boxSizing: "border-box",
      }}
    >
      {/* Main content area */}
      <Group
        align="center"
        justify="center"
        gap="xl"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1200px",
          padding: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* Image Container */}
        <Box
          style={{
            flex: 1,
            minHeight: 300,
            height: "auto",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "1rem",
            border: "2px solid #d32f2f",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)", 
          }}
        >
          <Image
            src={ServiceImage}
            alt="Slide graphic"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Box>

        {/* Text Content */}
        <Box
          style={{
            flex: 1,
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            background: "transparent",
            padding: "1rem",
          }}
        >
          {/* Feature List inside Card */}
          <Card
            shadow="sm"
            padding="xl"
            radius="md"
            style={{
              width: "100%",
              background: "#fff",
              border: "2px solid #d32f2f",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Title
            order={2}
            style={{
              fontWeight: 700,
              fontSize: 28,
              color: "#d32f2f",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            What <span style={{ color: "red" }}>We Can Offer</span>
          </Title>

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
        </Box>
      </Group>
    </Card>
  );
}
