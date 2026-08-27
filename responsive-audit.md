# Mobile Responsive Audit

## Initial finding

At 375px wide, the landing page renders as a very narrow, desktop-like canvas inside the viewport. The captured full-page preview shows the hero, content modules, and footer compressed to roughly a phone-width column, with very small text and controls. The dashboard route did not open the dashboard when visited directly because the uploaded SPA routes by hash (`location.hash`) rather than pathname; `/dashboard` therefore falls back to the landing experience until navigated as `/#/dashboard`.

## Likely causes

The uploaded stylesheet has multiple overlapping mobile media-query blocks, including a late hero override, and the SPA uses hash routing. The dashboard layout is desktop-first with a three-column grid at larger widths and needs explicit narrow-screen stacking and overflow containment. The audit will preserve the existing visual language while improving viewport sizing, safe-area spacing, and touch target behavior.

## CometCard verification

The target cards now share a pointer-following sheen and restrained 3D tilt on desktop. At 375px, the cards remain stacked and readable without horizontal overflow; the interaction is reduced to touch-safe active feedback and respects the reduced-motion preference. The FAQ already had a cursor-following border treatment, which remains compatible with the new card layer.
