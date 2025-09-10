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
  } from "@mantine/core";
  import { Carousel } from "@mantine/carousel";
  import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
  import type { Session } from "next-auth";
  import { useSdkContext } from "@/components/Dashboard/SdkContext";
  import { useMediaQuery } from "@mantine/hooks";
  import FullCalendar from "@fullcalendar/react";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import type { CalendarApi } from "@fullcalendar/core";

  /* ---------------- PROPS ---------------- */
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

  /* ---------------- MAIN ---------------- */
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
          {/* LEFT SIDE: Announcements */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <AnnouncementsCard
              sdkLoaded={sdkLoaded}
              sdkFailed={sdkFailed}
              pad={theme.spacing.sm}
              radius={theme.radius.md}
            />
          </Grid.Col>

          {/* RIGHT SIDE: Reminders (top) + Calendar (bottom, only desktop) */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Grid gutter="sm">
              <Grid.Col span={12}>
                <CarouselCard pad={theme.spacing.sm} radius={theme.radius.md} />
              </Grid.Col>

              {!isMobile && (
                <Grid.Col span={12}>
                  <CalendarCard
                    calendarRef={calendarRef}
                    currentDate={currentDate}
                    pad={theme.spacing.sm}
                    radius={theme.radius.md}
                    isMobile={!!isMobile}
                  />
                </Grid.Col>
              )}
            </Grid>
          </Grid.Col>
        </Grid>
      </Box>
    );
  };

  /* ---------------- ANNOUNCEMENTS ---------------- */
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
    const isMobile = useMediaQuery("(max-width: auto)");
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [cardHeight, setCardHeight] = useState(600);

    useEffect(() => {
      const updateSizes = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
        if (cardRef.current) {
          const newHeight = cardRef.current.offsetHeight - 80; // minus header space
          setCardHeight(newHeight);
        }
        if (window.FB?.XFBML) {
          window.FB.XFBML.parse(); // re-render FB plugin after resize
        }
      };

      updateSizes();
      window.addEventListener("resize", updateSizes);
      return () => window.removeEventListener("resize", updateSizes);
    }, []);

    return (
      <Card
        ref={cardRef}
        shadow="sm"
        padding={pad}
        radius={radius}
        withBorder
        style={{ height: isMobile ? "auto" : "740px" }}
      >
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
            style={{
              width: "auto",
              maxWidth: "100%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="fb-page"
              data-href="https://www.facebook.com/olfurcyval"
              data-tabs="timeline"
              data-width={containerWidth}
              data-height={cardHeight}
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
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

  /* ---------------- REMINDERS ---------------- */
  function CarouselCard({
    pad,
    radius,
  }: {
    pad: string | number;
    radius: string | number;
  }) {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const reminders = [
      { title: "Get enough sleep", description: "Have at least 6–8 hours of rest the night before donating.", image: "/sleep.svg" },
      { title: "Eat a healthy meal", description: "Avoid fatty foods. Eat iron-rich meals before donating.", image: "/meal.svg" },
      { title: "Stay hydrated", description: "Drink plenty of water before and after your donation.", image: "/water.svg" },
      { title: "Bring a valid ID", description: "Always carry a government-issued or school ID.", image: "/idcard.svg" },
      { title: "Avoid alcohol & smoking", description: "Do not drink alcohol or smoke 24 hours before donating.", image: "/noalcohol.svg" },
      { title: "Be in good health", description: "Donate only if you feel well and meet the requirements.", image: "/healthy.svg" },
    ];

    const [opened, setOpened] = useState(false);
    const [selectedItem, setSelectedItem] = useState<(typeof reminders)[0] | null>(null);

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
        {/* Modal */}
        <Modal opened={opened} onClose={() => setOpened(false)} centered size="lg">
          {selectedItem && (
            <Card shadow="sm" radius="md" padding="md" withBorder>
              <Box
                style={{
                  backgroundImage: `url(${selectedItem.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "100%",
                  height: 400,
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              />
              <Title order={4} mb="xs" style={{ color: "#fa5252", fontWeight: 600 }}>
                {selectedItem.title}
              </Title>
              <Text size="sm" c="dimmed" lh={1.5}>
                {selectedItem.description}
              </Text>
            </Card>
          )}
        </Modal>

        <Card shadow="sm" padding={pad} radius={radius} withBorder>
          <Title order={3} mb="xs">
            Reminders Before Donating Blood
          </Title>
          <Divider mb="sm" />
          <Carousel
            loop
            withIndicators
            slideSize="100%"
            height={isMobile ? 210 : 210}
            align={isMobile ? "start" : "center"}
            nextControlIcon={<IconChevronRight size={40} color="#fa5252" stroke={2.5} />}
            previousControlIcon={<IconChevronLeft size={40} color="#fa5252" stroke={2.5} />}
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
                      onClick={() => {
                        setSelectedItem(item);
                        setOpened(true);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        borderRadius: theme.radius.md,
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url(${item.image})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        color: theme.white,
                        padding: theme.spacing.sm,
                        minHeight: isMobile ? 260 : 220,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        cursor: "pointer",
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
      </>
    );
  }

  /* ---------------- CALENDAR ---------------- */
  function CalendarCard({
    calendarRef,

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
    if (isMobile) return null;

    return (
      <Card padding={pad} shadow="sm" radius={radius} withBorder>
        {/* <Group align="apart" mb="xs">
          <Title order={3}>Calendar</Title>
          <Text size="sm" c="dimmed">
            {currentDate.toLocaleDateString()}
          </Text>
        </Group> */}
        <Divider mb="sm" />
        <Box
          style={{
            width: "100%",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.gray[3]}`,
            overflow: "hidden",
          }}
        >
          <style jsx global>{`
            .fc .fc-prev-button,
            .fc .fc-next-button {
              background-color: #fa5252 !important;
              border-color: #fa5252 !important;
              color: white !important;
            }
            .fc .fc-prev-button:hover,
            .fc .fc-next-button:hover {
              background-color: #e03131 !important;
              border-color: #e03131 !important;
            }
          `}</style>

          <FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin]}
  initialView="dayGridMonth"
  height={400} // ✅ Fixed height
  expandRows
  headerToolbar={{ start: "title", center: "", end: "prev,next" }}
  dayMaxEventRows={3}
  fixedWeekCount={false}
  aspectRatio={undefined} // ✅ Remove aspectRatio so height takes full control
/>

        </Box>
      </Card>
    );
  }

  export default DashboardContent;
