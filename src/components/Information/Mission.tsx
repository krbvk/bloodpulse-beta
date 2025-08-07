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
            <Text size="sm" c="black">
              Our mission is to save lives by connecting generous blood donors with those in urgent
              need, fostering a reliable and efficient blood donation network across communities.
            </Text>
          </Flex>
        </Grid.Col>

        {/* Right: Icon + Title with full black background */}
        <Grid.Col
          span={{ base: 12, sm: 4 }}
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
              <IconTarget size={20} />
            </ThemeIcon>
            <Title
              id="mission-title"
              order={4}
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              What is Our Mission?
            </Title>
          </Flex>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default MissionCard;
