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
        {/* Left: Content */}
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <Flex h="100%" p="xl" align="center">
            <div>
              <Text size="md" c="black" mt="sm">
                BloodPulse is a progressive web application dedicated to supporting and showcasing the blood donation campaigns of the Red Cross Youth of Our Lady of Fatima University Valenzuela Campus. It allows users to book blood donation appointments and stay informed about upcoming blood drive events led by the said organization in Valenzuela City, Philippines — all through one easy-to-use platform.
              </Text>
            </div>
          </Flex>
        </Grid.Col>

        {/* Right: Icon + Label */}
        <Grid.Col span={{ base: 12, sm: 4 }} style={{ backgroundColor: theme.black }}>
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
      </Grid>
    </Paper>
  );
};

export default AboutCard;
