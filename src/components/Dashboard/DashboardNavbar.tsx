import { signOut, useSession } from "next-auth/react";
import {
  Text,
  Avatar,
  Flex,
  Box,
  Container,
  Group,
  Menu,
  UnstyledButton,
  Burger,
  Modal,
  ActionIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IconLogout, IconSettings, IconCalendarEvent } from "@tabler/icons-react";
import { Calendar } from "@mantine/dates";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { DefaultSession } from "next-auth";
import CustomLoader from "@/components/Loader/CustomLoader";
import dayjs from "dayjs";
import { api } from "@/trpc/react";

type Props = {
  toggleSidebar: () => void;
  session?: DefaultSession | null;
};

const getInitials = (name: string) => {
  const nameParts = name.trim().split(" ");
  return nameParts.map((n) => n[0]?.toUpperCase()).join("").slice(0, 2);
};

const DashboardNavbar = ({ toggleSidebar }: Props) => {
  const { data: session } = useSession();
  const { data: profile } = api.user.getProfile.useQuery();
  const router = useRouter();
  const [burgerOpened, setBurgerOpened] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  const displayName =
  profile?.name ??
  session?.user?.name ??
  "User";

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name ? getInitials(name) : "";

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <Box
      bg="red.7"
      py="sm"
      px="md"
      style={{
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <Container size="lg">
        <Flex justify="space-between" align="center" wrap="wrap">
          <Group gap="sm" align="center">
            <Burger
              opened={burgerOpened}
              onClick={() => {
                setBurgerOpened((o) => !o);
                toggleSidebar();
              }}
              color="white"
              size="sm"
            />
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Flex align="center" gap="xs">
                <Text fw={700} size="lg" style={{ fontFamily: "monospace", color: "white" }}>
                  BLOODPULSE:
                </Text>
                <Image
                  src="/web-app-manifest-192x192.png"
                  alt="BloodPulse Logo"
                  width={28}
                  height={28}
                />
              </Flex>
            </Link>
          </Group>

          <Group gap="xs" align="center" wrap="wrap" justify="flex-end">
            {!isMobile && (
              <Text size="sm" fw={600} c="white">
                Welcome, {displayName}
              </Text>
            )}

            <Menu shadow="md" width={220} position="bottom-end" withArrow>
              <Menu.Target>
                <UnstyledButton aria-label="User menu">
                  {image ? (
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        overflow: "hidden",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={image}
                        alt={name ?? "User Avatar"}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  ) : (
                    <Avatar radius="xl" size={40} color="gray">
                      {initials}
                    </Avatar>
                  )}
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{email}</Menu.Label>
                <Menu.Item onClick={() => router.push("/settings")}>
                  <Group gap="xs">
                    <IconSettings size={16} />
                    Settings
                  </Group>
                </Menu.Item>
                <Menu.Item onClick={handleSignOut} color="red">
                  <Group gap="xs">
                    <IconLogout size={16} />
                    Sign Out
                  </Group>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {isMobile && (
              <>
                <ActionIcon
                  onClick={() => setCalendarModalOpen(true)}
                  variant="light"
                  color="white"
                  aria-label="Calendar"
                >
                  <IconCalendarEvent size={22} />
                </ActionIcon>

                <Modal
                  opened={calendarModalOpen}
                  onClose={() => setCalendarModalOpen(false)}
                  title="Calendar"
                  size="xs"
                  centered
                  overlayProps={{ blur: 2 }}
                >
                  <Calendar
                    size="md"
                    getDayProps={(date) => {
                      const isToday = dayjs(date).isSame(new Date(), "day");
                      return {
                        style: isToday
                          ? {
                              backgroundColor: "#fa5252",
                              color: "white",
                              borderRadius: 4,
                            }
                          : undefined,
                      };
                    }}
                    style={{ width: "100%" }}
                  />
                </Modal>
              </>
            )}
          </Group>
        </Flex>
      </Container>
    </Box>
  );
};

export default DashboardNavbar;
