import { Card, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AnimatedCardProps extends CardProps {
  hoverEffect?: "lift" | "glow" | "scale" | "none";
  animationDelay?: number;
  children: React.ReactNode;
}

export function AnimatedCard({ 
  hoverEffect = "lift", 
  animationDelay = 0,
  className, 
  children, 
  ...props 
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getHoverClasses = () => {
    switch (hoverEffect) {
      case "lift":
        return "hover-lift";
      case "glow":
        return "hover-glow";
      case "scale":
        return "hover-scale";
      default:
        return "";
    }
  };

  return (
    <Card
      className={cn(
        "animate-fade-in",
        getHoverClasses(),
        "transition-all duration-300",
        className
      )}
      style={{ 
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'both'
      }}
      {...props}
    >
      {children}
    </Card>
  );
}