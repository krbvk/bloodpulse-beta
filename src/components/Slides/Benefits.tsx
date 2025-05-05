import {
  Card,
  Box,
  Title,
  Text,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartbeat,
  IconStethoscope,
  IconDroplet,
  IconClockHour8,
} from "@tabler/icons-react";

export default function Benefits() {
  const items = [
    {
      icon: IconDroplet,
      text: "Save Lives — Every donation has the potential to save up to three lives. You’re directly impacting people who are in urgent need.",
    },
    {
      icon: IconHeartbeat,
      text: "Improve Your Heart Health — Regular blood donation can lower your risk of heart disease and help regulate your iron levels, contributing to better cardiovascular health.",
    },
    {
      icon: IconStethoscope,
      text: "Free Health Checkup — Each time you donate, you receive a mini health checkup, including blood pressure, hemoglobin, and iron level tests, giving you valuable insight into your own health.",
    },
    {
      icon: IconHeart,
      text: "Regenerate New Blood Cells — Donating blood stimulates your body to create new red blood cells, keeping your circulatory system healthy and refreshed.",
    },
    {
      icon: IconClockHour8,
      text: "Help Ensure Blood Availability — Your donation helps maintain a steady blood supply in hospitals, making it easier to respond to emergencies and ensuring there is blood available when it’s most needed.",
    },
  ];

  return (
    <Card
      radius="0"
      p={0}
      m={0}
      style={{
        backgroundImage: "linear-gradient(to right, #fdecea, #fff)",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
      }}
    >
      <Box
        style={{
          width: "95%",
          maxWidth: "720px",
          padding: "1rem 2rem",
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
          borderRadius: "16px",
          maxHeight: "90vh",
          overflow: "auto"
        }}
      >
        <Title
          order={2}
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            fontWeight: 800,
            fontSize: 26,
            color: "#c62828",
          }}
        >
          Benefits of <span style={{ color: "#d32f2f" }}>Donating Blood</span>
        </Title>

        <Divider my="sm" variant="dashed" color="red.4" />

        <Stack gap="sm">
          {items.map((item, idx) => (
            <Box
              key={idx}
              style={{
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "#fefefe",
                border: "1px solid #f4c7c3",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(0,0,0,0.05)";
              }}
            >
              <Box
                style={{
                  backgroundColor: "#ffebee",
                  borderRadius: "50%",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "2px",
                }}
              >
                <item.icon size={18} stroke={1.8} color="#d32f2f" />
              </Box>
              <Text size="sm" style={{ lineHeight: 1.5 }}>
                {item.text}
              </Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}
