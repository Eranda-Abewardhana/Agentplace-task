"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { assets } from "@/lib/assets";

const slides = [
  {
    eyebrow: "Interior detailing",
    title: "A reset for the cabin.",
    description: "Deep vacuuming, steam cleaning, leather care, mats, glass, and the details drivers touch every day.",
    image: assets.interior,
  },
  {
    eyebrow: "Exterior detailing",
    title: "Bring back the shine.",
    description: "A professional hand wash and spray wax help refresh your vehicle’s exterior at your location.",
    image: assets.exterior,
  },
  {
    eyebrow: "Mobile service",
    title: "The detail shop comes to you.",
    description: "SHWASH brings the water, power, products, and equipment for a convenient visit at home or work.",
    image: assets.hero,
  },
];

const AUTOPLAY_DELAY = 5600;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia(MOTION_QUERY);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(MOTION_QUERY).matches;
}

function getServerMotionPreference() {
  return false;
}

export function DetailingCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const currentIndexRef = useRef(0);
  const changeSlideRef = useRef<(nextIndex: number) => void>(() => undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, getServerMotionPreference);

  useGSAP(
    (_context, contextSafe) => {
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        gsap.set(slide, { autoAlpha: index === 0 ? 1 : 0, x: 0 });
      });

      changeSlideRef.current = contextSafe!((nextIndex: number) => {
        const normalizedIndex = (nextIndex + slides.length) % slides.length;
        const previousIndex = currentIndexRef.current;
        if (normalizedIndex === previousIndex) return;

        const outgoing = slideRefs.current[previousIndex];
        const incoming = slideRefs.current[normalizedIndex];
        currentIndexRef.current = normalizedIndex;
        setActiveIndex(normalizedIndex);

        if (!outgoing || !incoming) return;

        gsap.killTweensOf([outgoing, incoming]);

        if (window.matchMedia(MOTION_QUERY).matches) {
          gsap.set(outgoing, { autoAlpha: 0, x: 0 });
          gsap.set(incoming, { autoAlpha: 1, x: 0 });
          return;
        }

        gsap.set(incoming, { autoAlpha: 0, x: 24 });
        gsap.to(outgoing, {
          autoAlpha: 0,
          x: -18,
          duration: 0.35,
          ease: "power2.inOut",
        });
        gsap.to(incoming, {
          autoAlpha: 1,
          x: 0,
          duration: 0.52,
          ease: "power3.out",
        });
      });
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!isPlaying || isInteracting) return;

    const interval = window.setInterval(() => {
      changeSlideRef.current((currentIndexRef.current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [isPlaying, isInteracting, prefersReducedMotion]);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsInteracting(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className="detail-carousel"
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={handleBlur}
    >
      <div className="detail-carousel__viewport" role="region" aria-label="SHWASH detailing photos" aria-roledescription="carousel" aria-live={isPlaying && !isInteracting ? "off" : "polite"}>
        {slides.map((slide, index) => (
          <div
            key={slide.eyebrow}
            ref={(node) => { slideRefs.current[index] = node; }}
            className={`detail-carousel__slide${activeIndex === index ? " is-active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.eyebrow}`}
            aria-hidden={activeIndex !== index}
            inert={activeIndex !== index}
          >
            <Image src={slide.image.src} alt={slide.image.alt} fill sizes="(max-width: 880px) 100vw, 60vw" />
            <div className="detail-carousel__shade" />
            <div className="detail-carousel__copy">
              <span>{slide.eyebrow}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="detail-carousel__controls" aria-label="Carousel controls">
        <div className="detail-carousel__control-group">
          <button type="button" className="detail-carousel__arrow" aria-label="Previous slide" onClick={() => changeSlideRef.current(activeIndex - 1)}>
            <ArrowLeft size={17} aria-hidden="true" />
          </button>
          <span className="detail-carousel__count">{String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span>
          <button type="button" className="detail-carousel__arrow" aria-label="Next slide" onClick={() => changeSlideRef.current(activeIndex + 1)}>
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="detail-carousel__dots" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={slide.eyebrow}
              type="button"
              className={`detail-carousel__dot${activeIndex === index ? " is-active" : ""}`}
              aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => changeSlideRef.current(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="detail-carousel__autoplay"
          aria-label={isPlaying ? "Pause automatic slide changes" : "Resume automatic slide changes"}
          onClick={() => setIsPlaying((playing) => !playing)}
        >
          {isPlaying ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
      </div>
    </div>
  );
}
