"use client";

import {
  Box,
  Title,
  Text,
  Anchor,
  Stack,
  Divider,
  useMantineTheme,
  rem,
} from "@mantine/core";
import { IconMailHeart } from "@tabler/icons-react";
import React from "react";

const ContactSupport = () => {
  const theme = useMantineTheme();
  const redColor = theme.colors.red[6];

  return (
    <Box
      id="contact-support"
      style={{
        marginTop: rem(48),
        padding: "2rem 1.5rem",
        borderRadius: "16px",
        backgroundColor: theme.white,
        border: `2px solid ${redColor}`,
        boxShadow: theme.shadows.lg,
        textAlign: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = theme.shadows.xl;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = theme.shadows.lg;
      }}
    >
      <Stack
        align="center"
        gap="xs"
        style={{
          paddingInline: "0.5rem",
        }}
      >
        {/* Heart Icon */}
        <IconMailHeart
          size={42}
          style={{
            color: redColor,
            background: "linear-gradient(45deg, red, pink)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        />

        {/* Title */}
        <Title
          order={2}
          style={{
            color: redColor,
            fontWeight: 800,
            letterSpacing: "0.3px",
            fontSize: "clamp(1.5rem, 4vw, 2rem)", // scales for mobile
            textAlign: "center",
          }}
        >
          Contact and Support
        </Title>

        <Divider
          my="sm"
          size="sm"
          style={{
            width: "80px",
            borderColor: redColor,
            opacity: 0.6,
          }}
        />

        {/* Description */}
        <Text
          size="md"
          style={{
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.6,
            color: theme.black,
            fontSize: "clamp(0.9rem, 3vw, 1rem)",
            paddingInline: "0.5rem",
          }}
        >
          Have questions, suggestions, or technical issues? You can reach our
          BloodPulse support team through the email below.
        </Text>

        {/* Email link */}
        <Anchor
          href="mailto:bdodchigue8776val@student.fatima.edu.ph"
          underline="hover"
          style={{
            color: redColor,
            fontWeight: 600,
            marginTop: "0.5rem",
            fontSize: "clamp(1rem, 3.5vw, 1.1rem)",
            transition: "transform 0.2s ease, color 0.2s ease",
            wordBreak: "break-word",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = theme.colors.red[4];
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = redColor;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          bdodchigue8776val@student.fatima.edu.ph
        </Anchor>
      </Stack>
    </Box>
  );
};

export default ContactSupport;
