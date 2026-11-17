"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function RouteTransition({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const openCurtainRef = useRef<(href: string) => void>(() => undefined);
  const closeCurtainRef = useRef<() => void>(() => undefined);
  const enterPageRef = useRef<() => void>(() => undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      const closeCurtain = contextSafe!(() => {
        const curtain = curtainRef.current;
        if (!curtain) return;

        if (fallbackTimerRef.current !== null) {
          window.clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }

        gsap.killTweensOf(curtain);
        gsap.set(curtain, { autoAlpha: 1, transformOrigin: "top" });
        gsap.to(curtain, {
          scaleY: 0,
          duration: 0.42,
          ease: "power3.inOut",
          onComplete: () => {
            pendingHrefRef.current = null;
            setIsTransitioning(false);
            gsap.set(curtain, { autoAlpha: 0 });
          },
        });
      });

      openCurtainRef.current = contextSafe!((href: string) => {
        const curtain = curtainRef.current;
        if (!curtain) return;

        pendingHrefRef.current = href;
        setIsTransitioning(true);
        gsap.killTweensOf(curtain);
        gsap.set(curtain, { autoAlpha: 1, scaleY: 0, transformOrigin: "bottom" });
        gsap.to(curtain, {
          scaleY: 1,
          duration: 0.38,
          ease: "power3.inOut",
          onComplete: () => {
            router.push(href);
            fallbackTimerRef.current = window.setTimeout(() => closeCurtain(), 5000);
          },
        });
      });

      closeCurtainRef.current = closeCurtain;
      enterPageRef.current = contextSafe!(() => {
        const main = rootRef.current?.querySelector<HTMLElement>("main");
        if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        gsap.fromTo(main, { autoAlpha: 0.94, y: 8 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          clearProps: "opacity,transform,visibility",
        });
      });
    },
    { scope: rootRef },
  );

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest("a");
    if (
      !anchor ||
      (anchor.target && anchor.target !== "_self") ||
      anchor.hasAttribute("download") ||
      anchor.hasAttribute("data-no-transition") ||
      pendingHrefRef.current
    ) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;

    event.preventDefault();
    openCurtainRef.current(`${destination.pathname}${destination.search}${destination.hash}`);
  }

  useEffect(() => {
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      return;
    }
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    if (pendingHrefRef.current) closeCurtainRef.current();
    else enterPageRef.current();
  }, [pathname]);

  useEffect(() => () => {
    if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
  }, []);

  return (
    <div ref={rootRef} className="route-transition-shell" onClickCapture={handleClickCapture} aria-busy={isTransitioning}>
      {children}
      <div ref={curtainRef} className="page-transition-curtain" aria-hidden="true">
        <span>SHWASH</span>
        <small>Detailing, brought to you.</small>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{isTransitioning ? "Loading the next page" : ""}</span>
    </div>
  );
}
