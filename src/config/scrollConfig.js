// Centralized configuration for Scroll-based Animations

export const SCROLL_CONFIG = {
  // Total height of the scroll container in viewport units
  containerHeightVh: 800,
  
  // The scroll threshold factor relative to window height
  // Higher value means slower scroll-driven animations
  thresholdFactor: 8.0, 

  // Animation Phases (Event Points)
  phases: {
    // Event 1: Intro Title
    EVENT_TITLE: {
      start: 0,
      end: 0.08, 
    },
    
    // Event 2: Historical Chart Race (Independent Section)
    // Range increased from 0.3 to 0.4 to slow down the race speed
    EVENT_CHART_RACE: {
      start: 0.12,
      end: 0.52,
    },

    // Event 3: Body Model Appearance
    EVENT_MODEL_REVEAL: {
      start: 0.58,
      end: 0.73,
    },

    // Event 4: Interactive Model View
    EVENT_MODEL_INTERACT: {
      start: 0.73,
      end: 0.88,
    },

    // Event 5: Population Grid View
    EVENT_GRID_EXPAND: {
      start: 0.93,
      end: 1.0,
    },
    
    // Interaction trigger (synced with EVENT_MODEL_INTERACT)
    interactionStart: 0.73,
    interactionEnd: 0.88,
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