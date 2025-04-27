"use client";

import { Carousel } from "@mantine/carousel";
import { Paper, Box, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Services from "@/components/Slides/Services";
import Benefits from "@/components/Slides/Benefits";
import type { EmblaCarouselType } from 'embla-carousel';

const HomePageCarousel = () => {
  const slideComponents = [
    <Services key="services-1" />,
    <Benefits key="benefits-2" />,
    <Services key="services-3" />
  ];
  const [active, setActive] = useState(0);
  const carouselRef = useRef<EmblaCarouselType | null>(null);
  const autoplay = useRef(
    Autoplay({
      delay: 15000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  const goToPreviousSlide = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollPrev();
    autoplay.current?.stop();
  };

  const goToNextSlide = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollNext();
    autoplay.current?.stop();
  };

  const handleArrowMouseEnter = () => autoplay.current?.stop();
  const handleArrowMouseLeave = () => autoplay.current?.play();

  return (
    <Paper
      radius="lg"
      p="xl"
      mt={96}
      mx="auto"
      style={{
        maxWidth: 1000,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "40px",
        position: "relative",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
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
      <Box style={{ position: "relative" }}>
        <Carousel
          loop
          height={450}
          draggable
          slidesToScroll={1}
          onSlideChange={setActive}
          withControls={false}
          plugins={[autoplay.current]}
          styles={{
            root: { backgroundColor: "transparent", position: "relative" },
            slide: { backgroundColor: "transparent" },
          }}
          getEmblaApi={(api) => (carouselRef.current = api)}
        >
          {slideComponents.map((Slide, idx) => (
            <Carousel.Slide key={idx}>{Slide}</Carousel.Slide>
          ))}
        </Carousel>

        <Box
          onClick={goToPreviousSlide}
          onMouseEnter={handleArrowMouseEnter}
          onMouseLeave={handleArrowMouseLeave}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            cursor: "pointer",
            opacity: 0.7,
            transition: "opacity 300ms, transform 300ms",
          }}
          className="left-arrow"
        >
          <IconChevronLeft size={36} />
        </Box>

        <Box
          onClick={goToNextSlide}
          onMouseEnter={handleArrowMouseEnter}
          onMouseLeave={handleArrowMouseLeave}
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            cursor: "pointer",
            opacity: 0.7,
            transition: "opacity 300ms, transform 300ms",
          }}
          className="right-arrow"
        >
          <IconChevronRight size={36} />
        </Box>
      </Box>

      <Group justify="center" mt="md">
        {slideComponents.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              setActive(index);
              carouselRef.current?.scrollTo(index);
              autoplay.current?.stop();
            }}
            style={{
              width: active === index ? 20 : 12,
              height: 6,
              borderRadius: 4,
              backgroundColor: active === index ? "#000" : "#555",
              transition: "width 300ms ease",
              cursor: "pointer",
            }}
          />
        ))}
      </Group>

      <style jsx>{`
        .left-arrow:hover {
          opacity: 1;
          transform: translateY(-50%) translateX(-8px);
        }
        .right-arrow:hover {
          opacity: 1;
          transform: translateY(-50%) translateX(8px);
        }
      `}</style>
    </Paper>
  );
};

export default HomePageCarousel;
