---
name: PrepTrack
colors:
  surface: '#0e150e'
  surface-dim: '#0e150e'
  surface-bright: '#343b33'
  surface-container-lowest: '#091009'
  surface-container-low: '#161d16'
  surface-container: '#1a211a'
  surface-container-high: '#252c24'
  surface-container-highest: '#2f372e'
  on-surface: '#dde5d9'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#dde5d9'
  inverse-on-surface: '#2b322a'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#6fff92'
  on-primary: '#003915'
  primary-container: '#4be277'
  on-primary-container: '#006129'
  inverse-primary: '#006e2f'
  secondary: '#bccbb9'
  on-secondary: '#273327'
  secondary-container: '#3d4a3d'
  on-secondary-container: '#abb9a8'
  tertiary: '#ffddc7'
  on-tertiary: '#4f2500'
  tertiary-container: '#ffb885'
  on-tertiary-container: '#79471d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6aff90'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005322'
  secondary-fixed: '#d8e7d5'
  secondary-fixed-dim: '#bccbb9'
  on-secondary-fixed: '#121e14'
  on-secondary-fixed-variant: '#3d4a3d'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#feb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#6b3b12'
  background: '#0e150e'
  on-background: '#dde5d9'
  surface-variant: '#2f372e'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 16px
  page_padding: 24px
  unit_xs: 4px
  unit_sm: 8px
  unit_md: 16px
  unit_lg: 24px
  unit_xl: 32px
  unit_xxl: 48px
---

## Brand & Style
The design system is built for the high-stakes environment of technical interview preparation. It embodies a **Minimal-Technical** aesthetic, drawing inspiration from modern IDEs and developer tools to create a focused, "flow-state" environment.

The brand personality is precise, authoritative, and high-performance. It prioritizes information density and legibility over decorative elements. By utilizing a monochromatic deep forest palette with a vibrant terminal-green accent, the UI signals a specialized tool specifically engineered for computer science engineering students. The emotional response should be one of "calm focus" and "professional readiness."

## Colors
The color strategy employs a "Deep Forest" dark mode, which reduces eye strain during long coding sessions. The palette is strictly functional:
- **Core Surfaces:** Layered greens create a sense of depth without relying on traditional shadows.
- **Primary Accent:** The `#4be277` green is reserved for primary actions and success states, providing high visibility against the dark background.
- **Data Visualization:** Specific semantic pairings for "Easy," "Medium," and "Hard" allow for instant cognitive recognition of problem difficulty, critical for the platform's user base.
- **Typography:** A three-tier hierarchy of greens ensures content structure is clear while maintaining a cohesive technical atmosphere.

## Typography
Inter is utilized as the sole typeface to maintain a systematic and utilitarian feel. 
- **Scale:** The system uses a strict hierarchical scale. Headlines use slightly tighter letter spacing and heavier weights to command attention.
- **Body:** The 16px base ensures high readability for complex technical explanations and problem descriptions.
- **Labels:** Small caps or bold weights are used for metadata and badges to differentiate them from prose.
- **Responsiveness:** For mobile devices, `display` and `headline-lg` should scale down by 15-20% to avoid excessive line breaks.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for dashboard views and a **Fluid Content** model for learning modules. 
- **Grid:** A 12-column grid is standard for desktop (max-width 1280px).
- **Rhythm:** An 8px linear scale is used for all internal component spacing (padding, margins, gaps), while the 16px base unit defines the standard layout blocks.
- **Padding:** Page-level padding is set to 24px to provide a comfortable "breathing room" around high-density technical data.
- **Responsive:** On mobile, margins reduce to 16px and the grid collapses to a single column, prioritizing vertical readability.

## Elevation & Depth
Depth is communicated through **Tonal Layering** rather than traditional drop shadows, maintaining the clean, tool-like aesthetic.
- **Level 0 (Base):** Background (`#0e150e`) for the lowest layer.
- **Level 1 (Cards):** Surface (`#1a221a`) with a 1px border (`#3d4a3d`).
- **Level 2 (Popovers/Active):** Surface High (`#242c24`) for elements that sit above the primary content, such as tooltips or dropdown menus.
- **Outlines:** Low-contrast outlines provide the primary structural definition, ensuring that sections remain distinct without adding visual noise.

## Shapes
The design system uses a **Rounded** shape language to balance the "sharpness" of the technical dark theme. 
- **Standard Radius:** 8px (`0.5rem`) is the default for cards, buttons, and input fields.
- **Internal Radius:** For elements nested inside cards (like progress bars or image containers), use 4px to maintain visual nesting harmony.
- **Interactive Elements:** Use the standard 8px radius to ensure a consistent touch/click target appearance.

## Components
- **Buttons:**
    - *Primary:* Background `#4be277`, Color `#003915`, Bold weight. These should feel like "active" triggers.
    - *Ghost:* Background transparent, Border 1px `#3d4a3d`, Color `#dce5d9`. Used for secondary actions to maintain hierarchy.
- **Input Fields:**
    - Background `#1a221a`, Border 1px `#3d4a3d`. On focus, the border color shifts to the primary accent `#4be277`. Text is 16px to prevent iOS zoom-on-focus.
- **Cards:**
    - Always use Surface (`#1a221a`) with a 1px border. No shadows. Cards should be used to group related interview questions or data points.
- **Difficulty Badges:**
    - Pill-shaped with small-cap text. Use the semantic background/text pairings defined in the color section. The contrast must be high enough for quick scanning in lists.
- **Lists:**
    - Items should be separated by 1px horizontal dividers (`#3d4a3d`). Hover states for list items should use Surface High (`#242c24`).
- **Code Snippets:**
    - Use Surface High as the container background with a monospaced font for actual code blocks to distinguish them from platform prose.