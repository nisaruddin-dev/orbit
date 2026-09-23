/**
 * @module design/tokens
 *
 * The single source of truth for every visual value in Orbit.
 *
 * Nothing in the app should hardcode a color, duration, easing,
 * or spatial value. Every value comes from here.
 *
 * Values are drawn from the UI/UX Design Document v3.0,
 * Appendix A (Master Design Token Set).
 */

/**
 * Environmental colors. The sky, floor, and background gradient.
 * These are the colors the world "lives in."
 */
export const ENVIRONMENT = {
  void: '#0E0F16',
  skyTop: '#1B1E2B',
  skyMid: '#2A2F45',
  skyLow: '#1E2233',
  floor: '#232738',
} as const;

/**
 * Accent colors. Each represents a semantic state.
 * Never use red.
 */
export const ACCENT = {
  active: '#7BD3EA',
  focus: '#9B8CFF',
  done: '#7FE7C4',
  urgent: '#F2A67E',
  dormant: '#5C6178',
} as const;

/**
 * Text colors.
 */
export const TEXT = {
  primary: '#E8EAF2',
  secondary: '#A2A8BD',
  muted: '#6B7088',
} as const;

/**
 * Glassmorphism for frosted panels.
 */
export const GLASS = {
  fill: 'rgba(232,234,242,0.06)',
  border: 'rgba(232,234,242,0.12)',
  highlight: 'rgba(232,234,242,0.20)',
} as const;

/**
 * Easing curves. Never use linear or default CSS eases.
 * Every motion in Orbit uses one of these.
 */
export const EASING = {
  cinematic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  dissolve: 'cubic-bezier(0.4, 0, 0.2, 1)',
  anticipate: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  breathe: 'cubic-bezier(0.45, 0, 0.55, 1)',
} as const;

/**
 * Durations. All in seconds for use with Three.js and Framer Motion.
 */
export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  cinematic: 1.2,
  epic: 1.6,
} as const;

/**
 * Spatial constants — sizes, radii, and distances in world units.
 */
export const SPATIAL = {
  coreRadius: 0.4,

  ringTodayRadius: 4,
  ringWeekRadius: 7,
  ringSomedayRadius: 10,
  auroraRadius: 15,

  nodeRadius: 0.3,
  nodeShellRadius: 0.36,
  nodeRingRadius: 0.45,

  floorY: -2,
  fogDensity: 0.04,
} as const;

/**
 * Camera positions for each of the four states.
 */
export const CAMERA = {
  orbit: { x: 0, y: 6, z: 12 },
  focus: { x: 0, y: 1, z: 2.5 },
  timeline: { x: 0, y: 1.5, z: 8 },
  aurora: { x: 0, y: 3, z: 20 },
  fov: 45,
} as const;

/**
 * Spring physics constants for animated elements.
 * Used with React Spring.
 */
export const SPRING = {
  hover: { stiffness: 300, damping: 20, mass: 1 },
  follow: { stiffness: 150, damping: 18, mass: 1 },
  return: { stiffness: 120, damping: 14, mass: 1.2 },
  camera: { stiffness: 60, damping: 20, mass: 1.5 },
  panel: { stiffness: 200, damping: 26, mass: 1 },
  rebalance: { stiffness: 80, damping: 16, mass: 1 },
} as const;

/**
 * Idle motion constants. Every element has a subtle "breath."
 */
export const IDLE = {
  coreBreathPeriod: 4,
  coreBreathMin: 0.9,
  coreBreathMax: 1.1,

  nodeBobAmplitude: 0.02,
  nodeBobPeriodMin: 3,
  nodeBobPeriodMax: 6,

  ringRotationToday: 0.08,
  ringRotationWeek: 0.05,
  ringRotationSomeday: 0.02,

  fogOscillationPeriod: 12,
  fogOscillationAmount: 0.05,

  auroraDriftPeriod: 20,
  auroraDriftAmount: 0.5,

  dustDriftPeriod: 30,
  dustDriftAmount: 0.3,

  cameraDriftAmplitude: 0.01,
  cameraDriftFrequency: 0.05,
} as const;

/**
 * Lighting constants — the four-light rig.
 * Never five. Never three. Always four.
 */
export const LIGHTING = {
  keyIntensity: 1.2,
  keyColor: '#FFE9D6',
  keyPosition: [-5, 8, 5] as const,

  fillIntensity: 0.4,
  fillColor: '#8AA0FF',

  rimIntensity: 0.8,
  rimColor: '#7BD3EA',
  rimPosition: [0, 2, -10] as const,

  ambientIntensity: 0.15,
  ambientColor: '#2A2F45',

  toneMappingExposure: 1.1,
} as const;

/**
 * Particle counts.
 */
export const PARTICLES = {
  ambientDust: 200,
  dissolveCount: 240,
  reducedMotionDust: 50,
} as const;
