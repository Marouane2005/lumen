# Design Brief

## Direction

Lumen — a warm, dark-first conversational workspace for a calm, thoughtful AI companion.

## Tone

Refined editorial warmth: deep ink-plum surfaces, amber lamplight, serif voice — a quiet study at night rather than a tech dashboard.

## Differentiation

The assistant speaks in display serif with no bubble, so replies read like letters; user turns are compact plum pills — a conversation that feels written, not typed.

## Color Palette

| Token      | OKLCH          | Role                                  |
| ---------- | -------------- | ------------------------------------- |
| background | 0.165 0.012 350 | ink-plum canvas (dark default)        |
| foreground | 0.94 0.008 70  | warm off-white text                   |
| card       | 0.205 0.014 350 | raised composer / message surface     |
| primary    | 0.76 0.13 68   | amber-gold CTAs, active states, ring  |
| accent     | 0.66 0.12 26   | dusty coral for secondary emphasis    |
| muted      | 0.255 0.014 350 | user bubble fill, quiet panels        |
| sidebar    | 0.145 0.012 350 | deepest zone, hairline separated      |

## Typography

- Display: Fraunces — wordmark, assistant name, empty-state headline, assistant replies
- Body: General Sans — UI labels, sidebar, composer, user messages
- Mono: Geist Mono — timestamps and small metadata only
- Scale: hero `text-4xl md:text-6xl font-semibold tracking-tight`, h2 `text-2xl md:text-3xl font-semibold`, label `text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground`, body `text-base leading-relaxed`

## Elevation & Depth

Two-step elevation only: flat background, hairline-bordered card surfaces, and a single `shadow-composer` lift on the input — depth comes from warm surface steps, never heavy drop shadows.

## Structural Zones

| Zone    | Background       | Border                  | Notes                                             |
| ------- | ---------------- | ----------------------- | ------------------------------------------------- |
| Sidebar | `bg-sidebar`     | `border-r border-sidebar-border` | Wordmark + New conversation + list + user footer |
| Header  | `bg-background/80 backdrop-blur` | `border-b border-border` | Assistant name, online dot, subtle actions |
| Content | `bg-background`  | —                       | Centered 760px thread, generous vertical rhythm   |
| Composer| `bg-card`        | `border border-border`  | Rounded-2xl, `shadow-composer`, pinned bottom     |

## Spacing & Rhythm

Sidebar padding 16–20px; thread gutters 24px mobile / 40px desktop; 20–28px between message groups, 8px within; empty state breathes with 96px top offset.

## Component Patterns

- Buttons: fully rounded pills; primary amber-gold with dark ink text, hover lightens L by ~0.03; ghost icon buttons with `bg-sidebar-accent` hover.
- Cards: 14px radius, `bg-card`, hairline border, no shadow except composer.
- Bubbles: user = `bg-muted` plum pill, right-aligned, 18px radius with tight bottom-right; assistant = no bubble, serif text.
- Badges/Chips: outlined pills, `border-border`, `text-muted-foreground`, amber border on hover.

## Motion

- Entrance: thread items `animate-fade-up` 350ms staggered 40ms; empty state fades once.
- Hover: 200–300ms `transition-smooth` on color and border only; no scale jumps.
- Decorative: three-dot `animate-pulse-dot` typing indicator; soft `glow-amber` on the send button.

## Constraints

- Dark mode is the primary experience; light mode is a warm parchment counterpart, both AA+.
- Tokens only — no raw hex, no arbitrary color classes, no purple gradients.
- No message editing or regeneration affordances; no persona switcher.
- Sidebar collapses to a drawer under `md`; composer stays fixed.

## Signature Detail

The assistant's serif, bubble-less replies with a small amber sparkle avatar — an editorial "letter" voice that makes Lumen feel present rather than mechanical.
