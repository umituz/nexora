const ACCENT = "#4F8EF7";
const ACCENT_VIOLET = "#8B5CF6";
const ACCENT_CYAN = "#06B6D4";
const SUCCESS = "#10B981";
const WARNING = "#F59E0B";
const DANGER = "#EF4444";

export const Colors = {
  bg: "#080C18",
  bgCard: "#111827",
  bgSurface: "#1A2235",
  bgElevated: "#1E2A40",
  border: "#1F2D44",
  borderLight: "#253247",

  accent: ACCENT,
  accentViolet: ACCENT_VIOLET,
  accentCyan: ACCENT_CYAN,
  accentGlow: "rgba(79, 142, 247, 0.15)",
  accentVioletGlow: "rgba(139, 92, 246, 0.15)",

  text: "#F0F4FF",
  textSecondary: "#8A9BC0",
  textDim: "#4B5E7A",
  textAccent: ACCENT,

  success: SUCCESS,
  warning: WARNING,
  danger: DANGER,

  tabActive: ACCENT,
  tabInactive: "#4B5E7A",
};

export default {
  light: {
    text: Colors.text,
    background: Colors.bg,
    tint: Colors.accent,
    tabIconDefault: Colors.tabInactive,
    tabIconSelected: Colors.tabActive,
  },
};
