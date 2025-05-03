"use client";

import { Carousel } from "@mantine/carousel";
import { Paper, Box, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import Services from "@/components/Slides/Services";
import Benefits from "@/components/Slides/Benefits";
import type { EmblaCarouselType } from "embla-carousel";

const HomePageCarousel = () => {
  const slideComponents = [
    <Services key="services-1" />,
    <Benefits key="benefits-2" />,
    <Services key="services-3" />,
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPreviousSlide();
      } else if (event.key === "ArrowRight") {
        goToNextSlide();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); 

  return (
    <Paper
      radius="lg"
      p={0}
      m={0}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#fff",
        backgroundImage: `
          linear-gradient(to right, #d32f2f 2px, transparent 2px),
          linear-gradient(to bottom, #d32f2f 2px, transparent 2px)
        `,
        backgroundSize: "100px 100px",
        backgroundPosition: "center center",
        position: "relative",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        borderRadius: "0",
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
      <Box style={{ position: "relative", height: "100%", width: "100%" }}>
        <Carousel
          loop
          draggable
          slidesToScroll={1}
          onSlideChange={setActive}
          withControls={false}
          plugins={[autoplay.current]}
          styles={{
            root: { backgroundColor: "transparent", position: "relative", height: "100%" },
            slide: {
              backgroundColor: "transparent",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            },
          }}
          getEmblaApi={(api: EmblaCarouselType) => {
            carouselRef.current = api;
          }}
        >
          {slideComponents.map((Slide, idx) => (
            <Carousel.Slide key={idx}>{Slide}</Carousel.Slide>
          ))}
        </Carousel>

        <Box
          onClick={goToPreviousSlide}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            cursor: "pointer",
            opacity: 0.7,
          }}
          className="left-arrow"
        >
          <div className="arrow-circle">
            <IconChevronLeft size={28} />
          </div>
        </Box>

        <Box
          onClick={goToNextSlide}
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            cursor: "pointer",
            opacity: 0.7,
          }}
          className="right-arrow"
        >
          <div className="arrow-circle">
            <IconChevronRight size={28} />
          </div>
        </Box>
      </Box>

      {/* Circle Indicators */}
      <Group
        justify="center"
        style={{
          position: "absolute",
          bottom: "20px",  // Position at the bottom
          left: "50%",
          transform: "translateX(-50%)",  // Center horizontally
          zIndex: 20,  // Ensure it stays on top of other content
          display: "flex",  // Use flexbox to align the items horizontally
        }}
      >
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
              height: 12,  // Circle height
              borderRadius: "50%",  // Make them round
              backgroundColor: active === index ? "#fff" : "black",  // Active is white, inactive is gray
              transition: "width 300ms ease, background-color 300ms ease",
              cursor: "pointer",
              margin: "0 5px",  // Spacing between indicators
            }}
          />
        ))}
      </Group>

      <style jsx>{`
        .left-arrow,
        .right-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 300ms, transform 300ms;
        }

        .arrow-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: transparent;  /* No semi-transparent black background */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arrow-circle svg {
          color: white;  /* White arrow icon */
        }

        .left-arrow .arrow-circle {
          clip-path: polygon(50% 0%, 0% 25%, 50% 50%, 100% 25%, 50% 0%);  /* Left broken heart */
        }

        .right-arrow .arrow-circle {
          clip-path: polygon(0% 25%, 50% 0%, 100% 25%, 50% 50%, 0% 25%);  /* Right broken heart */
        }
      `}</style>
    </Paper>
  );
};

export default HomePageCarousel;
