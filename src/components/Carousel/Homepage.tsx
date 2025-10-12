"use client";

import { Carousel } from "@mantine/carousel";
import { Paper, Box, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
const Services = lazy(() => import("@/components/Slides/Services"));
const Benefits = lazy(() => import("@/components/Slides/Benefits"));
const FAQ = lazy(() => import("@/components/Slides/Faq"));
const Introduction = lazy(() => import("@/components/Slides/Introduction"));
import type { EmblaCarouselType } from "embla-carousel";
import { lazy, Suspense } from "react";

const HomePageCarousel = () => {
  const slideComponents = [
    <Suspense key="introduction-1" fallback={<div>Loading...</div>}><Introduction /></Suspense>,
    <Suspense key="benefits-2" fallback={<div>Loading...</div>}><Benefits /></Suspense>,
    <Suspense key="services-3" fallback={<div>Loading...</div>}><Services /></Suspense>,
    <Suspense key="faq-4" fallback={<div>Loading...</div>}><FAQ /></Suspense>,
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

        {/* Left Arrow */}
        <Box
          onClick={goToPreviousSlide}
          style={{
            position: "absolute",
            top: "50%",
            left: 15,  // Adjusted position
            transform: "translateY(-50%)",
            zIndex: 20,
            cursor: "pointer",
            opacity: 1,
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
          className="left-arrow"
        >
          <div className="arrow-pill">
            <IconChevronLeft size={28} color="black" />
          </div>
        </Box>

        {/* Right Arrow */}
        <Box
          onClick={goToNextSlide}
          style={{
            position: "absolute",
            top: "50%",
            right: 15,  // Adjusted position
            transform: "translateY(-50%)",
            zIndex: 20,
            cursor: "pointer",
            opacity: 1,
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
          className="right-arrow"
        >
          <div className="arrow-pill">
            <IconChevronRight size={28} color="black"/>
          </div>
        </Box>
      </Box>

      {/* Circle Indicators */}
      <Group
        justify="center"
        style={{
          position: "absolute",
          bottom: "20px", 
          left: "50%",
          transform: "translateX(-50%)", 
          zIndex: 20,  
          display: "flex", 
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
              height: 12,  
              borderRadius: "50%",  
              backgroundColor: active === index ? "#FF4D4D" : "black",  // Active is red, inactive is gray
              transition: "width 300ms ease, background-color 300ms ease",
              cursor: "pointer",
              margin: "0 5px",  
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
          z-index: 20;
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .arrow-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;   /* Slightly smaller button */
          height: 30px;
          background: rgba(255, 77, 77, 0.7);  /* Semi-transparent background */
          border-radius: 15px;  /* Pill shape */
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15); /* Subtle shadow */
          transition: all 0.3s ease;
        }

        .arrow-pill:hover {
          transform: scale(1.1);  /* Slightly enlarge the button on hover */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);  /* Increased shadow on hover */
        }

        .arrow-pill svg {
          color: white;
          transition: color 0.3s ease;
        }

        /* Mobile-specific styling */
        @media (max-width: 768px) {
          .left-arrow {
            left: 20px;  /* Move further to the left */
            background: transparent; /* Remove background on mobile */
          }

          .right-arrow {
            right: 20px;  /* Move further to the right */
            background: transparent; /* Remove background on mobile */
          }

          .arrow-pill {
            background: transparent; /* Remove background for the arrows on mobile */
            box-shadow: none; /* Remove shadow for the arrows on mobile */
          }
        }
      `}</style>
    </Paper>
  );
};

export default HomePageCarousel;
