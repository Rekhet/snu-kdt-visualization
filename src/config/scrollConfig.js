// Centralized configuration for Scroll-based Animations

export const SCROLL_CONFIG = {
  // Total height of the scroll container in viewport units
  // Increased to accommodate the new Chart Race phase
  containerHeightVh: 600,
  
  // The scroll threshold factor relative to window height
  thresholdFactor: 5.0, 

  // Animation Phases (values are normalized 0 to 1 of the scroll progress)
  phases: {
    // Phase 1: Title Fade Out
    title: {
      start: 0,
      end: 0.1, 
    },
    
    // Phase 2: Single Model Reveal (Scale 0 -> 1)
    modelReveal: {
      start: 0.1,
      end: 0.25,
    },

    // Phase 3: Single Model Interactive (Locked/Paused zone)
    singleView: {
      start: 0.25,
      end: 0.5,
    },

    // Phase 4: Chart Race (Yearly Cancer Data)
    chartRace: {
      start: 0.5,
      end: 0.75,
    },

    // Phase 5: Grid Expansion
    gridReveal: {
      start: 0.75,
      end: 1.0,
    },
    
    // Interaction trigger (for single model)
    interactionStart: 0.25,
    interactionEnd: 0.5,
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