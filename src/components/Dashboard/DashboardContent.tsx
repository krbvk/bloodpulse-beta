"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Title,
  Alert,
  Card,
  Text,
  useMantineTheme,
  Divider,
  Group,
  ThemeIcon,
  ActionIcon,
  Grid,
  Stack,
  Button,
  Collapse,
} from "@mantine/core";
import type { Session } from "next-auth";
import { useSdkContext } from "@/components/Dashboard/SdkContext";
import { useMediaQuery } from "@mantine/hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { CalendarApi } from "@fullcalendar/core";
import {
  IconDroplet,
  IconHeart,
  IconRun,
  IconMeat,
  IconMoodSmile,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

type Props = {
  session: Session | null;
};

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

const DashboardContent = ({ session }: Props) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { sdkLoaded, sdkFailed } = useSdkContext();
  const [currentDate] = useState(new Date());
  const calendarRef = useRef<FullCalendar | null>(null);

  const tips = useMemo(
    () => [
      { icon: <IconDroplet size={18} />, text: "Stay hydrated — aim for 8 glasses daily." },
      { icon: <IconMeat size={18} />, text: "Eat iron-rich foods like spinach, red meat, and beans." },
      { icon: <IconHeart size={18} />, text: "1 blood donation can save up to 3 lives." },
      { icon: <IconMoodSmile size={18} />, text: "Donate blood every 3–4 months if eligible." },
      { icon: <IconRun size={18} />, text: "Light exercise keeps your circulation healthy." },
    ],
    []
  );

  // Slides — use /public assets or remote images
  const slides = useMemo(
    () => [
      { src: "/booking.svg", caption: "Save up to 3 lives with a single donation." },
      { src: "/event.svg", caption: "Donating helps monitor your health through regular checks." },
      { src: "https://picsum.photos/1200/600?random=1", caption: "Support hospitals and emergency care in your community." },
      { src: "https://picsum.photos/1200/600?random=2", caption: "Experience the joy and satisfaction of helping others." },
      { src: "https://picsum.photos/1200/600?random=3", caption: "Regular donations encourage routine health checkups." },
    ],
    []
  );

  // --- Responsive helpers
  const cardPad = isMobile ? theme.spacing.md : theme.spacing.lg;
  const cardRadius = theme.radius.lg;

  // --- Facebook SDK re-parse when ready or when layout changes
  useEffect(() => {
    if (sdkLoaded && typeof window !== "undefined" && window.FB?.XFBML) {
      try {
        window.FB.XFBML.parse();
      } catch {
        /* ignore */
      }
    }
  }, [sdkLoaded, isMobile]);

  // --- Update calendar size after layout changes
  useEffect(() => {
    const t = setTimeout(() => {
      const api: CalendarApi | undefined = calendarRef.current?.getApi();
      api?.updateSize();
    }, 120);
    return () => clearTimeout(t);
  }, [isMobile, isTablet]);

  if (!session?.user) return null;

  return (
    <Box
      px="md"
      py="xl"
      bg={theme.colors.gray[0]}
      style={{ borderRadius: theme.radius.md, minHeight: "100%", boxSizing: "border-box" }}
    >
      <Grid gutter={isMobile ? "md" : "xl"}>
        {/* LEFT COLUMN */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <AnnouncementsCard
              sdkLoaded={sdkLoaded}
              sdkFailed={sdkFailed}
              pad={cardPad}
              radius={cardRadius}
            />
            <TipsCard tips={tips} pad={cardPad} radius={cardRadius} />
          </Stack>
        </Grid.Col>

        {/* RIGHT COLUMN */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <CarouselCard slides={slides} pad={cardPad} radius={cardRadius} isMobile={isMobile} />
            <CalendarCard
              calendarRef={calendarRef}
              currentDate={currentDate}
              pad={cardPad}
              radius={cardRadius}
              isMobile={isMobile}
            />
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Calendar styles */}
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: ${isMobile ? "1rem" : "1.125rem"};
          font-weight: 700;
        }
        .fc .fc-daygrid-day-number {
          font-size: ${isMobile ? "0.8rem" : "0.9rem"};
          padding: ${isMobile ? "2px 6px" : "4px 8px"};
        }
        .fc-day-today {
          background-color: ${theme.colors.blue[0]} !important;
          border: none !important;
          color: ${theme.black} !important;
          font-weight: bold !important;
        }
      `}</style>
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
      <Title order={2} mb="xs" style={{ fontWeight: 700 }}>
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

function TipsCard({
  tips,
  pad,
  radius,
}: {
  tips: { icon: React.ReactNode; text: string }[];
  pad: string | number;
  radius: string | number;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, setOpened] = useState(false);

  const visible = isMobile ? tips.slice(0, 3) : tips;
  const hidden = isMobile ? tips.slice(3) : [];

  return (
    <Card shadow="sm" padding={pad} radius={radius} withBorder style={{ backgroundColor: theme.white }}>
      <Title order={3} mb="xs" style={{ fontWeight: 700 }}>
        Health & Motivation
      </Title>
      <Divider mb="sm" />
      <Box>
        {visible.map((tip, i) => (
          <Group key={`tip-${i}`} align="center" gap="sm" mb="xs" wrap="nowrap">
            <ThemeIcon variant="light" color="red" radius="xl" size="md">
              {tip.icon}
            </ThemeIcon>
            <Text size="sm">{tip.text}</Text>
          </Group>
        ))}

        {hidden.length > 0 && (
          <>
            <Collapse in={opened}>
              {hidden.map((tip, i) => (
                <Group key={`tip-hidden-${i}`} align="center" gap="sm" mb="xs" wrap="nowrap">
                  <ThemeIcon variant="light" color="red" radius="xl" size="md">
                    {tip.icon}
                  </ThemeIcon>
                  <Text size="sm">{tip.text}</Text>
                </Group>
              ))}
            </Collapse>
            <Button
              variant="subtle"
              size="xs"
              rightSection={opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              onClick={() => setOpened((o) => !o)}
            >
              {opened ? "Show less" : "Show more"}
            </Button>
          </>
        )}
      </Box>
    </Card>
  );
}

function CarouselCard({
  slides,
  pad,
  radius,
  isMobile,
}: {
  slides: { src: string; caption: string }[];
  pad: string | number;
  radius: string | number;
  isMobile: boolean;
}) {
  const theme = useMantineTheme();
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Simple swipe detection (no dependency)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const next = () => setSlideIndex((s) => (s + 1) % slides.length);
  const prev = () => setSlideIndex((s) => (s - 1 + slides.length) % slides.length);
  const goTo = (i: number) => setSlideIndex(i);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!paused) {
      intervalRef.current = window.setInterval(() => {
        setSlideIndex((s) => (s + 1) % slides.length);
      }, 3500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [paused, slides.length]);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current == null || touchEndX.current == null) return;
    const delta = touchEndX.current - touchStartX.current;
    const threshold = 40; // px
    if (delta > threshold) prev();
    else if (delta < -threshold) next();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const height = isMobile ? 190 : 260;

  return (
    <Card padding={pad} shadow="sm" radius={radius} withBorder style={{ backgroundColor: theme.white }}>
      <Title order={3} mb="xs" style={{ fontWeight: 700 }}>
        Past Donation Events
      </Title>
      <Divider mb="sm" />

      <Box
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height,
          maxHeight: 420,
          borderRadius: theme.radius.md,
          overflow: "hidden",
          backgroundColor: theme.colors.gray[1],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* slides wrapper */}
        <Box
          style={{
            display: "flex",
            height: "100%",
            width: `${slides.length * 100}%`,
            transform: `translateX(-${slideIndex * (100 / slides.length)}%)`,
            transition: "transform 600ms ease",
          }}
        >
          {slides.map((s, i) => (
            <Box
              key={i}
              style={{
                flex: `0 0 ${100 / slides.length}%`,
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={s.src}
                alt={s.caption}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  background: theme.colors.gray[2],
                }}
                draggable={false}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/1200x600?text=Image+not+found";
                }}
              />
              {/* caption overlay */}
              <Box
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: isMobile ? theme.spacing.xs : theme.spacing.sm,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
                  color: "white",
                }}
              >
                <Text fw={600} size={isMobile ? "xs" : "sm"} style={{ lineHeight: 1.2 }}>
                  {s.caption}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Prev arrow */}
        <ActionIcon
          variant="default"
          size={isMobile ? "md" : "lg"}
          onClick={prev}
          aria-label="Previous slide"
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>

        {/* Next arrow */}
        <ActionIcon
          variant="default"
          size={isMobile ? "md" : "lg"}
          onClick={next}
          aria-label="Next slide"
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <IconChevronRight size={18} />
        </ActionIcon>

        {/* Dots */}
        <Group
          justify="center"
          gap={8}
          style={{ position: "absolute", bottom: 8, left: 0, right: 0, zIndex: 6 }}
          wrap="nowrap"
        >
          {slides.map((_, i) => {
            const active = i === slideIndex;
            return (
              <Box
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: active ? 10 : 8,
                  height: active ? 10 : 8,
                  borderRadius: 12,
                  backgroundColor: active ? theme.colors.red[7] : theme.colors.gray[4],
                  cursor: "pointer",
                  transition: "all 200ms",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </Group>
      </Box>
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
    <Card
      padding={pad}
      shadow="sm"
      radius={radius}
      withBorder
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.sm,
        backgroundColor: theme.white,
      }}
    >
      <Group align="apart" mb="xs" wrap="nowrap">
        <Title order={2} style={{ fontWeight: 700 }}>
          Event Calendar
        </Title>
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
          height="auto"
          expandRows
          headerToolbar={{
            start: "title",
            center: "",
            end: "prev,next",
          }}
          dayMaxEventRows={isMobile ? 2 : 3}
          fixedWeekCount={false}
          aspectRatio={isMobile ? 1.2 : 1.6}
        />
      </Box>
    </Card>
  );
}

export default DashboardContent;
