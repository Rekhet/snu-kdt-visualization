// Centralized configuration for Scroll-based Animations

export const SCROLL_CONFIG = {
  // Total height of the scroll container in viewport units
  containerHeightVh: 2500,
  
  // The scroll threshold factor relative to window height
  thresholdFactor: 16.0, 

  // Animation Phases (Event Points)
  phases: {
    // Event 1: Intro Title
    EVENT_TITLE: {
      start: 0,
      end: 0.05, 
    },

    // Event 2: Intro Video Section
    // Starts immediately after title to prevent "dead zone"
    EVENT_VIDEO_INTRO: {
      start: 0.05,
      end: 0.28,
    },
    
    // Event 3: Historical Chart Race (Independent Section)
    EVENT_CHART_RACE: {
      start: 0.3,
      end: 0.6,
    },

    // Event 4: Body Model Appearance
    EVENT_MODEL_REVEAL: {
      start: 0.62,
      end: 0.75,
    },

    // Event 5: Interactive Model View
    EVENT_MODEL_INTERACT: {
      start: 0.75,
      end: 0.9,
    },

    // Event 6: Population Grid View
    EVENT_GRID_EXPAND: {
      start: 0.92,
      end: 1.0,
    },
    
    // Interaction trigger (synced with EVENT_MODEL_INTERACT)
    interactionStart: 0.75,
    interactionEnd: 0.9,
  },

  // Easing functions
  easing: {
    smoothOut: (t) => 1 - Math.pow(1 - t, 3), // Cubic out
    linear: (t) => t,
    easeInOut: (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  }
};

// Helper to normalize scroll progress to a specific phase range
export const getPhaseProgress = (globalProgress, phase) => {
  const { start, end } = phase;
  if (globalProgress < start) return 0;
  if (globalProgress > end) return 1;
  return (globalProgress - start) / (end - start);
};