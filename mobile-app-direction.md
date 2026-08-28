# SMAIT Mobile App-Like Direction

## Chosen approach

SMAIT mobile will behave like a focused communication app rather than a compressed marketing desktop page. The experience will use a compact top bar, a persistent bottom navigation with no more than five destinations, a single dominant call to action, and progressive disclosure for secondary content.

## Design principles

1. **One decision per screen.** Each route leads with one clear next step instead of presenting every section at once.
2. **App shell over page chrome.** Mobile users get predictable top and bottom navigation, generous touch targets, safe-area spacing, and fewer decorative controls.
3. **Compact but not cramped.** Hero copy, cards, and forms use shorter vertical gaps and readable 16px body text while retaining the SMAIT pink editorial style.
4. **Motion communicates state.** Keep the existing entrance motion and subtle press feedback, but reduce hover-dependent behavior on touch screens.

## Mobile information architecture

| Destination | Route | Role |
|---|---|---|
| Home | `#/` | Brand promise and primary entry point |
| Features | `#/features` | How SMAIT works |
| Personas | `#/personas` | Persona and voice exploration |
| Pricing | `#/pricing` | Direction and plan choices |
| Join | `#/waitlist` | Primary conversion action |

Contact remains available from the compact menu and relevant in-page actions rather than occupying a persistent bottom-nav slot.

## Implementation constraints

Desktop navigation and desktop composition remain unchanged. Mobile-specific additions are scoped below the 800px breakpoint, with special density adjustments below 480px. All interactive targets remain at least 44px, the body stays free of horizontal overflow, and reduced-motion behavior is preserved.
