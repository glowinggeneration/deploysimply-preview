# Responsive UI/UX Audit

## Hero Motion Update

- [x] Inspect the hero markup, current background layers, and existing animation rules.
- [x] Implement a pink GradientWaves-style animated background with pointer parallax and grain.
- [x] Keep hero copy, persona artwork, controls, and navigation above the animated layer.
- [x] Respect reduced-motion preferences and avoid introducing mobile overflow.
- [x] Verify the hero at mobile and desktop sizes, then save a checkpoint.


- [ ] Inspect the landing page at 375px and 768px widths for clipping, overflow, unreadable text, and inaccessible controls.
- [ ] Inspect the dashboard at 375px and 768px widths for navigation, card sizing, tables, charts, and horizontal overflow.
- [ ] Review responsive CSS and DOM structure in `client/src/smait.css` and `client/src/smait-app.js`.
- [ ] Implement targeted mobile layout fixes for the landing page and dashboard while preserving desktop composition.
- [ ] Verify landing and dashboard screenshots at mobile and desktop breakpoints.
- [ ] Run type checking and production build, then save a checkpoint.
