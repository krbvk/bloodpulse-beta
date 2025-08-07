"use client";

import {
  Paper,
  Title,
  Text,
  Flex,
  ThemeIcon,
  useMantineTheme,
  rem,
  Grid,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

const AboutCard = () => {
  const theme = useMantineTheme();
  const redColor = theme.colors.red[6];

  return (
    <Paper
      component="section"
      aria-labelledby="about-title"
      shadow="lg"
      radius="md"
      p="0"
      withBorder
      style={{
        borderColor: redColor,
        backgroundColor: theme.white,
        overflow: "hidden",
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
      <Grid align="stretch">
        {/* Right: Icon + Title (shown first on mobile) */}
        <Grid.Col
          span={{ base: 12, sm: 4 }}
          order={{ base: 1, sm: 2 }}
          style={{ backgroundColor: theme.black }}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="100%"
            p="xl"
            gap="sm"
          >
            <ThemeIcon
              color="red"
              variant="gradient"
              gradient={{ from: "red", to: "pink", deg: 45 }}
              radius="xl"
              size={rem(40)}
            >
              <IconInfoCircle size={20} />
            </ThemeIcon>
            <Title
              id="about-title"
              order={4}
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              What is BloodPulse?
            </Title>
          </Flex>
        </Grid.Col>

        {/* Left: Content (shown second on mobile) */}
        <Grid.Col span={{ base: 12, sm: 8 }} order={{ base: 2, sm: 1 }}>
          <Flex h="100%" p="xl" align="center">
            <Text size="sm" c="black">
                BloodPulse is a progressive web application designed to support and highlight the blood donation campaigns of the Our Lady of Fatima University Red Cross Youth – Valenzuela Campus. It enables users to schedule blood donation appointments and stay updated on upcoming blood drives organized by the organization — all through a single, easy-to-use platform.
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default AboutCard;
