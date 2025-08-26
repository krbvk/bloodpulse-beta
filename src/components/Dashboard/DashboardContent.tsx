"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Title,
  Alert,
  Card,
  Text,
  useMantineTheme,
  Divider,
  Group,
  Stack,
  Grid,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import type { Session } from "next-auth";
import { useSdkContext } from "@/components/Dashboard/SdkContext";
import { useMediaQuery } from "@mantine/hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { CalendarApi } from "@fullcalendar/core";

type Props = {
  session: Session | null;
};

declare global {
  interface Window {
    FB?: {
      XFBML: { parse: () => void };
    };
  }
}

const DashboardContent = ({ session }: Props) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { sdkLoaded, sdkFailed } = useSdkContext();
  const [currentDate] = useState(new Date());
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    if (sdkLoaded && typeof window !== "undefined" && window.FB?.XFBML) {
      try {
        window.FB.XFBML.parse();
      } catch {}
    }
  }, [sdkLoaded]);

  useEffect(() => {
    const t = setTimeout(() => {
      const api: CalendarApi | undefined = calendarRef.current?.getApi();
      api?.updateSize();
    }, 120);
    return () => clearTimeout(t);
  }, [isMobile]);

  if (!session?.user) return null;

  return (
    <Box px="md" py="xl" bg={theme.colors.gray[0]} style={{ minHeight: "100%" }}>
      <Grid gutter="md">
        {/* Left Column: 30% */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <AnnouncementsCard
              sdkLoaded={sdkLoaded}
              sdkFailed={sdkFailed}
              pad={theme.spacing.md}
              radius={theme.radius.lg}
            />
          </Stack>
        </Grid.Col>

        {/* Right Column: 70% */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <CarouselCard pad={theme.spacing.md} radius={theme.radius.lg} />
            <CalendarCard
              calendarRef={calendarRef}
              currentDate={currentDate}
              pad={theme.spacing.md}
              radius={theme.radius.lg}
              isMobile={!!isMobile}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

/* ---------------- COMPONENTS ---------------- */

function AnnouncementsCard({
  sdkLoaded,
  sdkFailed,
  pad,
  radius,
}: {
  sdkLoaded: boolean;
  sdkFailed: boolean;
  pad: string | number;
  radius: string | number;
}) {
  const theme = useMantineTheme();
  return (
    <Card shadow="sm" padding={pad} radius={radius} withBorder style={{ backgroundColor: theme.white }}>
      <Title order={2} mb="xs">
        Announcements
      </Title>
      <Divider mb="sm" />
      {!sdkLoaded && sdkFailed && (
        <Alert title="Content Not Available" color="red" radius="md" variant="filled" mb="sm">
          <Text size="sm">
            Your browser may be blocking Facebook content. Try a different browser or adjust your settings.
          </Text>
        </Alert>
      )}
      {sdkLoaded && !sdkFailed && (
        <div
          className="fb-page"
          data-href="https://www.facebook.com/olfurcyval"
          data-tabs="timeline"
          data-width="500"
          data-height="600"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
          style={{ width: "100%", display: "block" }}
        />
      )}
      {(!sdkLoaded || sdkFailed) && (
        <Text size="sm" c="dimmed">
          Loading announcements…
        </Text>
      )}
    </Card>
  );
}

function CarouselCard({ pad, radius }: { pad: string | number; radius: string | number }) {
  const theme = useMantineTheme();

  const reminders = [
    {
      title: "Get enough sleep",
      description: "Have at least 6–8 hours of rest the night before donating.",
      image: "/sleep.svg",
    },
    {
      title: "Eat a healthy meal",
      description: "Avoid fatty foods. Eat iron-rich meals before donating.",
      image: "/meal.svg",
    },
    {
      title: "Stay hydrated",
      description: "Drink plenty of water before and after your donation.",
      image: "/water.svg",
    },
    {
      title: "Bring a valid ID",
      description: "Always carry a government-issued or school ID.",
      image: "/idcard.svg",
    },
    {
      title: "Avoid alcohol & smoking",
      description: "Do not drink alcohol or smoke 24 hours before donating.",
      image: "/noalcohol.svg",
    },
    {
      title: "Be in good health",
      description: "Donate only if you feel well and meet the requirements.",
      image: "/healthy.svg",
    },
  ];

  const chunkData = (data: typeof reminders, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const slides = chunkData(reminders, 4);

  return (
    <Card shadow="sm" padding={pad} radius={radius} withBorder style={{ backgroundColor: theme.white }}>
      <Title order={3} mb="xs">
        Reminders Before Donating Blood
      </Title>
      <Divider mb="sm" />

      <Carousel loop withIndicators height={230} slideSize="100%" align="center" mx="auto" withControls>
        {slides.map((group, index) => (
          <Carousel.Slide key={index}>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: theme.spacing.sm,
              }}
            >
              {group.map((item, i) => (
                <Box
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    borderRadius: theme.radius.md,
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: theme.white,
                    padding: theme.spacing.sm,
                    minHeight: 230,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  <Text fw={700} size="sm" mb={4} ta="center" lineClamp={2}>
                    {item.title}
                  </Text>
                  <Text size="xs" ta="center" lineClamp={3}>
                    {item.description}
                  </Text>
                </Box>
              ))}
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Card>
  );
}

function CalendarCard({
  calendarRef,
  currentDate,
  pad,
  radius,
  isMobile,
}: {
  calendarRef: React.RefObject<FullCalendar | null>;
  currentDate: Date;
  pad: string | number;
  radius: string | number;
  isMobile: boolean;
}) {
  const theme = useMantineTheme();
  return (
    <Card padding={pad} shadow="sm" radius={radius} withBorder style={{ backgroundColor: theme.white }}>
      <Group align="apart" mb="xs">
        <Title order={2}>Calendar</Title>
        <Text size="sm" c="dimmed">
          {currentDate.toLocaleDateString()}
        </Text>
      </Group>
      <Divider />
      <Box
        style={{
          flex: 1,
          width: "100%",
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.gray[3]}`,
          overflow: "hidden",
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="450px"
          expandRows
          headerToolbar={{ start: "title", center: "", end: "prev,next" }}
          dayMaxEventRows={isMobile ? 2 : 3}
          fixedWeekCount={false}
          aspectRatio={isMobile ? 1.2 : 1.6}
        />
      </Box>
    </Card>
  );
}

export default DashboardContent;
