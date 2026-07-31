import type { ColumnTheme } from "../../Column/models/Column";

export const THEME_COLOR_MAP: Record<
  ColumnTheme | string,
  { main: string; label: string }
> = {
  blue: { main: "#3b82f6", label: "כחול" },
  red: { main: "#ef4444", label: "אדום" },
  green: { main: "#22c55e", label: "ירוק" },
  yellow: { main: "#eab308", label: "צהוב" },
  purple: { main: "#a855f7", label: "סגול" },
  gray: { main: "#64748b", label: "אפור" },
  cyan: { main: "#06b6d4", label: "ציאן" },
  pink: { main: "#ec4899", label: "ורוד" },
  orange: { main: "#f97316", label: "כתום" },
  indigo: { main: "#6366f1", label: "אינדיגו" },
  teal: { main: "#14b8a6", label: "טיאל" },
};
