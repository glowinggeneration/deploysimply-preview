# Responsive UI/UX Audit

## Extend CometCard Treatment Across Public Pages

- [x] Audit non-landing card classes and current CometCard initialization.
- [x] Add the 3D tilt and cursor-following color sheen to cards on Features, Personas, Pricing, Contact, and Waitlist.
- [x] Preserve card content, accordion behavior, forms, and mobile touch usability.
- [x] Verify hover states, reduced motion, and responsive layouts, then save a checkpoint.


## Apply UI Component Collection To Public Pages

- [x] Map the supplied component patterns to Features, Personas, Pricing, Contact, and Waitlist pages.
- [x] Add page-appropriate interactions without changing existing visible text or copy.
- [x] Preserve the landing page, routes, and public navigation behavior.
- [x] Verify copy, responsive layouts, and interactions on non-landing pages, then save a checkpoint.


## Auto-Rotate Different Voices

- [x] Add timed voice rotation to the full-bleed navigator.
- [x] Keep manual avatar selection and restart the rotation after a manual choice.
- [x] Pause rotation for reduced-motion users and when the tab is hidden.
- [x] Verify the rotating navigator on desktop and mobile, then save a checkpoint.


## Redesign Different Voices Navigation

- [x] Replace the block-style voice cards with a full-bleed active portrait navigator.
- [x] Add circular avatar selection, active voice copy, role metadata, and WhatsApp link treatment.
- [x] Add smooth crossfade and responsive mobile behavior without autoplay.
- [x] Verify the Personas page on desktop and mobile, then save a checkpoint.


## Add Different Voices Section

- [x] Define voices as individuals within the persona groups.
- [x] Add the eight supplied voice profiles after the persona section.
- [x] Use supplied portraits and descriptions with a responsive editorial layout.
- [x] Verify the persona page on desktop and mobile, then save a checkpoint.


## Remove Waitlist Persona Picker and Hero CTA

- [x] Remove the “Choose a persona” picker and its three persona options from the waitlist page.
- [x] Remove the top-right hero Join waitlist button from public pages.
- [x] Keep the main waitlist form CTA and mobile menu navigation intact.
- [x] Verify the affected pages and save a checkpoint.


## Marketing Site Migration

- [x] Audit current routes, navigation, and dashboard/product screens.
- [x] Define public pages and shared marketing navigation.
- [x] Build the remaining public pages with consistent SMAIT styling.
- [x] Remove dashboard-specific screens, links, and shell UI.
- [x] Verify public navigation and responsive layouts, then save a checkpoint.


## Remove World Map Section

- [x] Remove the World Map section call and implementation.
- [x] Remove its related World Map styles and animations.
- [x] Verify CTA, FAQ, footer, and landing-page flow remain intact.
- [x] Run checks and save a checkpoint.


## Replace Social Platform Section With World Map

- [x] Add a responsive connectivity map section where the social-platform section was removed.
- [x] Configure map routes and markers for South Africa, Kenya, Nigeria, Zambia, Liberia, and Canada.
- [x] Preserve the existing CTA/footer flow and mobile layout.
- [x] Verify desktop and mobile rendering, then save a checkpoint.


## Remove Social Platform Section

- [ ] Locate the “Plugs into every social platform” section and its CTA.
- [ ] Remove the section markup without affecting adjacent content or footer layout.
- [ ] Remove or preserve related styles and handlers as appropriate.
- [ ] Verify the landing page at desktop and mobile sizes, then save a checkpoint.


## Remove CometCard From Testimonials

- [x] Remove the CometCard class from the testimonial cards only.
- [x] Keep CometCard behavior active for Personas at Work and FAQ.
- [x] Verify the landing page and save a checkpoint.


## CometCard Treatments

- [ ] Inspect the social proof, Personas at Work, and FAQ card markup and styles.
- [ ] Add a shared CometCard-style 3D tilt interaction for the target cards.
- [ ] Preserve content, touch behavior, reduced-motion support, and mobile layout.
- [ ] Verify the target sections at desktop and mobile sizes.
- [ ] Run checks and save a checkpoint.


## Mobile Dock Navigation

- [x] Inspect the existing mobile bottom navigation markup and route bindings.
- [x] Replace the mobile navigation presentation with a magnifying Dock-style control.
- [x] Preserve route destinations, active state, keyboard focus, and minimum touch targets.
- [x] Verify the Dock on the landing page and dashboard at mobile width.
- [x] Run checks and save a checkpoint.


## Hero Background Rollback

- [ ] Remove the GradientWaves canvas markup and initialization.
- [ ] Restore the previous static pink gradient and drift animation layer.
- [ ] Verify hero rendering at mobile and desktop sizes.
- [ ] Run checks and save a rollback checkpoint.


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
