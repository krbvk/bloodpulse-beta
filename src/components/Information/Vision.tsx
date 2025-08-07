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
        {/* Right: Icon + Title (displayed first on mobile) */}
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
              <IconEye size={20} />
            </ThemeIcon>
            <Title
              id="vision-title"
              order={4}
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              What is Our Vision?
            </Title>
          </Flex>
        </Grid.Col>

        {/* Left: Content (displayed second on mobile) */}
        <Grid.Col span={{ base: 12, sm: 8 }} order={{ base: 2, sm: 1 }}>
          <Flex h="100%" p="xl" align="center">
            <Text size="sm" c="black">
              Our vision is to be the leading platform in providing an efficient, secure, and
              compassionate blood donation system worldwide, ensuring that every patient receives the
              blood they need in critical moments.
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default VisionCard;
