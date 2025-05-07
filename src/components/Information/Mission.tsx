"use client";

import {
  Paper,
  Title,
  Text,
  Flex,
  ThemeIcon,
  useMantineTheme,
  rem,
} from "@mantine/core";
import { IconTarget } from "@tabler/icons-react";

const MissionCard = () => {
  const theme = useMantineTheme();
  const redColor = theme.colors.red[6];

  return (
    <Paper
      component="section"
      aria-labelledby="mission-title"
      shadow="lg"
      radius="md"
      p="xl"
      withBorder
      style={{
        borderColor: redColor,
        backgroundColor: theme.white,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
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
      <Flex align="center" gap="sm" mb="sm">
        <ThemeIcon
          color="red"
          variant="gradient"
          gradient={{ from: "red", to: "pink", deg: 45 }}
          radius="xl"
          size={rem(40)}
        >
          <IconTarget size={20} />
        </ThemeIcon>
        <Title id="mission-title" order={4} style={{ color: redColor }}>
          What is Our Mission?
        </Title>
      </Flex>

      <Text size="sm" c="dimmed">
        Our mission is to save lives by connecting generous blood donors with those in urgent need,
        fostering a reliable and efficient blood donation network across communities.
      </Text>
    </Paper>
  );
};

export default MissionCard;
