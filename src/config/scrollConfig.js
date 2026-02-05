// Centralized configuration for Scroll-based Animations

export const SCROLL_CONFIG = {
  // Total height of the scroll container in viewport units
  containerHeightVh: 1800,

  // The scroll threshold factor relative to window height
  thresholdFactor: 16.0,

  // Animation Phases (Event Points)
  phases: {
    // Event 1: Intro Title
    EVENT_TITLE: {
      start: 0,
      end: 0.1,
    },

    // Event 2: Historical Chart Race (Independent Section)
    EVENT_CHART_RACE: {
      start: 0.15,
      end: 0.5,
    },

    // Event 3: Body Model Appearance
    EVENT_MODEL_REVEAL: {
      start: 0.55,
      end: 0.7,
    },

    // Event 4: Interactive Model View
    EVENT_MODEL_INTERACT: {
      start: 0.7,
      end: 0.9,
    },

    // Event 5: Population Grid View
    EVENT_GRID_EXPAND: {
      start: 0.92,
      end: 1.0,
    },

    // Interaction trigger (synced with EVENT_MODEL_INTERACT)
    interactionStart: 0.7,
    interactionEnd: 0.9,
  },

  // Easing functions
  easing: {
    smoothOut: (t) => 1 - Math.pow(1 - t, 3), // Cubic out
    linear: (t) => t,
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  },
};

// Helper to normalize scroll progress to a specific phase range
export const getPhaseProgress = (globalProgress, phase) => {
  const { start, end } = phase;
  if (globalProgress < start) return 0;
  if (globalProgress > end) return 1;
  return (globalProgress - start) / (end - start);
};
