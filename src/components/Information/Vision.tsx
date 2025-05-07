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
import { IconEye } from "@tabler/icons-react";

const VisionCard = () => {
  const theme = useMantineTheme();
  const redColor = theme.colors.red[6];

  return (
    <Paper
      component="section"
      aria-labelledby="vision-title"
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
          <IconEye size={20} />
        </ThemeIcon>
        <Title id="vision-title" order={4} style={{ color: redColor }}>
          What is Our Vision?
        </Title>
      </Flex>

      <Text size="sm" c="dimmed">
        Our vision is to be the leading platform in providing an efficient, secure, and compassionate
        blood donation system worldwide, ensuring that every patient receives the blood they need in
        critical moments.
      </Text>
    </Paper>
  );
};

export default VisionCard;
