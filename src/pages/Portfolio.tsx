// Portfolio.tsx — Abhinav Premkumar
// Replace YOUR_GITHUB and YOUR_LINKEDIN with your actual handles
// Color palette: #08CB00 / #253900 / #000000 / #EEEEEE

import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { SectionHeader } from "../components/SectionHeader";
import ShootControls from "../components/ShootControls";
import type {
  HeightOption,
  DirectionOption,
} from "../components/ShootControls";
import { useForm, ValidationError } from "@formspree/react";

// ─── DATA — Edit freely to add projects, skills, etc. ────────────────────────

const SKILLS = {
  Frontend: [
    "React",
    "JavaScript",
    "TypeScript",
    "Three.js / R3F",
    "Tailwind CSS",
    "Material UI",
    "Module Federation",
  ],
  Backend: ["Node.js", "Express", "Prisma ORM", "REST APIs"],
  "Tools & DB": ["Git & GitHub", "PostgreSQL", "DBeaver", "Vite", "VS Code"],
};

const PROJECTS = [
  {
    id: 1,
    featured: true,
    title: "3D Portfolio",
    tags: ["React", "Three.js", "R3F", "GLTF", "Tailwind"],
    desc: "The very site you are looking at. A personal portfolio built with React and Three.js featuring a GLTF football, micro-animated sections, and a scalable component architecture designed to grow with every project I ship.",
    live: "#",
    github: "#",
    label: "FOLIO",
  },
  {
    id: 2,
    featured: false,
    title: "Let's Talk",
    tags: ["Ideas", "Startups", "Collaboration"],
    desc: "Have a project in mind? I'd love to hear about it and explore how we can bring it to life.",
    github: "#",
    label: "CONTACT",
  },
  {
    id: 3,
    featured: false,
    title: "Your Project Here",
    tags: ["React", "Full Stack", "Available"],
    desc: "The next card could be your project. Let's build something fast, clean, and impactful.",
    github: "#",
    label: "OPEN",
  },
];

const CONTACT = {
  email: "abhinavpremkumar40@gmail.com",
  // github: "https://github.com/YOUR_GITHUB",
  linkedin: "https://www.linkedin.com/in/abhinav-premkumar-138036245/",
  location: "Chennai, India",
};

// ─────────────────────────────────────────────────────────────────────────────

interface PortfolioProps {
  onShoot?: () => void;
  power: number;
  height: HeightOption;
  direction: DirectionOption;
  onPowerChange: (v: number) => void;
  onHeightChange: (v: HeightOption) => void;
  onDirectionChange: (v: DirectionOption) => void;
  onReset: () => void;
}

export default function Portfolio({
  power,
  height,
  direction,
  onPowerChange,
  onHeightChange,
  onDirectionChange,
  onReset,
}: PortfolioProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [fsState, fsHandleSubmit] = useForm("xaqkkvro");

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inject Google Fonts once
  useEffect(() => {
    if (document.getElementById("portfolio-fonts")) return;
    const link = document.createElement("link");
    link.id = "portfolio-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=JetBrains+Mono:wght@400;500&family=Barlow:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  // ── Design tokens ──────────────────────────────────────────────────────────
  const t = {
    bg: dark ? "#000000" : "#EEEEEE",
    surface: dark ? "#0a0a0a" : "#f4f4f4",
    surface2: dark ? "#111111" : "#e6e6e6",
    text: dark ? "#EEEEEE" : "#000000",
    muted: dark ? "#777777" : "#505050",
    accent: dark ? "#08CB00" : "#253900",
    accentRgb: dark ? "8,203,0" : "37,57,0",
    border: dark ? "rgba(8,203,0,0.13)" : "rgba(37,57,0,0.14)",
    pillBg: dark ? "rgba(8,203,0,0.07)" : "rgba(37,57,0,0.07)",
    tagBg: dark ? "rgba(8,203,0,0.11)" : "rgba(37,57,0,0.09)",
    formBg: dark ? "#0d0d0d" : "#e0e0e0",
    gridLine: dark ? "rgba(8,203,0,0.035)" : "rgba(37,57,0,0.055)",
    gradBanner: dark
      ? "linear-gradient(135deg,#253900 0%,#0a0a0a 100%)"
      : "linear-gradient(135deg,#c8e6b0 0%,#e6e6e6 100%)",
  };

  const mono = "'JetBrains Mono', monospace";
  const cond = "'Barlow Condensed', sans-serif";
  const sans = "'Barlow', sans-serif";

  // ── Section header component ───────────────────────────────────────────────

  // ── Shared hover helpers ───────────────────────────────────────────────────
  const pillOver = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.style.color = t.accent;
    e.currentTarget.style.borderColor = t.accent;
    e.currentTarget.style.background = t.pillBg;
  };
  const pillOut = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.style.color = t.muted;
    e.currentTarget.style.borderColor = t.border;
    e.currentTarget.style.background = "transparent";
  };
  const cardOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = `rgba(${t.accentRgb},0.45)`;
    e.currentTarget.style.transform = "translateY(-3px)";
  };
  const cardOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = t.border;
    e.currentTarget.style.transform = "translateY(0)";
  };

  // Formspree handles submission state via fsState

  return (
    <div
      style={{
        fontFamily: sans,
        color: t.text,
        transition: "color 0.4s",
        overflowX: "hidden",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      {/* Global keyframes & resets */}
      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:.22} 50%{opacity:1} }
        @keyframes blink       { 0%,100%{opacity:1}  50%{opacity:0} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .ap-link:hover   { color:${t.accent} !important; }
        .ap-ghost:hover  { color:${t.accent} !important; border-color:${t.accent} !important; }
        .ap-crow:hover   { color:${t.accent} !important; }
        .ap-crow:hover .ap-cicon { border-color:${t.accent} !important; }
        input::placeholder, textarea::placeholder { color:${dark ? "#444" : "#aaa"}; }
        input:focus, textarea:focus { outline:none; border-color:${t.accent} !important; }
      `}</style>

      {/* ══ NAV ════════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "13px 20px" : "13px 32px",
          background: dark ? "rgba(0,0,0,0.75)" : "rgba(238,238,238,0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${t.border}`,
          transition: "background .4s",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            fontFamily: cond,
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: "0.08em",
            color: t.accent,
            textTransform: "uppercase",
          }}
        >
          AP
        </span>
        {!isMobile ? (
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Projects", "#projects"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="ap-link"
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "0.13em",
                  textDecoration: "none",
                  color: t.muted,
                  textTransform: "uppercase",
                  transition: "color .2s",
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              style={{
                fontFamily: cond,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "7px 20px",
                background: t.accent,
                color: "#000",
                textDecoration: "none",
                clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
                transition: "opacity .2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = ".8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Hire Me
            </a>
          </div>
        ) : (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              color: t.text,
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: "0.15em",
              cursor: "pointer",
              padding: "6px 12px",
              border: `1px solid ${t.border}`,
              clipPath: "polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)",
              transition: "all .2s",
              zIndex: 110,
            }}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100vh",
            width: "100vw",
            background: dark ? "rgba(0,0,0,0.96)" : "rgba(238,238,238,0.97)",
            backdropFilter: "blur(16px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            pointerEvents: "auto",
            animation: "fadeUp .3s ease both",
          }}
        >
          {[
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Projects", "#projects"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: cond,
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textDecoration: "none",
                color: t.text,
                textTransform: "uppercase",
                transition: "color .2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = t.accent)}
              onMouseOut={(e) => (e.currentTarget.style.color = t.text)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: cond,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "10px 30px",
              background: t.accent,
              color: "#000",
              textDecoration: "none",
              clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
              marginTop: 12,
            }}
          >
            Hire Me
          </a>
        </div>
      )}

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          alignItems: "center",
          padding: isMobile ? "80px 0 40px" : "100px 0 80px",
          position: "relative",
          overflow: "hidden",
          /* Hero bg is transparent so the 3D canvas shows through on the right */
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        {/* Grid overlay – only left half so it doesn't cover the 3D side */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
            backgroundSize: "56px 56px",
            /* Fade out towards the right so the pitch has breathing room */
            maskImage: isMobile
              ? "linear-gradient(to bottom, black 50%, transparent 80%)"
              : "linear-gradient(to right, black 45%, transparent 70%)",
            WebkitMaskImage: isMobile
              ? "linear-gradient(to bottom, black 50%, transparent 80%)"
              : "linear-gradient(to right, black 45%, transparent 70%)",
          }}
        />

        {/* ── LEFT COLUMN — text content ───────────────────────────────── */}
        <div
          style={{
            padding: isMobile ? "40px 20px 20px 20px" : "0 40px 0 40px",
            zIndex: 2,
            /* none here so clicks pass through to the fixed 3D canvas below.
               Interactive children (CTAs) re-enable pointer-events:auto. */
            pointerEvents: "none",
          }}
        >
          {/* Left panel bg so text is readable over the transparent hero */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: isMobile ? "360px" : 0,
              width: isMobile ? "100%" : "52%",
              background: isMobile
                ? dark
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.96) 80%, transparent 100%)"
                  : "linear-gradient(to bottom, rgba(238,238,238,0.96) 80%, transparent 100%)"
                : dark
                  ? "linear-gradient(to right, rgba(0,0,0,0.95) 70%, transparent 100%)"
                  : "linear-gradient(to right, rgba(238,238,238,0.95) 70%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Available badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 26,
                width: "fit-content",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: t.accent,
                  display: "inline-block",
                  animation: "blink 2.2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: t.accent,
                  textTransform: "uppercase",
                }}
              >
                Available for opportunities
              </span>
            </div>

            {/* Name */}
            <h1
              style={{
                fontFamily: cond,
                fontWeight: 900,
                fontSize: isMobile
                  ? "clamp(44px, 11vw, 68px)"
                  : "clamp(52px, 8vw, 110px)",
                lineHeight: 0.88,
                textTransform: "uppercase",
                color: t.text,
                letterSpacing: "-0.02em",
                margin: 0,
                animation: "fadeUp .65s ease both",
              }}
            >
              ABHINAV
              <br />
              <span style={{ color: t.accent, fontStyle: "italic" }}>
                PREMKUMAR
              </span>
            </h1>

            {/* Role strip */}
            <div
              style={{
                marginTop: 22,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                animation: "fadeUp .65s .14s ease both",
              }}
            >
              <div style={{ width: 32, height: 2, background: t.accent }} />
              <span
                style={{
                  fontFamily: cond,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: t.muted,
                }}
              >
                React Developer
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: t.muted,
                  opacity: 0.5,
                }}
              >
                ·
              </span>
              <span
                style={{
                  fontFamily: cond,
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: t.muted,
                }}
              >
                Chennai, India
              </span>
            </div>

            {/* Tagline */}
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.85,
                color: t.muted,
                fontWeight: 300,
                margin: "32px 0 28px",
                maxWidth: 400,
                animation: "fadeUp .65s .22s ease both",
              }}
            >
              I enjoy turning complex problems into clean, intuitive interfaces,
              focusing on building products that are both{" "}
              <span style={{ color: t.accent, fontWeight: 500 }}>
                functional
              </span>{" "}
              and{" "}
              <span style={{ color: t.accent, fontWeight: 500 }}>
                thoughtfully designed.
              </span>
              .
            </p>

            {/* CTAs — re-enable pointer events so the links are clickable */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                animation: "fadeUp .65s .3s ease both",
                pointerEvents: "auto",
              }}
            >
              <a
                href="#projects"
                style={{
                  fontFamily: cond,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "12px 30px",
                  background: t.accent,
                  color: "#000",
                  textDecoration: "none",
                  clipPath:
                    "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)",
                  display: "inline-block",
                  transition: "opacity .2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = ".82")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                View Projects
              </a>
              <a
                href="/Abhinav-CV.pdf"
                download
                className="ap-ghost"
                style={{
                  fontFamily: cond,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "12px 30px",
                  background: "transparent",
                  color: t.text,
                  border: `1px solid ${t.border}`,
                  clipPath:
                    "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all .2s",
                }}
              >
                Download CV
              </a>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: isMobile ? 24 : 36,
                marginTop: 44,
                animation: "fadeUp .65s .38s ease both",
              }}
            >
              {[
                ["1+", "Yr Exp"],
                ["3+", "Projects"],
                ["∞", "Commits"],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: cond,
                      fontWeight: 900,
                      fontSize: isMobile ? 32 : 40,
                      color: t.accent,
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: t.muted,
                      marginTop: 4,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — 3D game zone (transparent, pointer-events pass-through) */}
        <div
          style={{
            position: "relative",
            height: isMobile ? "360px" : "100%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {/* Subtle label at top of the game zone */}
          <div
            style={{
              position: "absolute",
              top: isMobile ? 12 : 24,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: mono,
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: t.accent,
              pointerEvents: "none",
            }}
          >
            Click to shoot{" "}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 16 : 32,
            left: isMobile ? 20 : 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 32 : 52,
              height: 1,
              background: `linear-gradient(to right,${t.accent},transparent)`,
              animation: "scrollPulse 2.2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: mono,
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: t.muted,
            }}
          >
            scroll
          </span>
        </div>

        {/* Reset Game Button — stays in the ground play area */}
        <button
          onClick={onReset}
          style={{
            position: "absolute",
            bottom: isMobile ? 16 : 32,
            left: isMobile ? 16 : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            zIndex: 10,
            fontFamily: mono,
            fontSize: isMobile ? 9 : 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: isMobile ? "7px 16px" : "9px 24px",
            background: "rgba(8,203,0,0.12)",
            color: "#08CB00",
            border: "1px solid rgba(8,203,0,0.3)",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
            transition: "all .2s",
            pointerEvents: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(8,203,0,0.22)";
            e.currentTarget.style.borderColor = "#08CB00";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(8,203,0,0.12)";
            e.currentTarget.style.borderColor = "rgba(8,203,0,0.3)";
          }}
        >
          Reset Game ↺
        </button>

        {/* Shoot Controls Panel — stays in the ground play area */}
        <div style={{ pointerEvents: "auto" }}>
          <ShootControls
            dark={dark}
            power={power}
            height={height}
            direction={direction}
            onPowerChange={onPowerChange}
            onHeightChange={onHeightChange}
            onDirectionChange={onDirectionChange}
          />
        </div>

        {/* Diagonal cut into About */}
        <div
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            height: isMobile ? 36 : 68,
            background: t.surface,
            clipPath: "polygon(0 100%,100% 0,100% 100%)",
            zIndex: 3,
          }}
        />
      </section>

      {/* ══ ABOUT ══════════════════════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          padding: isMobile ? "60px 20px" : "86px 40px",
          background: t.surface,
          pointerEvents: "auto",
        }}
      >
        <SectionHeader num="01" title="About" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: t.muted,
                fontWeight: 300,
                margin: 0,
              }}
            >
              Hey I'm{" "}
              <strong style={{ color: t.text, fontWeight: 600 }}>
                Abhinav Premkumar
              </strong>
              , a React developer based in{" "}
              <strong style={{ color: t.accent, fontWeight: 500 }}>
                Chennai, India
              </strong>
              . I've spent the past year building real-world applications from
              micro-frontend architectures to 3D web experiences picking up new
              tools fast and shipping clean, maintainable code.
              <br />
              <br />I care about the craft on both ends: a well-structured API
              and an interface that feels effortless to use. I'm actively
              looking for opportunities where I can{" "}
              <strong style={{ color: t.accent, fontWeight: 500 }}>
                grow fast and contribute from day one
              </strong>
              .
            </p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {[
                "📍 Chennai, India",
                "🗓 1 yr experience",
                "💼 Open to work",
              ].map((text) => (
                <span
                  key={text}
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    padding: "6px 13px",
                    border: `1px solid ${t.border}`,
                    color: t.muted,
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal card */}
          <div
            style={{
              background: t.surface2,
              border: `1px solid ${t.border}`,
              padding: "24px 28px",
              position: "relative",
              overflow: "hidden",
              fontFamily: mono,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg,${t.accent},transparent)`,
              }}
            />
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: t.accent,
                marginBottom: 22,
              }}
            >
              // Current Status
            </p>
            {(
              [
                ["role", '"React Developer"', false],
                ["location", '"Chennai, India"', false],
                ["experience", '"1 year"', true],
                ["stack", '"React · Node · 3JS"', false],
                ["learning", '"always"', true],
                ["status", '"open to work 🟢"', true],
              ] as [string, string, boolean][]
            ).map(([k, v, green]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: `1px solid ${t.border}`,
                  fontSize: 12,
                }}
              >
                <span style={{ color: t.muted }}>"{k}":</span>
                <span
                  style={{
                    color: green ? t.accent : dark ? "#9cdcfe" : "#253900",
                    fontWeight: 500,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS ═════════════════════════════════════════════════════════ */}
      <section
        id="skills"
        style={{
          padding: isMobile ? "60px 20px" : "86px 40px",
          background: t.surface2,
          pointerEvents: "auto",
        }}
      >
        <SectionHeader num="02" title="Skills" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {Object.entries(SKILLS).map(([cat, pills]) => (
            <div
              key={cat}
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                padding: "24px 24px 28px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  left: 0,
                  width: 3,
                  height: 20,
                  background: t.accent,
                }}
              />
              <p
                style={{
                  fontFamily: cond,
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: t.accent,
                  marginBottom: 18,
                  paddingLeft: 14,
                }}
              >
                {cat}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {pills.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      letterSpacing: "0.04em",
                      padding: "5px 11px",
                      border: `1px solid ${t.border}`,
                      color: t.muted,
                      background: "transparent",
                      cursor: "default",
                      transition: "all .2s",
                    }}
                    onMouseOver={pillOver}
                    onMouseOut={pillOut}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PROJECTS ═══════════════════════════════════════════════════════ */}
      <section
        id="projects"
        style={{
          padding: isMobile ? "60px 20px" : "86px 40px",
          background: t.surface,
          pointerEvents: "auto",
        }}
      >
        <SectionHeader num="03" title="Projects" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 22,
          }}
        >
          {PROJECTS.map((proj) => (
            <div
              key={proj.id}
              style={{
                border: `1px solid ${t.border}`,
                background: t.surface2,
                overflow: "hidden",
                position: "relative",
                transition: "border-color .22s, transform .22s",
                ...(proj.featured
                  ? {
                      gridColumn: isMobile ? "span 1" : "1 / -1",
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fit,minmax(260px,1fr))",
                    }
                  : {}),
              }}
              onMouseOver={cardOver}
              onMouseOut={cardOut}
            >
              {/* Banner */}
              <div
                style={{
                  height: proj.featured && !isMobile ? "100%" : 148,
                  minHeight: proj.featured && !isMobile ? 210 : 148,
                  background: t.gradBanner,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: cond,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: proj.featured ? 88 : 56,
                    letterSpacing: "-0.05em",
                    color: `rgba(${t.accentRgb},0.11)`,
                    userSelect: "none",
                    lineHeight: 1,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  {proj.label}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: 26 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 13,
                  }}
                >
                  {proj.featured && (
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        background: t.accent,
                        color: "#000",
                        borderRadius: 2,
                      }}
                    >
                      Featured
                    </span>
                  )}
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        background: t.tagBg,
                        color: t.accent,
                        borderRadius: 2,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  style={{
                    fontFamily: cond,
                    fontSize: 24,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: t.text,
                    margin: "0 0 10px",
                  }}
                >
                  {proj.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: t.muted,
                    fontWeight: 300,
                    margin: "0 0 22px",
                  }}
                >
                  {proj.desc}
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {proj.live && proj.live !== "#" && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "7px 16px",
                        background: t.accent,
                        color: "#000",
                        border: `1px solid ${t.accent}`,
                        textDecoration: "none",
                        transition: "opacity .2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.opacity = ".8")
                      }
                      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Live Demo
                    </a>
                  )}
                  {proj.github && proj.github !== "#" && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ap-ghost"
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "7px 16px",
                        background: "transparent",
                        color: t.muted,
                        border: `1px solid ${t.border}`,
                        textDecoration: "none",
                        transition: "all .2s",
                      }}
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: t.muted,
            textTransform: "uppercase",
            marginTop: 38,
            textAlign: "center",
          }}
        >
          // more projects shipping soon — stay tuned
        </p>
      </section>

      {/* ══ CONTACT ════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          padding: isMobile ? "60px 20px" : "86px 40px",
          background: t.surface2,
          pointerEvents: "auto",
        }}
      >
        <SectionHeader num="04" title="Contact" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: isMobile ? 32 : 60,
            alignItems: "start",
          }}
        >
          {/* Left col */}
          <div>
            <h3
              style={{
                fontFamily: cond,
                fontWeight: 900,
                fontSize: isMobile
                  ? "clamp(36px,8vw,52px)"
                  : "clamp(46px,8vw,70px)",
                textTransform: "uppercase",
                lineHeight: 0.93,
                color: t.text,
                margin: "0 0 12px",
              }}
            >
              LET'S
              <br />
              <span style={{ color: t.accent, fontStyle: "italic" }}>WORK</span>
              <br />
              TOGETHER
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: t.muted,
                fontWeight: 300,
                maxWidth: 320,
                margin: "18px 0 32px",
              }}
            >
              Open to full-time roles, freelance projects, and interesting
              collabs. Drop a message or reach out directly — I reply fast.
            </p>

            {[
              {
                icon: "@",
                label: "Email",
                sub: CONTACT.email,
                href: `https://mail.google.com/mail/?view=cm&to=${CONTACT.email}`,
              },
              // { icon: 'GH', label: 'GitHub',   sub: 'YOUR_GITHUB',    href: CONTACT.github },
              {
                icon: "LI",
                label: "LinkedIn",
                sub: "https://www.linkedin.com/in/abhinav-premkumar-138036245/",
                href: CONTACT.linkedin,
              },
              {
                icon: "📍",
                label: "Location",
                sub: CONTACT.location,
                href: undefined,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="ap-crow"
                onClick={() => item.href && window.open(item.href, "_blank")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "13px 0",
                  borderBottom: `1px solid ${t.border}`,
                  color: t.text,
                  transition: "color .2s",
                  cursor: item.href ? "pointer" : "default",
                }}
              >
                <div
                  className="ap-cicon"
                  style={{
                    width: 34,
                    height: 34,
                    border: `1px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.accent,
                    fontSize: item.icon.length > 2 ? 14 : 11,
                    fontFamily: mono,
                    flexShrink: 0,
                    transition: "border-color .2s",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: t.muted,
                      marginTop: 2,
                    }}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right col — form */}
          {fsState.succeeded ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "48px 24px",
                border: `1px solid rgba(${t.accentRgb},0.3)`,
                background: `rgba(${t.accentRgb},0.04)`,
              }}
            >
              <span style={{ fontSize: 36 }}>✅</span>
              <div
                style={{
                  fontFamily: cond,
                  fontSize: 22,
                  fontWeight: 700,
                  color: t.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Message Sent!
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: t.muted,
                  textAlign: "center",
                  letterSpacing: "0.08em",
                }}
              >
                Thanks for reaching out. I'll get back to you soon.
              </div>
            </div>
          ) : (
            <form
              onSubmit={fsHandleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label
                  htmlFor="name"
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: t.muted,
                  }}
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  style={{
                    background: t.formBg,
                    border: `1px solid ${t.border}`,
                    color: t.text,
                    padding: "11px 15px",
                    fontSize: 14,
                    fontFamily: sans,
                    transition: "border-color .2s",
                    width: "100%",
                  }}
                />
                <ValidationError
                  field="name"
                  prefix="Name"
                  errors={fsState.errors}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: "#ff4444",
                    marginTop: 2,
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label
                  htmlFor="email"
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: t.muted,
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@email.com"
                  style={{
                    background: t.formBg,
                    border: `1px solid ${t.border}`,
                    color: t.text,
                    padding: "11px 15px",
                    fontSize: 14,
                    fontFamily: sans,
                    transition: "border-color .2s",
                    width: "100%",
                  }}
                />
                <ValidationError
                  field="email"
                  prefix="Email"
                  errors={fsState.errors}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: "#ff4444",
                    marginTop: 2,
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label
                  htmlFor="message"
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: t.muted,
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Hi Abhinav, I'd love to work with you on..."
                  style={{
                    background: t.formBg,
                    border: `1px solid ${t.border}`,
                    color: t.text,
                    padding: "11px 15px",
                    fontSize: 14,
                    fontFamily: sans,
                    resize: "vertical",
                    transition: "border-color .2s",
                    width: "100%",
                  }}
                />
                <ValidationError
                  field="message"
                  prefix="Message"
                  errors={fsState.errors}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: "#ff4444",
                    marginTop: 2,
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={fsState.submitting}
                style={{
                  alignSelf: "flex-start",
                  fontFamily: cond,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "12px 30px",
                  background: fsState.submitting ? t.muted : t.accent,
                  color: "#000",
                  border: "none",
                  cursor: fsState.submitting ? "not-allowed" : "pointer",
                  clipPath:
                    "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)",
                  transition: "opacity .2s, background .3s",
                  opacity: fsState.submitting ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!fsState.submitting)
                    e.currentTarget.style.opacity = ".82";
                }}
                onMouseOut={(e) =>
                  (e.currentTarget.style.opacity = fsState.submitting
                    ? "0.6"
                    : "1")
                }
              >
                {fsState.submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════ */}
      <footer
        style={{
          padding: isMobile ? "22px 20px" : "22px 40px",
          background: t.surface,
          borderTop: `1px solid ${t.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          pointerEvents: "auto",
        }}
      >
        <p
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: t.muted,
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          © 2025 <span style={{ color: t.accent }}>Abhinav Premkumar</span> —
          Chennai, India
        </p>
        <p
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: t.muted,
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          Built with <span style={{ color: t.accent }}>React</span> +{" "}
          <span style={{ color: t.accent }}>Three.js</span>
        </p>
      </footer>
    </div>
  );
}
