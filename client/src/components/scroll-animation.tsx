import { useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationType?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "slideInUp";
  delay?: number;
}

export function ScrollAnimation({ 
  children, 
  className = "", 
  animationType = "fadeInUp",
  delay = 0 
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const animations = {
    fadeInUp: isVisible 
      ? "opacity-100 translate-y-0 transform transition-all duration-700 ease-out" 
      : "opacity-0 translate-y-8 transform",
    fadeInLeft: isVisible 
      ? "opacity-100 translate-x-0 transform transition-all duration-700 ease-out" 
      : "opacity-0 -translate-x-8 transform",
    fadeInRight: isVisible 
      ? "opacity-100 translate-x-0 transform transition-all duration-700 ease-out" 
      : "opacity-0 translate-x-8 transform",
    scaleIn: isVisible 
      ? "opacity-100 scale-100 transform transition-all duration-700 ease-out" 
      : "opacity-0 scale-95 transform",
    slideInUp: isVisible 
      ? "opacity-100 translate-y-0 transform transition-all duration-1000 ease-out" 
      : "opacity-0 translate-y-12 transform"
  };

  return (
    <div ref={ref} className={`${animations[animationType]} ${className}`}>
      {children}
    </div>
  );
}