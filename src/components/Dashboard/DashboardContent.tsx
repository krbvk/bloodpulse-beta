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
  Grid,
  Modal,
  Stack,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import type { Session } from "next-auth";
import { useSdkContext } from "@/components/Dashboard/SdkContext";
import { useMediaQuery } from "@mantine/hooks";
import type FullCalendar from "@fullcalendar/react";
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
        <Grid.Col span={{ base: 12, md: 5 }}>
          <AnnouncementsCard
            sdkLoaded={sdkLoaded}
            sdkFailed={sdkFailed}
            pad={theme.spacing.sm}
            radius={theme.radius.md}
          />
        </Grid.Col>


<Grid.Col span={{ base: 12, md: 7 }}>
  <Stack gap="sm">
    <RemindersCard pad={theme.spacing.sm} radius={theme.radius.md} />
    <RemindersCardDont pad={theme.spacing.sm} radius={theme.radius.md} />
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
      title: "Wait after your last donation",
      description: "You shouldwait at least 3 months after your last donation.",
      image: "/month.svg",
    },
     {
      title: "Be healthy",
      description: "you must be in good health and free from any illness.",
      image: "/healthy.svg",
    },
    {
      
      title: "Get enough sleep",
      description: "Have at least 5–6 hours of rest the night before donating.",
      image: "/sleep.svg",
    },
    {
      title: "Eat Before donating",
      description: "It's best to eat an iron-rich meal.",
      image: "/meal.svg",
    },
    {
      title: "Stay hydrated",
      description: "Drink water or non-alcoholic and non-caffeinated beverages.",
      image: "/water.svg",
    },
    {
      title: "Be honest",
      description: "provide accurate information about your health.",
      image: "/honest.svg",
    },
    {
      title: "Notify the staff",
      description: "Tell the staff or volunteers if you feel unwell at any point.",
      image: "/staff.svg",
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

  const slides = chunkData(reminders, isMobile ? 1 : 4);

  return (
    <>
      <Card shadow="sm" padding={pad} radius={radius} withBorder>
      <Title order={3} mb="xs">
  Reminders Before Donating Blood (
  <Text span c="green" fw={700}>
    DO&apos;S
  </Text>
  )
</Title>

        <Divider mb="sm" />

       <Carousel
  loop
  withIndicators
  withControls
  slideSize="100%"
  height={isMobile ? 290 : 254}  // ⬅️ taller carousel
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
              padding: theme.spacing.md,
              minHeight: isMobile ? 260 : 240, // ⬅️ taller item
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
  centered
  size="lg"
  overlayProps={{
    backgroundOpacity: 0.55,
    blur: 4,
  }}
  styles={{
    header: {
      backgroundColor: "white",
      padding: "1rem 1.25rem",
      borderBottom: "1px solid #f1f1f1",
    },
    title: {
      color: "#fa5252",
      fontWeight: 700,
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    body: {
      backgroundColor: "white",
      padding: "1.5rem",
    },
    close: {
      color: "#fa5252",
      "&:hover": { backgroundColor: "rgba(250,82,82,0.08)" },
    },
  }}
  title={
    <Box style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ fontSize: "1.25rem" }}>❤️</span>
      <span>Reminders Before Donating Blood (DO&apos;S)</span>
    </Box>
  }
>
  {selected && (
    <Grid gutter="lg" align="flex-start">
      {/* Left side: Image */}
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Box
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            padding: "0.75rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={selected.image}
            alt={selected.title}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Grid.Col>

      {/* Right side: Content */}
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Title order={4} mb="sm" c="#fa5252">
          {selected.title}
        </Title>

        <Divider mb="sm" />

        <Text size="sm" c="black" lh={1.6}>
          {selected.description}
        </Text>
      </Grid.Col>
    </Grid>
  )}
</Modal>

    </>
  );
}


function RemindersCardDont({
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
      title: "Weight restrictions",
      description: "don't donate if you weigh less than 110 lbs (50 kg).",
      image: "/weight.svg",
    },
    {
      title: "Illnesses",
      description: "Don't donate if you have a cough,cold or fever.",
      image: "/illnes.svg",
    },
    {
      title: "Open wounds",
      description: "Don't donate if you have open wounds or sores.",
      image: "/wound.svg",
    },
    {
      title: "Eating fatty foods",
      description: "Avoid eating fatty foods before donating.",
      image: "/fat.svg",
    },
    {
      title: "Alcohol",
      description: "Avoid drinking alcohol at least 24 hours before donating.",
      image: "/alcohol.svg",
    },
    {
      title: "Tatto",
      description: "Wait at least one year to donate after getting tattoo.",
      image: "/tatto.svg",
    },

     {
      title: "Vaccines",
      description: "Anti-rabies & tetanus - atleast one year. Flu,Hepatitis B, others- no symptoms.",
      image: "/vaccine.svg",
    },
    {
      title: "Dental Procedures",
      description: "tooth extraction - at least 3 days. wisdom tooth- at least 1 year.",
      image: "/dental.svg",
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

  const slides = chunkData(reminders, isMobile ? 1 : 4);

  return (
    <>
      <Card shadow="sm" padding={pad} radius={radius} withBorder>
       <Title order={3} mb="xs">
  Reminders Before Donating Blood (
  <Text span c="#fa5252" fw={700}>
    DON&apos;TS
  </Text>
  )
</Title>

        <Divider mb="sm" />

        <Carousel
  loop
  withIndicators
  withControls
  slideSize="100%"
  height={isMobile ? 290 : 254}  // ⬅️ taller carousel
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
              padding: theme.spacing.md,
              minHeight: isMobile ? 260 : 240, // ⬅️ taller item
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

     <Modal
  opened={!!selected}
  onClose={() => setSelected(null)}
  centered
  size="lg"
  overlayProps={{
    backgroundOpacity: 0.55,
    blur: 4,
  }}
  styles={{
    header: {
      backgroundColor: "white",
      padding: "1rem 1.25rem",
      borderBottom: "1px solid #f1f1f1",
    },
    title: {
      color: "#fa5252",
      fontWeight: 700,
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    body: {
      backgroundColor: "white",
      padding: "1.5rem",
    },
    close: {
      color: "#fa5252",
      "&:hover": { backgroundColor: "rgba(250,82,82,0.08)" },
    },
  }}
  title={
    <Box style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ fontSize: "1.25rem" }}>❤️</span>
      <span>Reminders Before Donating Blood (DON&apos;TS)</span>
    </Box>
  }
>
  {selected && (
    <Grid gutter="lg" align="flex-start">
      {/* Left side: Image */}
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Box
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            padding: "0.75rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={selected.image}
            alt={selected.title}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Grid.Col>

      {/* Right side: Content */}
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Title order={4} mb="sm" c="#fa5252">
          {selected.title}
        </Title>

        <Divider mb="sm" />

        <Text size="sm" c="black" lh={1.6}>
          {selected.description}
        </Text>
      </Grid.Col>
    </Grid>
  )}
</Modal>

    </>
  );
}


export default DashboardContent;
