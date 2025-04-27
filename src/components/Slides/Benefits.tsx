import { Card, Box, Title, Text, Group } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import Image from "next/image";
import BenefitImage from "@/components/Slides/BenefitImage1.svg";

export default function Benefits() {
  const items = [
    "Blood donation helps save lives and is crucial for maintaining an adequate hospital supply.",
    "Donating blood keeps your circulation healthy and stimulates new red blood cell production.",
    "Regular donations help maintain a stable blood supply and include a free health screening.",
    "Blood donation can lower certain cancer risks and boost your mood by saving lives.",
  ];

  return (
    <Card
      radius="md"
      p="xl"
      style={{
        background: "#fff",
        // border: "1px solid #d7ccc8",
        // boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "row", // Side-by-side layout
        gap: 32, // Space between left content and right image
      }}
    >
      {/* Left side: Benefits with Red Cross and Description */}
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "50%", // Smaller width for the left box
          maxHeight: "450px", // Adjusted max height
          overflowY: "auto", // Ensures scrolling if needed
        }}
      >
        <Title order={2} style={{ textAlign: "center", marginBottom: 16 }}>
          Benefits of <span style={{ color: "red" }}>Donating Blood</span>
        </Title>

        {items.map((text, idx) => {
          return (
            <Box
              key={idx}
              style={{
                position: "relative",
                padding: "12px 16px",
                borderRadius: 8,
                background: "#fff",
                border: "2px solid #d32f2f",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Red cross icon */}
              <IconCirclePlus
                size={20}
                stroke={2}
                color="#d32f2f"
                style={{ marginRight: 8 }}
              />
              {/* Text */}
              <Text size="sm">{text}</Text>
            </Box>
          );
        })}
      </Box>

      {/* Right side: Smaller Image container */}
      <Box
        style={{
          width: "35%", // Smaller width for the image container
          height: "auto", // Ensure image maintains proper aspect ratio
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          marginLeft: "10%"
        }}
      >
        <Image
          src={BenefitImage}
          alt="Benefit Image"
          style={{
            width: "80%", // Adjusted width to make the image smaller
            height: "auto",
            objectFit: "cover",
            alignSelf: "center", // Align image to center
          }}
        />
      </Box>
    </Card>
  );
}
