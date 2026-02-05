// Centralized configuration for Scroll-based Animations

export const SCROLL_CONFIG = {
  // Total height of the scroll container in viewport units
  // Increased to accommodate the new Grid phase
  containerHeightVh: 450,
  
  // The scroll threshold factor relative to window height
  thresholdFactor: 3.5, 

  // Animation Phases (values are normalized 0 to 1 of the scroll progress)
  phases: {
    // Phase 1: Title Fade Out
    title: {
      start: 0,
      end: 0.15, 
    },
    
    // Phase 2: Single Model Reveal (Scale 0 -> 1)
    modelReveal: {
      start: 0.20,
      end: 0.40,
    },

    // Phase 3: Single Model Interactive (Locked/Paused zone)
    // The user 'scrubs' through this zone, but visually it stays 'locked' 
    // until they push past it.
    singleView: {
      start: 0.40,
      end: 0.65,
    },

    // Phase 4: Grid Expansion (Single Model shrinks, 99 others appear)
    gridReveal: {
      start: 0.70,
      end: 0.95,
    },
    
    // Interaction trigger (for single model)
    // Active mostly during the 'singleView' phase
    interactionStart: 0.40,
    interactionEnd: 0.65,
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