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
  { x: 85, y: 15, scale: 0.7, duration: 23 }
];

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  },
};

export const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}; 