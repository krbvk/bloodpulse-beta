import { useSession, signOut } from "next-auth/react";
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
  Paper,
  Divider,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconLogout, IconUser, IconBell } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { DefaultSession } from "next-auth";

type Props = {
  toggleSidebar: () => void;
  session: DefaultSession | null;
};

const getInitials = (name: string) => {
  const nameParts = name.trim().split(" ");
  return nameParts.map((n) => n[0]?.toUpperCase()).join("").slice(0, 2);
};

const DashboardNavbar = ({ toggleSidebar, session }: Props) => {
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [burgerOpened, setBurgerOpened] = useState(false);

  if (!session) return null;

  const { name, email, image } = session.user ?? {};
  const initials = name ? getInitials(name) : "";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev);
  };

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
        <Flex justify="space-between" align="center">
          <Group gap="sm">
            <Burger
              opened={burgerOpened}
              onClick={() => {
                setBurgerOpened((o) => !o);
                toggleSidebar();
              }}
              color="white"
            />
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Text fw={700} size="lg" color="white">
                BLOODPULSE: LOGO
              </Text>
            </Link>
          </Group>

          <Group gap="sm">
            <Text size="sm" fw={600} color="white">
              Welcome, {name}
            </Text>

            <Menu shadow="md" width={220} position="bottom-end" withArrow>
              <Menu.Target>
                <UnstyledButton>
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
                <Menu.Item onClick={() => router.push("/profile")}>
                  <Group gap="xs">
                    <IconUser size={16} />
                    Profile
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

            <UnstyledButton onClick={toggleNotifications}>
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#fff2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <IconBell size={20} color="#c92a2a" />
              </Box>
            </UnstyledButton>

            {notificationsOpen && (
              <Paper
                shadow="md"
                p="sm"
                style={{
                  position: "absolute",
                  top: 60,
                  right: 10,
                  width: 260,
                  backgroundColor: "white",
                  borderRadius: 8,
                  zIndex: 1001,
                }}
              >
                <Text size="sm" fw={600} mb="xs">
                  Notifications
                </Text>
                <Divider my="xs" />
                <Box component="ul" style={{ margin: 0, paddingLeft: 20 }}>
                  <li>You have 3 new notifications</li>
                  <li>New donor request</li>
                  <li>Appointment confirmed</li>
                </Box>
              </Paper>
            )}
          </Group>
        </Flex>
      </Container>
    </Box>
  );
};

export default DashboardNavbar;
