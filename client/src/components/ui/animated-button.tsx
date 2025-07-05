import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AnimatedButtonProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "bounce" | "pulse" | "glow";
  children: React.ReactNode;
}

export function AnimatedButton({ 
  variant = "default", 
  className, 
  children, 
  onClick,
  ...props 
}: AnimatedButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    if (onClick) {
      onClick(e);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "bounce":
        return "hover-scale transform active:scale-95 transition-all duration-200";
      case "pulse":
        return "hover:animate-pulse-slow transition-all duration-300";
      case "glow":
        return "hover-glow transition-all duration-300";
      default:
        return "hover-lift transition-all duration-200";
    }
  };

  return (
    <Button
      className={cn(
        getVariantClasses(),
        isClicked && "animate-bounce-subtle",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}