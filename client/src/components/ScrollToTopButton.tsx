import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";

interface ScrollToTopButtonProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollToTopButton({ scrollContainerRef }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const toggleVisibility = () => {
      if (container.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    container.addEventListener("scroll", toggleVisibility);
    toggleVisibility();

    return () => {
      container.removeEventListener("scroll", toggleVisibility);
    };
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-24 right-4 z-50 h-11 w-11 rounded-full shadow-lg transition-all duration-300 md:bottom-8 md:right-8 md:h-12 md:w-12",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
