"use client";

interface GradientOrbProps {
  className?: string;
  color1?: string;
  color2?: string;
  size?: string;
  blur?: string;
  opacity?: number;
  animate?: boolean;
}

export function GradientOrb({
  className = "",
  color1 = "from-[#0071e3]",
  color2 = "to-[#8944ab]",
  size = "w-[600px] h-[600px]",
  blur = "blur-[120px]",
  opacity = 0.1,
  animate = true,
}: GradientOrbProps) {
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br ${color1} ${color2} ${size} ${blur} ${
        animate ? "animate-float" : ""
      } ${className}`}
      style={{ opacity }}
    />
  );
}
