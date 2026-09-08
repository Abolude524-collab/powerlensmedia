---
name: Power Lens Minimalist Portfolio
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Montserrat
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: '0'
  body-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  label-caps:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
  label-mono-meta:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  space-4xl: 6rem
  gutter: 1.5rem
  margin-mobile: 1.25rem
  margin-desktop: 3rem
---

## Brand & Style

This design system establishes an uncompromising, content-first photographic showcase for Edwards Godspower (@mikano_shot_it). Built around an editorial gallery ethos, the interface operates as a silent stage: UI elements remain whisper-quiet, structural, and architectonic, allowing high-resolution imagery and visual narrative to command full attention.

The visual style blends refined modern minimalism with an austere, gallery-curated architecture. Every line, spacer, and typographic moment reinforces precision, intentionality, and high-end visual craftsmanship. Interactions are immediate and quiet, avoiding decorative flourishes in favor of razor-sharp alignment, deliberate contrast, and deep atmospheric blacks.

## Colors

The palette is engineered for optical neutrality, preventing color pollution when viewing photographic works:

- **Deep Canvas Background (`#050505`)**: The core base layer. A true deep void that provides maximum dynamic range for displayed images.
- **Surface Elevation (`#121212`)**: Applied sparingly to floating panels, modal backdrops, navigation bars, and meta-containers.
- **Structural Border (`#262626`)**: Used for ultra-thin 1px dividers, grid seams, and frame delimiters.
- **Primary Text & High Contrast (`#F5F5F5`)**: Crisp off-white dedicated to headlines, display titles, and prominent metrics.
- **Secondary Text & Metadata (`#A3A3A3`)**: Balanced neutral gray for camera EXIF data, technical credits, year stamps, and captions.
- **Accent & Active State (`#FFFFFF`)**: Pure, unyielding white reserved for focused UI states, primary CTAs, and active pagination indicators.

## Typography

Typography is set exclusively in **Montserrat**, leveraging its geometric bones and modern proportions to build tension between sweeping visual photography and razor-sharp typographic metadata.

- **Hero & Project Titles**: Heavy tracking suppression (`-0.03em` to `-0.02em`) gives headlines an editorial gravity reminiscent of luxury print books.
- **Labels & Categorization**: Rendered in `label-caps` with uppercase transformation and generous tracking (`0.12em`) to ground imagery without competing for dominance.
- **Body & Artist Statements**: Standard weight (`400`) with generous line-height (`1.6x`) guarantees unencumbered reading over dark surfaces.

## Layout & Spacing

The layout model relies on a structured, fluid-capable 12-column grid balanced by expansive negative margins. Spacing is rhythmic and based on an 8px architectural unit, scaling into cinematic breathing room around hero imagery.

- **Desktop (1024px and up)**: 12 columns, 24px gutters, with outer canvas padding of 48px to 64px. Layout supports asymmetric masonry, single-frame hero presentations, and two-up horizontal comparative views.
- **Tablet (768px - 1023px)**: 8 columns, 20px gutters, 32px outer canvas margins.
- **Mobile (below 768px)**: 4 columns, 16px gutters, 20px outer margin. Full-bleed options are privileged for photographic plates to maximize vertical canvas real estate.
- **Exhibition Spacing**: Vertical spacing between disparate photographic narratives utilizes `space-3xl` or `space-4xl` to demand pause and cognitive separation between series.

## Elevation & Depth

This design system abandons drop shadows and ambient color glows. Depth is achieved strictly through:

1. **Layered Dark Luminance**: `#050505` serves as the canvas substrate, `#121212` forms tactile floating surfaces, overlays, and drawer drawers.
2. **Hairline Structural Boundaries**: 1px borders colored in `#262626` outline boundaries cleanly without visual noise.
3. **Glass Veil for Contextual Navigation**: Subtle backdrop filters (`backdrop-blur(12px)`) with a semi-translucent fill of `rgba(5, 5, 5, 0.75)` applied to pinned headers and lightbox footers.
4. **Z-Index Layering**: 
   - Base canvas: `z-0`
   - Image cards and text layout: `z-10`
   - Sticky navigation & floating controls: `z-30`
   - Fullscreen Lightbox & modal exhibits: `z-50`

## Shapes

The interface embraces an architectural sharpness. Radii are held strictly between `0px` and `4px`:

- Primary frames, modal viewports, and photographic image containers remain strictly square (`0px`) to honor the original aspect ratios of photographic captures.
- Interactive controls, contextual chips, and form elements use a subtle `2px` to `4px` corner treatment (`roundedness: 1`), softening tactile edges while retaining a bespoke, technical edge.

## Components

### Buttons
- **Primary CTA**: `#FFFFFF` solid fill, `#050505` text, Montserrat Semibold 12px uppercase, 2px border radius. Hover triggers slight opacity transition (`opacity: 0.9`).
- **Secondary / Ghost CTA**: Transparent background, 1px `#262626` outline, `#F5F5F5` text. On hover: border transitions to `#F5F5F5`, text to `#FFFFFF`.
- **Icon Actions (Fullscreen, Share, Lens Info)**: 40x40px square hit area, `#121212` background, 1px `#262626` border, `#F5F5F5` icon glyphs.

### Chips & Filter Tags
- Used for photo series categories (e.g., "EDITORIAL", "PORTRAITURE", "STREET").
- Height: 28px.
- Idle: Background `#121212`, border 1px `#262626`, text `#A3A3A3`, uppercase 10px tracking `0.1em`.
- Active: Background `#FFFFFF`, border 1px `#FFFFFF`, text `#050505`.

### Gallery Cards & Frames
- Frame wrapper: Background `#121212`, 1px border `#262626`, 0px radius.
- Imagery: Full bleed within card bounds, transition duration 400ms ease-out on scale (`scale-102`) upon mouse enter.
- Caption drawer: Appended to card base with `#A3A3A3` typography showing shoot location and year stamp.

### Input Fields (Inquiries & Booking)
- Background: `#121212`.
- Border: 1px `#262626`, 2px radius.
- Typography: 14px `#F5F5F5`, placeholder `#A3A3A3`.
- Focus State: 1px `#FFFFFF` outline, no outer glow.

### Checkboxes & Radio Buttons
- 16x16px square forms with 1px border `#262626`.
- Active state: Solid `#FFFFFF` fill with an interior `#050505` square indicator.

### EXIF Data Strip (Specialized Component)
- Horizontal floating bar displaying shutter speed, aperture, ISO, and focal length.
- Background: `rgba(18, 18, 18, 0.85)` with `12px` backdrop blur.
- Dividers: 1px vertical borders `#262626`.
- Text: `label-mono-meta` in `#A3A3A3` with numeric values highlighted in `#F5F5F5`.