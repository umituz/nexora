/**
 * Centralized chart theme configuration.
 * Uses CSS custom properties so charts adapt to light/dark mode.
 */

import type { CSSProperties } from "react";

function hslString(varName: string): string {
  return `hsl(var(${varName}))`;
}

export const CHART_COLORS = {
  primary: hslString("--chart-emerald"),
  blue: hslString("--chart-blue"),
  amber: hslString("--chart-amber"),
  red: hslString("--chart-red"),
  purple: hslString("--chart-purple"),
  palette: [
    hslString("--chart-emerald"),
    hslString("--chart-blue"),
    hslString("--chart-amber"),
    hslString("--chart-red"),
    hslString("--chart-purple"),
  ],
} as const;

export const CHART_GRID_COLOR = hslString("--chart-grid");
export const CHART_AXIS_COLOR = hslString("--chart-axis");

export const CHART_TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: hslString("--chart-tooltip-bg"),
  border: `1px solid ${hslString("--chart-tooltip-border")}`,
  borderRadius: "8px",
  fontSize: 12,
};

export const CHART_AXIS_TICK = { fontSize: 11 };

export function dateTickFormatter(value: string): string {
  return value.slice(5);
}
