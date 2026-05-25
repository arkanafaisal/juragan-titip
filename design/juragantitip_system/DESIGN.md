---
name: JuraganTitip System
colors:
  surface: 0 0% 100%
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: 221 83% 53%
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: 210 40% 98%
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-elevated: 0 0% 100%
  border: 214 32% 91%
  text-primary: 222 47% 11%
  text-secondary: 215 16% 47%
  text-muted: 215 20% 65%
  success: 161 64% 39%
  warning: 38 92% 50%
  destructive: 350 89% 60%
  info: 262 83% 66%
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: '0'
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  overline:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: '0'
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0'
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 12px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for **professional efficiency and trust**. As a management platform for consignment businesses, the visual language prioritizes utility, data integrity, and operational speed. It adopts a **Corporate/Modern** aesthetic—balancing the reliability of an enterprise tool with the sleek, high-performance feel of a modern SaaS application.

The target audience consists of business owners and staff who manage inventory, logistics, and financials. Consequently, the UI avoids decorative fluff, opting instead for a structured, information-dense layout that provides "at-a-glance" clarity. The atmosphere is calm and focused, utilizing a slate-based neutral palette to allow semantic status colors (success, warning, destructive) to command attention only when necessary.

## Colors

This design system utilizes an HSL-based token system optimized for Tailwind v4, ensuring seamless transitions between light and dark modes. The palette is dominated by **Slate neutrals** to maintain a clean, professional canvas.

- **Primary (Blue-600)**: Used for core actions, active navigation, and primary branding. It evokes stability and institutional trust.
- **Semantic Colors**: Emerald (Success), Amber (Warning), and Rose (Destructive) are used strictly for status signaling—such as payment confirmation, low stock alerts, or return processing.
- **Monochrome Foundation**: Backgrounds leverage a very subtle off-white (Slate-50) to reduce eye strain during long working sessions, while borders use a crisp Slate-200 to define structure without adding visual noise.

## Typography

The typography strategy is bifurcated to handle both UI interaction and heavy financial data.

- **UI & Content**: **Inter** is the workhorse font. It provides excellent legibility at small sizes and a modern, neutral tone for headings.
- **Financials & Numerics**: **JetBrains Mono** is used exclusively for currency (IDR), quantities, and tabular data. The monospaced nature ensures that columns of numbers align perfectly, preventing errors in visual scanning during audits or stock-taking.
- **Scale**: A tight 11px to 32px scale is employed. For mobile, avoid using the `Display` level; fallback to `H1` for titles to preserve screen real estate.

## Layout & Spacing

The design system utilizes a strict **4px base grid** (n * 4) to ensure mathematical harmony across all components.

- **Layout Model**: A **fluid grid** system is used for dashboards.
  - **Desktop**: 12-column grid with 24px margins and 12px gutters. Sidebar is fixed at 240px.
  - **Tablet**: 2-column grid for cards. Sidebar collapses to a 64px icon rail.
  - **Mobile**: Single column flow with 16px horizontal margins. A fixed bottom navigation bar (tab bar) is mandatory for core ergonomics.
- **Spacing Philosophy**: Components like inputs and buttons use `md` (16px) horizontal padding. Internal card padding is set to `20px` (spacing-5) to provide a comfortable breathability between data points.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**. The system avoids heavy borders in favor of subtle depth cues that suggest interactivity.

- **Layer 0 (Background)**: Slate-50, flat.
- **Layer 1 (Cards/Surface)**: White background with `shadow-sm`. Used for the primary content canvas.
- **Layer 2 (Dropdowns/Popovers)**: `shadow-md` with a 1px Slate-200 border.
- **Layer 3 (Modals/Overlays)**: `shadow-lg` or `shadow-xl`. Background dimming (backdrop-blur) should be applied to the layer below to maintain focus.

Shadows are tinted with a tiny fraction of the neutral slate color (e.g., `rgba(15, 23, 42, 0.08)`) to ensure they look integrated rather than like "dirty" grey smudges.

## Shapes

The shape language is **Rounded**, reflecting a modern and accessible professional tool. 

- **Small (4px)**: Reserved for utility elements like badges, tags, and checkboxes.
- **Medium (8px)**: The standard for buttons and form inputs.
- **Large (12px)**: Default for dashboard cards and container modules.
- **Extra Large (16px)**: Used for high-level containers like modals and slide-out panels.
- **Full**: Used exclusively for avatars and status indicators (pills).

## Components

- **Buttons**:
  - Primary: Solid Blue-600, white text. 100ms scale transition (0.97) on click.
  - Ghost/Secondary: Slate-200 border or transparent background with Blue-600 text.
- **Inputs**:
  - 8px radius, 1px Slate-200 border. On focus: 2px Blue-600 ring with 0% offset.
  - Placeholders use `text-muted`.
- **Cards**:
  - White surface, 12px radius, `shadow-sm`. Card headers should use a subtle bottom border if the card contains a data table.
- **Badges**:
  - Semi-transparent background (10% opacity) of the semantic color with high-contrast text of the same hue (e.g., Success badge: Emerald-50 background, Emerald-700 text).
- **Tables**:
  - Minimalist design. Header row uses `Caption` typography with `text-secondary` and a light grey background. Rows have a subtle 1px bottom border.
- **Tabs**:
  - Underline style for page-level navigation. Pill style (filled) for internal card filtering.
- **Data Stat Cards**:
  - Large JetBrains Mono numbers. Include a small trend indicator (Icon + percentage) using Success/Destructive colors.