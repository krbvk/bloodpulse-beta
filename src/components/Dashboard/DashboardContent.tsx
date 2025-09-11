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
  Grid,
  Modal,
  Stack,
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
      } catch {
        // ignore
      }
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
    <Box px="md" py="lg" bg={theme.colors.gray[0]} style={{ minHeight: "100%" }}>
      <Grid gutter="sm">
        {/* Announcements always on left */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AnnouncementsCard
            sdkLoaded={sdkLoaded}
            sdkFailed={sdkFailed}
            pad={theme.spacing.sm}
            radius={theme.radius.md}
          />
        </Grid.Col>

        {/* Right Column: Reminders + Calendar stacked */}
        {!isMobile && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <RemindersCard pad={theme.spacing.sm} radius={theme.radius.md} />
              <CalendarCard
                calendarRef={calendarRef}
                currentDate={currentDate}
                pad={theme.spacing.sm}
                radius={theme.radius.md}
                isMobile={!!isMobile}
              />
            </Stack>
          </Grid.Col>
        )}
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card shadow="sm" padding={pad} radius={radius} withBorder>
      <Title order={3} mb="xs">
        Announcements
      </Title>
      <Divider mb="sm" />

      {!sdkLoaded && sdkFailed && (
        <Alert
          title="Content Not Available"
          color="red"
          radius="md"
          variant="filled"
          mb="sm"
        >
          <Text size="sm">
            Your browser may be blocking Facebook content. Try a different
            browser or adjust your settings.
          </Text>
        </Alert>
      )}

      {sdkLoaded && !sdkFailed && (
        <Box
          ref={containerRef}
          style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}
        >
          <div
            className="fb-page"
            data-href="https://www.facebook.com/olfurcyval"
            data-tabs="timeline"
            data-width={containerWidth}
            data-height={isMobile ? "400" : "600"}
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
            style={{ width: "100%", display: "block" }}
          />
        </Box>
      )}

      {(!sdkLoaded || sdkFailed) && (
        <Text size="sm" c="dimmed">
          Loading announcements…
        </Text>
      )}
    </Card>
  );
}

function RemindersCard({
  pad,
  radius,
}: {
  pad: string | number;
  radius: string | number;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const [selected, setSelected] = useState<null | (typeof reminders)[0]>(null);

  const chunkData = <T,>(data: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const slides = chunkData(reminders, isMobile ? 1 : 3);

  return (
    <>
      <Card shadow="sm" padding={pad} radius={radius} withBorder>
        <Title order={3} mb="xs">
          Reminders Before Donating Blood
        </Title>
        <Divider mb="sm" />

        <Carousel
          loop
          withIndicators
          withControls
          slideSize="100%"
          height={isMobile ? 240 : 210}
          align={isMobile ? "start" : "center"}
        >
          {slides.map((group, slideIndex) => (
            <Carousel.Slide key={slideIndex}>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : `repeat(${group.length}, 1fr)`,
                  gap: theme.spacing.sm,
                }}
              >
                {group.map((item, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelected(item)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      borderRadius: theme.radius.md,
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: theme.white,
                      padding: theme.spacing.sm,
                      minHeight: isMobile ? 200 : 180,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
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

      {/* Popup Modal when reminder is clicked */}
      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        centered
        size="md"
      >
        {selected && (
          <Box>
            <Divider mb="sm" />
            <img
            src={selected.image}
            alt={selected.title}
            style={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "contain",
              marginBottom: "1rem",
            }}
          />
            <Divider mb="sm" />
            <Text size="sm">{selected.description}</Text>
          </Box>
        )}
      </Modal>
    </>
  );
}

function CalendarCard({
  calendarRef,
  currentDate,
  pad,
  radius,
}: {
  calendarRef: React.RefObject<FullCalendar | null>;
  currentDate: Date;
  pad: string | number;
  radius: string | number;
  isMobile: boolean;
}) {
  const theme = useMantineTheme();
  return (
    <Card padding={pad} shadow="sm" radius={radius} withBorder>
      <Group align="apart" mb="xs">
        <Title order={3}>Calendar</Title>
        <Text size="sm" c="dimmed">
          {currentDate.toLocaleDateString()}
        </Text>
      </Group>
      <Divider mb="sm" />
      <Box
        style={{
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
          height="400px"
          expandRows
          headerToolbar={{ start: "title", center: "", end: "prev,next" }}
          dayMaxEventRows={3}
          fixedWeekCount={false}
          aspectRatio={1.6}
        />
      </Box>
    </Card>
  );
}

export default DashboardContent;
