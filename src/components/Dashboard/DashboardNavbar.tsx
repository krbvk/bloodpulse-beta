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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { DefaultSession } from "next-auth";
import CustomLoader from "@/components/Loader/CustomLoader";

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
  const [burgerOpened, setBurgerOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(false);

  if (!session || !session.user) return null;

  const { name, email, image } = session.user ?? {};
  const initials = name ? getInitials(name) : "";

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Sign out failed", error)
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CustomLoader />
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
          {/* Left: Logo & Burger */}
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
              <Text fw={700} size="lg" c="white">
                BLOODPULSE: LOGO
              </Text>
            </Link>
          </Group>

          {/* Right: User Info */}
          <Group gap="xs" align="center" wrap="wrap" justify="flex-end">
            {!isMobile && (
              <Text size="sm" fw={600} c="white">
                Welcome, {name}
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
          </Group>
        </Flex>
      </Container>
    </Box>
  );
};

export default DashboardNavbar;
