"use client";

import {
  motion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const easeBrand = [0.16, 1, 0.3, 1] as const;
export const springBrand = { type: "spring" as const, stiffness: 400, damping: 32 };

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeBrand },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeBrand } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: easeBrand },
  },
};

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  ...props
}: RevealProps) {
  const offset =
    direction === "up" ? { y: 32 } : direction === "left" ? { x: 32 } : { x: -32 };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: delay / 1000, ease: easeBrand }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function Parallax({ children, className, offset = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

interface BrandButtonMotionProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
}

export function BrandButtonMotion({ children, className, ...props }: BrandButtonMotionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={springBrand}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
