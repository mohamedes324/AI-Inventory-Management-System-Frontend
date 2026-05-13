/** @type {import('tailwindcss').Config} */
import { palettes } from "./src/shared/styles/colors";

const activePalette = palettes.palette5;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ── 🎨 Centralized Color Palette ── */
      colors: {
        primary: activePalette.primary,
        secondary: activePalette.secondary,
        gray: activePalette.gray,
        error: activePalette.error,
        warning: activePalette.warning,
        success: activePalette.success,
        info: activePalette.info,

        /* ── ✨ Semantic Tokens (NEW) ──
           These expose palette.background.*, palette.text.*, palette.border.*
           as first-class Tailwind utilities:
             bg-background-app, text-text-primary, border-border-focus, etc.
           ⚠ OLD KEYS REMAIN UNTOUCHED for backward-compatibility. */
        background: activePalette.background,
        text: activePalette.text,
        border: activePalette.border,
      },

      /* ══════════════════════════════════════════════════════════
         🎬 ANIMATION REGISTRY
         All keyframes use CSS Custom Properties defined in index.css
         so they respect the design-system tokens at runtime.
         ══════════════════════════════════════════════════════════ */
      keyframes: {
        /* ── Core: Fade In ── */
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },

        /* ── Core: Slide Up ── */
        slideUp: {
          from: { opacity: "0", transform: "translateY(var(--slide-distance))" },
          to: { opacity: "1", transform: "translateY(0)" },
        },

        /* ── Core: Slide From Left ── */
        slideLeft: {
          from: { opacity: "0", transform: "translateX(calc(var(--slide-distance) * -1))" },
          to: { opacity: "1", transform: "translateX(0)" },
        },

        /* ── Core: Slide From Right ── */
        slideRight: {
          from: { opacity: "0", transform: "translateX(var(--slide-distance))" },
          to: { opacity: "1", transform: "translateX(0)" },
        },

        /* ── Core: Scale In ── */
        scaleIn: {
          from: { opacity: "0", transform: "scale(var(--scale-from))" },
          to: { opacity: "1", transform: "scale(1)" },
        },

        /* ── Core: Glow Pulse ── */
        glowPulse: {
          "0%": { boxShadow: "0 0 0px color-mix(in srgb, var(--glow-color) 40%, transparent)" },
          "50%": { boxShadow: "0 0 20px color-mix(in srgb, var(--glow-color) 80%, transparent)" },
          "100%": { boxShadow: "0 0 0px color-mix(in srgb, var(--glow-color) 40%, transparent)" },
        },

        /* ── Core: Hourglass Swing ── */
        hourglassSwing: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "25%": { transform: "rotate(15deg) scale(1.15)" },
          "50%": { transform: "rotate(0deg) scale(1)" },
          "75%": { transform: "rotate(-15deg) scale(1.15)" },
          "100%": { transform: "rotate(0deg) scale(1)" },
        },

        /* ── New: Floating Effect ── */
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(calc(var(--float-distance) * -1))" },
        },

        /* ── New: Halo Glow (Interactive Aura) ── */
        haloGlow: {
          "0%": {
            boxShadow:
              "0 0 5px color-mix(in srgb, var(--glow-color) 20%, transparent), " +
              "0 0 10px color-mix(in srgb, var(--glow-color) 10%, transparent)",
          },
          "50%": {
            boxShadow:
              "0 0 15px color-mix(in srgb, var(--glow-color) 50%, transparent), " +
              "0 0 30px color-mix(in srgb, var(--glow-color) 25%, transparent), " +
              "0 0 45px color-mix(in srgb, var(--glow-color) 10%, transparent)",
          },
          "100%": {
            boxShadow:
              "0 0 5px color-mix(in srgb, var(--glow-color) 20%, transparent), " +
              "0 0 10px color-mix(in srgb, var(--glow-color) 10%, transparent)",
          },
        },

        /* ── New: Shimmer (Skeleton Loading) ── */
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      /* ══════════════════════════════════════════════════════════
         🎬 ANIMATION SHORTHANDS
         These generate animate-* utility classes with full
         Tailwind modifier support (hover:, focus:, group-hover:).
         All timing/curve values reference CSS variables from index.css.
         ══════════════════════════════════════════════════════════ */
      animation: {
        fadeIn: "fadeIn var(--anim-speed-normal) var(--anim-curve)",
        slideUp: "slideUp var(--anim-speed-normal) var(--anim-curve)",
        slideLeft: "slideLeft var(--anim-speed-normal) var(--anim-curve)",
        slideRight: "slideRight var(--anim-speed-normal) var(--anim-curve)",
        scaleIn: "scaleIn var(--anim-speed-fast) var(--anim-curve)",
        glow: "glowPulse var(--anim-speed-glacial) var(--anim-curve-smooth) infinite",
        hourglass: "hourglassSwing var(--anim-speed-glacial) var(--anim-curve-smooth) infinite",
        float: "float 3s var(--anim-curve-smooth) infinite",
        halo: "haloGlow var(--anim-speed-glacial) var(--anim-curve-smooth) infinite",
        shimmer: "shimmer 1.8s var(--anim-curve-smooth) infinite",
      },
    },
  },

  plugins: [],
};