import { Card, Image, Stack, Title, Text } from "@mantine/core";

export default function Services() {
  return (
    <Card
      radius="md"
      p="xl"
      style={{
        background: "#fff",
        border: "1px solid #d7ccc8",
        // borderRadius: "12px",
        // boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
      }}
    >
      {/* <Image
        src="/images/services-hero.jpg"
        alt="Our Services"
        height={240}
        style={{ borderRadius: "8px" }}
      /> */}
      <Stack align="center" gap="sm" mt="md">
        <Title order={2} style={{ fontFamily: "'Dancing Script', cursive" }}>
          Our Services
        </Title>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
        <Text size="sm" color="dimmed">
          Explore all the ways you can help save lives—donate blood, organize a drive,
          or volunteer at events near you.
        </Text>
      </Stack>
    </Card>
  );
}
