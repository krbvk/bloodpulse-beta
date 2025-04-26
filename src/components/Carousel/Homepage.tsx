"use client";

import { Carousel } from "@mantine/carousel";
import { Paper, Box, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Services from "@/components/Slides/Services";

const HomePageCarousel = () => {
  const slideComponents = [
    <Services key="services-1" />,
    <Services key="services-2" />,
    <Services key="services-3" />
  ];
  const [active, setActive] = useState(0);

  return (
    <Paper
      radius="lg"
      p="xl"
      mt={96}
      mx="auto"
      withBorder
      style={{
        maxWidth: 1000,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "40px",
        position: "relative",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        borderRadius: "12px",
      }}
    >
        {/* Container */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: "#d32f2f",
          borderRadius: "8px 8px 0 0",
        }}
      />

      <Carousel
        loop
        height={450}
        draggable
        slidesToScroll={1}
        onSlideChange={setActive}
        plugins={[Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true })]}
        previousControlIcon={<IconChevronLeft size={32} color="#fff" />}
        nextControlIcon={<IconChevronRight size={32} color="#fff" />}
        controlSize={50}
        controlsOffset={20}
        styles={{
            root: {
                backgroundColor: "transparent",
            },
            slide: {
                backgroundColor: "transparent",
            },
          control: {
            backgroundColor: "black",
            backdropFilter: "blur(6px)",
            "&:hover": { backgroundColor: "#333" },
          },
        }}
      >
        {slideComponents.map((Slide, idx) => (
          <Carousel.Slide key={idx}>{Slide}</Carousel.Slide>
        ))}
      </Carousel>

      {/* Indicators outside the carousel */}
      <Group justify="center" mt="md">
        {slideComponents.map((_, index) => (
          <Box
            key={index}
            style={{
              width: active === index ? 20 : 12,
              height: 6,
              borderRadius: 4,
              backgroundColor: active === index ? "#000" : "#555",
              transition: "width 300ms ease",
            }}
          />
        ))}
      </Group>
    </Paper>
  );
};

export default HomePageCarousel;
