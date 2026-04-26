# Commit 28: `feat(theme): align design system with velvet & steel spec`

**Status:** Consolidation commit. After commits 21-27, the UI exists but may have drifted from the formal design system. This commit makes the codebase the source of truth for the Velvet & Steel system as documented in `design.md`.
**Why this commit:** Fixes accumulated inconsistencies, ensures every page renders against the same tokens, and produces a final mock-faithful build before judging.
**⏱️ Budget:** 60-90 min. If anything in here takes longer than 20 min individually, skip it and move on.

---

## Step 1: Create `design.md` in the repo

Drop the design.md you wrote into the project root. Why: it becomes documentation for v2 contributors AND for the bounty judges who clone the repo. Add a one-liner to the README pointing at it.

```bash
# from repo root
mv ~/Downloads/design.md ./design.md
git add design.md
```

---

## Step 2: Tailwind config — full token system

Replace your `tailwind.config.ts` theme.extend block with the full token set. This is the canonical version — all 47 colors, all 8 typography scales, all radii, all spacing units.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./emails/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface system
        surface: "#faf9f7",
        "surface-dim": "#dadad8",
        "surface-bright": "#faf9f7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f3f1",
        "surface-container": "#efeeec",
        "surface-container-high": "#e9e8e6",
        "surface-container-highest": "#e3e2e0",
        "surface-variant": "#e3e2e0",
        "surface-tint": "#9e4300",
        "on-surface": "#1a1c1b",
        "on-surface-variant": "#574238",
        "inverse-surface": "#2f3130",
        "inverse-on-surface": "#f1f1ef",

        // Outline (the "Steel")
        outline: "#8a7267",
        "outline-variant": "#ddc1b3",

        // Primary (Burnt Terracotta)
        primary: "#9a4100",
        "on-primary": "#ffffff",
        "primary-container": "#bd5611",
        "on-primary-container": "#fffbff",
        "inverse-primary": "#ffb690",
        "primary-fixed": "#ffdbcb",
        "primary-fixed-dim": "#ffb690",
        "on-primary-fixed": "#341100",
        "on-primary-fixed-variant": "#783100",

        // Secondary
        secondary: "#5f5e62",
        "on-secondary": "#ffffff",
        "secondary-container": "#e4e1e7",
        "on-secondary-container": "#656468",
        "secondary-fixed": "#e4e1e7",
        "secondary-fixed-dim": "#c8c5cb",
        "on-secondary-fixed": "#1b1b1f",
        "on-secondary-fixed-variant": "#47464b",

        // Tertiary (Deep Teal — used for "approved" status)
        tertiary: "#006388",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#007daa",
        "on-tertiary-container": "#fcfcff",
        "tertiary-fixed": "#c5e7ff",
        "tertiary-fixed-dim": "#7ed0ff",
        "on-tertiary-fixed": "#001e2d",
        "on-tertiary-fixed-variant": "#004c6a",

        // Error
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Background
        background: "#faf9f7",
        "on-background": "#1a1c1b",
      },

      fontFamily: {
        // Aliases match the design.md typography names
        "display-xl": ["var(--font-noto-serif)", "serif"],
        "display-lg": ["var(--font-noto-serif)", "serif"],
        h1: ["var(--font-noto-serif)", "serif"],
        h2: ["var(--font-noto-serif)", "serif"],
        "body-lg": ["var(--font-manrope)", "sans-serif"],
        "body-md": ["var(--font-manrope)", "sans-serif"],
        "ui-label": ["var(--font-manrope)", "sans-serif"],
        "ui-small": ["var(--font-manrope)", "sans-serif"],
        // Standard aliases
        serif: ["var(--font-noto-serif)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      fontSize: {
        "display-xl": [
          "4.5rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        "display-lg": [
          "3rem",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        h1: ["2.25rem", { lineHeight: "1.2", fontWeight: "400" }],
        h2: ["1.5rem", { lineHeight: "1.3", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "ui-label": [
          "0.875rem",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "ui-small": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },

      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },

      spacing: {
        "stack-xs": "4px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        gutter: "24px",
        margin: "32px",
        "container-max": "1280px",
      },

      boxShadow: {
        // Multi-layered ambient (Velvet & Steel spec)
        card: "0 2px 10px rgba(0,0,0,0.02)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.04)",
        elevated: "0 8px 30px rgba(0,0,0,0.06)",
        // Primary CTA — terracotta glow
        cta: "0 8px 30px rgba(154,65,0,0.2)",
        "cta-hover": "0 12px 40px rgba(154,65,0,0.3)",
        // Glassmorphism nav
        glass: "0 4px 30px rgba(0,0,0,0.03)",
        // Status badge glows
        "glow-pending": "0 0 8px rgba(228,225,231,0.5)",
        "glow-approved": "0 0 8px rgba(0,125,170,0.2)",
        "glow-rejected": "0 0 8px rgba(255,218,214,0.4)",
      },

      borderWidth: {
        hairline: "0.5px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Test after this:** `pnpm dev` should boot. If a page is now totally unstyled, you have a syntax error in the config — check the terminal.

---

## Step 3: Wire up Manrope + Noto Serif properly

In `app/layout.tsx`:

```tsx
import { Noto_Serif, Manrope } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${manrope.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans bg-background text-on-background antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Why `var(--font-...)` in Tailwind config and `.variable` in layout:** Next.js font optimization works via CSS variables. The Tailwind config references `var(--font-noto-serif)`, which Next sets via the `variable` prop. This avoids font-loading flicker.

**Critical:** if you previously imported Geist Sans, REMOVE it now. Your stack is Noto Serif + Manrope + Geist Mono. Three fonts. No more.

---

## Step 4: Update `app/globals.css` with shadcn token mapping

Your shadcn components reference CSS variables like `--background`, `--primary`, `--foreground`. Map them to the new design tokens so shadcn defaults adopt the Velvet & Steel palette without you rewriting every component.

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn semantic tokens → Velvet & Steel values (HSL for shadcn compat) */
    --background: 30 20% 98%; /* #faf9f7 */
    --foreground: 150 6% 11%; /* #1a1c1b */

    --card: 0 0% 100%; /* #ffffff = surface-container-lowest */
    --card-foreground: 150 6% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 150 6% 11%;

    --primary: 24 100% 30%; /* #9a4100 */
    --primary-foreground: 0 0% 100%;

    --secondary: 240 2% 38%; /* #5f5e62 */
    --secondary-foreground: 0 0% 100%;

    --muted: 30 9% 94%; /* surface-container-low */
    --muted-foreground: 22 24% 28%; /* on-surface-variant */

    --accent: 22 100% 91%; /* primary-fixed #ffdbcb */
    --accent-foreground: 24 100% 10%;

    --destructive: 0 76% 41%; /* error */
    --destructive-foreground: 0 0% 100%;

    --border: 22 41% 78%; /* outline-variant #ddc1b3 */
    --input: 22 41% 78%;
    --ring: 24 100% 30%; /* primary */

    --radius: 0.5rem; /* DEFAULT from design.md */
  }
}

@layer base {
  body {
    @apply font-sans bg-background text-on-background;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }

  /* Headings default to Noto Serif per the spec */
  h1,
  h2,
  h3 {
    @apply font-serif;
  }
}
```

**What this fixes:** shadcn's `<Button variant="default">` will now use Burnt Terracotta automatically. `<Card>` borders become `outline-variant`. `<Input>` focus rings are terracotta. You get design system propagation through shadcn's existing components without touching them.

---

## Step 5: Audit `border-[0.5px]` usage

Replace any `border-[0.5px]` you wrote in commits 21-27 with the new utility:

```bash
# Find all instances
grep -rn 'border-\[0.5px\]' app/ components/

# Optional: bulk-replace (only if comfortable with sed)
find app components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/border-\[0\.5px\]/border-hairline/g' {} +
```

`border-hairline` reads cleaner and matches the design.md intent. Skip this step if you're nervous about regex — purely cosmetic.

---

## Step 6: Visual regression walkthrough

After steps 1-5, walk every page in dev:

- `/` (landing) — hero serif italic, terracotta CTA, glassmorphic nav
- `/venues/the-grand-hall-kl` — Bento gallery, sticky pricing sidebar
- `/book/the-grand-hall-kl` — pill chips, underline inputs, terracotta submit
- `/booking/[token]` — status badge with glow
- `/admin/login` — minimal, branded
- `/admin/dashboard` — Command Center heading, stats cards, Activity Feed, table glow badges

**Things that commonly break after a token sweep:**

- Buttons that hardcoded `bg-orange-500` instead of `bg-primary` — fix to `bg-primary`
- Custom text colors like `text-neutral-600` — fix to `text-on-surface-variant`
- Hardcoded `border-gray-200` — fix to `border-outline-variant`

---

## Step 7: Commit

```bash
git add .
git commit -m "feat(theme): align design system with velvet & steel spec"
git push
```

If your branch deploy goes green on Vercel, ship it. If it goes red — revert this single commit and you're back where you were after commit 27.

---

## What should NOT be in this commit

- New features (those are commits 29+)
- Mobile bug fixes (separate commit if needed)
- Content changes (text, images)
- Component restructuring

Pure design system alignment only. If you find yourself touching component logic, stop and split into a separate commit.
