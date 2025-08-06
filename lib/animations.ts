export const particles = [
  { x: 20, y: 80, scale: 0.6, duration: 25 },
  { x: 80, y: 20, scale: 0.8, duration: 28 },
  { x: 40, y: 60, scale: 0.7, duration: 22 },
  { x: 60, y: 40, scale: 0.9, duration: 24 },
  { x: 10, y: 30, scale: 0.5, duration: 26 },
  { x: 90, y: 70, scale: 0.7, duration: 23 },
  { x: 30, y: 90, scale: 0.8, duration: 27 },
  { x: 70, y: 50, scale: 0.6, duration: 29 },
  { x: 50, y: 10, scale: 0.9, duration: 21 },
  { x: 25, y: 75, scale: 0.7, duration: 25 },
  { x: 75, y: 25, scale: 0.8, duration: 28 },
  { x: 35, y: 65, scale: 0.6, duration: 22 },
  { x: 65, y: 35, scale: 0.9, duration: 24 },
  { x: 15, y: 85, scale: 0.5, duration: 26 },
  { x: 85, y: 15, scale: 0.7, duration: 23 },
];

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: 'easeInOut' as const,
  },
};

export const hoverLift = {
  y: -5,
  transition: {
    duration: 0.2,
    ease: 'easeInOut' as const,
  },
};

export const hoverGlow = {
  boxShadow: '0 10px 30px rgba(255, 165, 0, 0.3)',
  transition: {
    duration: 0.3,
    ease: 'easeInOut' as const,
  },
};

// Text animations
export const textReveal = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut' as const,
    },
  },
};

export const typewriter = {
  hidden: { width: 0 },
  show: {
    width: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut' as const,
    },
  },
};
