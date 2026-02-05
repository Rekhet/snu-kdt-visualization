import React, { useState, useEffect } from "react";
import { SCROLL_CONFIG } from "../config/scrollConfig";

const FloatingScrollButton = ({ isLocked }) => {
  const [direction, setDirection] = useState("down"); // 'down' or 'up'
  const visible = !isLocked;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * SCROLL_CONFIG.thresholdFactor;
      const progress = scrollY / threshold;

      // If we are past the single view phase, point UP
      if (progress > SCROLL_CONFIG.phases.EVENT_MODEL_INTERACT.end) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const targetPhase =
      (SCROLL_CONFIG.phases.EVENT_MODEL_INTERACT.start +
        SCROLL_CONFIG.phases.EVENT_MODEL_INTERACT.end) /
      2;
    const threshold = window.innerHeight * SCROLL_CONFIG.thresholdFactor;
    const targetScrollY = threshold * targetPhase;

    const startY = window.scrollY;
    const distance = targetScrollY - startY;
    // Standard smooth scroll is usually around 500-800ms.
    // We'll use 1200ms for a noticeably "slower" feel (approx 20% slower than 1s).
    const duration = 1200;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const t = Math.min(elapsed / duration, 1);

      // EaseInOutCubic for very smooth transition
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      window.scrollTo(0, startY + distance * ease);

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-8 right-8 z-[60] p-4 rounded-full shadow-lg bg-brand text-text-inverse hover:bg-brand-dark transition-all duration-500 transform flex items-center justify-center cursor-pointer border border-white/20 backdrop-blur-sm ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      aria-label={
        direction === "down" ? "Scroll down to model" : "Scroll up to model"
      }
      title={direction === "down" ? "Start Exploring" : "Back to Model"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 animate-bounce transition-transform duration-500 ${direction === "up" ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
};

export default FloatingScrollButton;
