"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === "up"
      ? "translate-y-8"
      : direction === "left"
        ? "translate-x-8"
        : "-translate-x-8";

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${className} ${
        visible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${dirClass}`
      }`}
    >
      {children}
    </div>
  );
}
