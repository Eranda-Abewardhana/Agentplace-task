"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const root = rootRef.current;
      if (!root) return;

      gsap.fromTo(
        root,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className} data-gsap-reveal="true">
      {children}
    </div>
  );
}
