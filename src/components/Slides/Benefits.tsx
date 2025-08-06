"use client";

import { Box, Title, Text, Divider } from "@mantine/core";
import {
  IconHeart,
  IconHeartbeat,
  IconStethoscope,
  IconDroplet,
  IconClockHour8,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import Image, { type StaticImageData } from "next/image";
import BenefitImageSrc from "@/components/Slides/BenefitImage1.svg";

const BenefitImage = BenefitImageSrc as StaticImageData;

export default function Benefits() {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const items = [
    { icon: IconDroplet, text: "Save Lives — Every donation has the potential to save up to three lives. You’re directly impacting people who are in urgent need." },
    { icon: IconHeartbeat, text: "Improve Your Heart Health — Regular blood donation can lower your risk of heart disease and help regulate your iron levels, contributing to better cardiovascular health." },
    { icon: IconStethoscope, text: "Health Snapshot — Each donation comes with a free checkup including blood pressure and hemoglobin level tests." },
    { icon: IconHeart, text: "Regenerate New Blood Cells — Donating blood stimulates your body to create new red blood cells, keeping your circulatory system healthy and refreshed." },
    { icon: IconClockHour8, text: "Help Ensure Blood Availability — Your donation helps maintain a steady blood supply in hospitals, making it easier to respond to emergencies and ensuring there is blood available when it’s most needed." },
    { icon: IconHeart, text: "Support Red Cross PH — Partnering with Red Cross Philippines, your donation aids disaster relief and nationwide blood drive efforts." },
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!el) return;

    el.style.transition = "transform 0.15s ease";
    el.style.transform = "scale(0.97)";

    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 150);
  };

  const CardItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <Box
      onClick={handleClick}
      onTouchStart={handleClick}
      style={{
        padding: "1.35rem",
        borderRadius: "14px",
        background: "#fff",
        border: "1px solid #f4c7c3",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "flex-start",
        gap: "1.1rem",
        height: "160px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >
      <Box
        style={{
          background: "#ffebee",
          borderRadius: "50%",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "46px",
          minHeight: "46px",
          flexShrink: 0,
        }}
      >
        <Icon size={24} stroke={1.8} color="#d32f2f" />
      </Box>
      <Text size="md" style={{ lineHeight: 1.5, fontSize: "15px", color: "#333" }}>
        {text}
      </Text>
    </Box>
  );

  const BenefitRow = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <Box
      onClick={handleClick}
      onTouchStart={handleClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: "0.35rem 0",
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
    >
      <Box
        style={{
          background: "#ffebee",
          borderRadius: "50%",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "22px",
          minHeight: "22px",
          flexShrink: 0,
        }}
      >
        <Icon size={12} stroke={1.8} color="#d32f2f" />
      </Box>
      <Text size="sm" style={{ lineHeight: 1.4, fontSize: "11px", color: "#333" }}>
        {text}
      </Text>
    </Box>
  );

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: "linear-gradient(to right, #fdecea, #fff)",
        padding: isMobile ? "0.5rem" : "4rem 2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isMobile ? (
        <Box
          style={{
            background: "#fff",
            border: "1px solid #f4c7c3",
            borderRadius: "10px",
            padding: "0.6rem 0.6rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            width: "100%",
          }}
        >
          <Title
            order={2}
            style={{
              fontWeight: 800,
              fontSize: "16px",
              marginBottom: "0.5rem",
              textAlign: "center",
              color: "black",
            }}
          >
            Benefits of <span style={{ color: "#FF4D4D" }}>Donating Blood</span>
          </Title>
          {items.map((item, idx) => (
            <Box
              key={idx}
              style={{
                background: "#fff",
                border: "1px solid #f4c7c3",
                borderRadius: "8px",
                padding: "0.6rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                transition: "transform 0.15s ease",
              }}
              onClick={handleClick}
              onTouchStart={handleClick}
            >
              <BenefitRow icon={item.icon} text={item.text} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2rem",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <Box style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
            {items.slice(0, 3).map((item, idx) => (
              <CardItem key={idx} icon={item.icon} text={item.text} />
            ))}
          </Box>

          <Box style={{ textAlign: "center", flex: 1 }}>
            <Title
              order={1}
              style={{
                fontWeight: 800,
                fontSize: "36px",
                marginBottom: "1.5rem",
                color: "black",
              }}
            >
              Benefits of <span style={{ color: "#FF4D4D" }}>Donating Blood</span>
            </Title>
            <Image
              src={BenefitImage}
              alt="Blood Donation"
              width={320}
              height={320}
              style={{ borderRadius: "14px", objectFit: "contain" }}
            />
          </Box>

          <Box style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
            {items.slice(3, 6).map((item, idx) => (
              <CardItem key={idx} icon={item.icon} text={item.text} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
