import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import Portfolio from "./Portfolio";
import PenaltyShootout from "../scenes/PenaltyShootout";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useTheme } from "../context/ThemeContext";
import type {
  HeightOption,
  DirectionOption,
} from "../components/ShootControls";

/** Forward wheel + touch-scroll events from the canvas to the page so the
 *  user can scroll normally, while taps (touchstart+end, no move) still
 *  reach R3F's raycaster so the ball click works. */
function useCanvasScrollForward(
  containerRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    // ── Desktop: forward wheel events to page scroll ────────────────────
    const onWheel = (e: WheelEvent) => {
      window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: "auto" });
    };
    canvas.addEventListener("wheel", onWheel, { passive: true });

    let lastY = 0;
    let lastX = 0;

    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = lastY - e.touches[0].clientY;
      const dx = lastX - e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
      window.scrollBy({ top: dy, left: dx, behavior: "auto" });
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }); // no deps — re-runs after each render to pick up the canvas after R3F mounts it
}

function Loader({ dark }: { dark: boolean }) {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1, // ← absolute, z-1 (above canvas z-0, below UI z-10)
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: dark ? "#000000" : "#EEEEEE",
        color: dark ? "#EEEEEE" : "#000000",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1.5px solid rgba(128,128,128,0.2)",
          borderTopColor: "currentColor",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          opacity: 0.45,
        }}
      >
        {Math.round(progress)}%
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Main() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const canvasWrapRef = useRef<HTMLDivElement>(null);
  useCanvasScrollForward(canvasWrapRef);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [goals, setGoals] = useState(0);
  const [shots, setShots] = useState(0);
  const [showGoalFlash, setShowGoalFlash] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const hasScoredThisShot = useRef(false);

  const [power, setPower] = useState<number>(3);
  const [height, setHeight] = useState<HeightOption>("mid");
  const [direction, setDirection] = useState<DirectionOption>("centre");

  const handleGoal = () => {
    if (hasScoredThisShot.current) return;
    hasScoredThisShot.current = true;
    setGoals((g) => g + 1);
    setShowGoalFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setShowGoalFlash(false), 2200);
  };

  const handleShoot = () => {
    hasScoredThisShot.current = false;
    setShots((s) => s + 1);
  };

  const handleReset = () => {
    setGameKey((k) => k + 1);
    setShots(0);
    setGoals(0);
    hasScoredThisShot.current = false;
  };

  return (
    <div
      className="w-screen relative transition-colors duration-500"
      style={{
        background: dark ? "#000000" : "#EEEEEE",
        color: dark ? "#EEEEEE" : "#000000",
      }}
    >
      {/* Loader — outside Canvas, disappears when 3D assets are ready */}
      <Loader dark={dark} />

      {/* UI — normal document flow, z-10, pointer-events:none by default.
           Interactive children (nav, buttons, ShootControls) re-enable pointer-events:auto.
           The 3D ball area in the hero right column stays pointer-events:none so
           clicks fall through to the canvas (z-20) below in the visual stack
           but above in pointer-hit priority via the fixed positioning. */}
      <div className="relative z-10 pointer-events-none">
        <Portfolio
          onShoot={handleShoot}
          power={power}
          height={height}
          direction={direction}
          onPowerChange={setPower}
          onHeightChange={setHeight}
          onDirectionChange={setDirection}
          onReset={handleReset}
        />
      </div>

      {/* 3D Canvas — position:fixed keeps it visible while the page scrolls.
           touch-action:none + useCanvasScrollForward: we manually handle
           wheel & touchmove → window.scrollBy so the page scrolls, while
           taps (touchstart+end without move) still reach R3F for ball clicks. */}
      <div ref={canvasWrapRef} className="fixed inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 7], fov: 52 }}
          gl={{ alpha: true }}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            touchAction: "none",
          }}
        >
          <Suspense fallback={null}>
            <PenaltyShootout
              key={gameKey}
              onGoal={handleGoal}
              onShoot={handleShoot}
              power={power}
              height={height}
              direction={direction}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD */}
      <>
        <div
          style={{
            position: "fixed",
            top: isMobile ? 76 : 64,
            right: isMobile ? 12 : 24,
            zIndex: 50,
            fontFamily: "'Barlow Condensed', sans-serif",
            background: dark ? "rgba(0,0,0,0.72)" : "rgba(238,238,238,0.82)",
            border: "1px solid rgba(8,203,0,0.3)",
            backdropFilter: "blur(10px)",
            padding: isMobile ? "6px 14px" : "8px 18px",
            lineHeight: 1,
            color: dark ? "#EEEEEE" : "#000",
            pointerEvents: "none",
            clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              fontSize: isMobile ? 8 : 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#08CB00",
              display: "block",
              marginBottom: 4,
            }}
          >
            Goals scored
          </span>
          <span
            style={{
              fontSize: isMobile ? 24 : 32,
              fontWeight: 900,
              color: "#08CB00",
            }}
          >
            {goals}
          </span>
          <span
            style={{
              fontSize: isMobile ? 12 : 14,
              color: dark ? "#666" : "#888",
              marginLeft: 4,
            }}
          >
            / {shots}
          </span>
        </div>

        {showGoalFlash && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              animation: "goalFlash 2.2s ease forwards",
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "clamp(72px, 14vw, 60px)",
                fontWeight: 900,
                fontStyle: "italic",
                textTransform: "uppercase",
                color: "#08CB00",
                textShadow: "0 0 60px rgba(8,203,0,0.6)",
                letterSpacing: "-0.02em",
              }}
            >
              GOAL! ⚽
            </span>
          </div>
        )}

        <style>{`
          @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes goalFlash { 0%{opacity:0;transform:scale(.6)} 20%{opacity:1;transform:scale(1.08)} 70%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.05)} }
        `}</style>
      </>
    </div>
  );
}

export default Main;
