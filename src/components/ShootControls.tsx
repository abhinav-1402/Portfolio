// ShootControls.tsx – HUD panel for penalty shot customisation
import React from "react";

export type HeightOption = "low" | "mid" | "top";
export type DirectionOption = "left" | "centre" | "right";

interface ShootControlsProps {
  dark: boolean;
  power: number;
  height: HeightOption;
  direction: DirectionOption;
  onPowerChange: (v: number) => void;
  onHeightChange: (v: HeightOption) => void;
  onDirectionChange: (v: DirectionOption) => void;
}

// ── Helper: segmented button group ───────────────────────────────────────────
function SegGroup<T extends string>({
  options,
  value,
  onChange,
  mono,
  accent,
  border,
  muted,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  mono: string;
  accent: string;
  border: string;
  muted: string;
}) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              fontFamily: mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "7px 0",
              cursor: "pointer",
              border: `1px solid ${active ? accent : border}`,
              background: active ? `rgba(8,203,0,0.18)` : "transparent",
              color: active ? accent : muted,
              clipPath: "polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)",
              transition: "all .18s",
            }}
            onMouseOver={(e) => {
              if (!active) e.currentTarget.style.borderColor = accent;
            }}
            onMouseOut={(e) => {
              if (!active) e.currentTarget.style.borderColor = border;
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function ShootControls({
  dark,
  power,
  height,
  direction,
  onPowerChange,
  onHeightChange,
  onDirectionChange,
}: ShootControlsProps) {
  const mono = "'JetBrains Mono', monospace";
  const accent = "#08CB00";
  const border = dark ? "rgba(8,203,0,0.2)" : "rgba(37,57,0,0.2)";
  const muted = dark ? "#666" : "#888";
  const bg = dark ? "rgba(0,0,0,0.78)" : "rgba(238,238,238,0.82)";

  const [isMobile, setIsMobile] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(
    () => window.innerWidth < 1024,
  );

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        style={{
          position: "absolute",
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 200,
          fontFamily: mono,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "8px 16px",
          background: "rgba(8,203,0,0.12)",
          color: accent,
          border: `1px solid ${border}`,
          backdropFilter: "blur(14px)",
          clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
          cursor: "pointer",
          pointerEvents: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: "all .2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = accent)}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = border)}
      >
        Config ⚙️
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        zIndex: 200,
        width: 240,
        background: bg,
        border: `1px solid ${border}`,
        backdropFilter: "blur(14px)",
        padding: "16px 18px 18px",
        clipPath:
          "polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)",
        pointerEvents: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: mono,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 7,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accent,
              display: "inline-block",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
          Shot settings
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          style={{
            background: "none",
            border: "none",
            color: accent,
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: "0.12em",
            cursor: "pointer",
            padding: "2px 6px",
            borderBottom: `1px solid ${accent}`,
            textTransform: "uppercase",
          }}
        >
          [Close]
        </button>
      </div>

      {/* ── Power slider ────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: muted,
            marginBottom: 7,
          }}
        >
          <span>Power</span>
          <span style={{ color: accent }}>{power}</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={power}
          onChange={(e) => onPowerChange(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: accent,
            cursor: "pointer",
            height: 4,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: mono,
            fontSize: 8,
            color: muted,
            marginTop: 4,
          }}
        >
          <span>tap</span>
          <span>power</span>
          <span>rocket</span>
        </div>
      </div>

      {/* ── Height ─────────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: muted,
            marginBottom: 7,
          }}
        >
          Height
        </div>
        <SegGroup<HeightOption>
          options={[
            { label: "Low", value: "low" },
            { label: "Mid", value: "mid" },
            { label: "Top", value: "top" },
          ]}
          value={height}
          onChange={onHeightChange}
          mono={mono}
          accent={accent}
          border={border}
          muted={muted}
        />
      </div>

      {/* ── Direction ──────────────────────────────────── */}
      <div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: muted,
            marginBottom: 7,
          }}
        >
          Direction
        </div>
        <SegGroup<DirectionOption>
          options={[
            { label: "← Left", value: "left" },
            { label: "Centre", value: "centre" },
            { label: "Right →", value: "right" },
          ]}
          value={direction}
          onChange={onDirectionChange}
          mono={mono}
          accent={accent}
          border={border}
          muted={muted}
        />
      </div>

      {/* Tip */}
      <div
        style={{
          marginTop: 14,
          fontFamily: mono,
          fontSize: 8,
          letterSpacing: "0.1em",
          color: muted,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        click the ball to shoot
      </div>
    </div>
  );
}
