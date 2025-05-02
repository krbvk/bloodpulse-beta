import { Card, Box, Title, Text, Stack } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import Image, { type StaticImageData } from "next/image";
import BenefitImageSrc from "@/components/Slides/BenefitImage1.svg";

const BenefitImage = BenefitImageSrc as StaticImageData;

export default function Benefits() {
  const items = [
    "Blood donation helps save lives and is crucial for maintaining an adequate hospital supply.",
    "Donating blood keeps your circulation healthy and stimulates new red blood cell production.",
    "Regular donations help maintain a stable blood supply and include a free health screening.",
    "Blood donation can lower certain cancer risks and boost your mood by saving lives.",
  ];

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
        height: "100vh", // Full screen height
        width: "100vw",  // Full screen width
        boxSizing: "border-box",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "3rem",
          width: "100%",
          maxWidth: "1200px",
          padding: "2rem",
        }}
      >
        {/* Left side - Text content */}
        <Box
          style={{
            flex: 1,
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            gap: "1rem",
            border: "2px solid #d32f2f",  // Added border
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",  // Added box shadow
            padding: "1rem",
            marginLeft: "-50px",  // Move the left content 50px to the left
            borderRadius: "12px",  // Round the corners
          }}
        >
          {/* Title on top of the left content */}
          <Title
            order={2}
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontWeight: 700,
              fontSize: 28,
              color: "#d32f2f",
            }}
          >
            Benefits of <span style={{ color: "red" }}>Donating Blood</span>
          </Title>

          <Stack gap="md">
            {items.map((text, idx) => (
              <Box
                key={idx}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#fff",
                  border: "2px solid #d32f2f",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconCirclePlus
                  size={18}
                  stroke={2}
                  color="#d32f2f"
                  style={{ marginRight: 8 }}
                />
                <Text size="sm">{text}</Text>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Right side - Image */}
        <Box
          style={{
            flex: 1,
            maxWidth: "300px",  // Reduced the width of the image container by 50% (600px -> 300px)
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            border: "2px solid #d32f2f",  // Added border
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",  // Added box shadow
            padding: "1rem",
            marginRight: "-50px",  // Move the image container 50px to the right
            borderRadius: "12px",  // Round the corners
          }}
        >
          <Image
            src={BenefitImage}
            alt="Benefit Image"
            style={{
              width: "100%",  // Set the image width to 100% of the container
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}
