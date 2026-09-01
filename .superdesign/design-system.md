# TaskSurface design system

## Product and audience

TaskSurface is a shared operational surface for a merchant and an AI agent. It
turns the capabilities available in the current WebMCP page into a focused,
reviewable workflow. The primary demo is an order-management workspace with
three intents: refund an item, change a shipping address, and cancel a
shipment. The user must be able to see what the agent prepared, edit the
judgment-sensitive details, preview the semantic effect, and explicitly commit.

## Visual direction

Use a precise dark operational interface rather than a generic chat product.
The style is neural noir: near-black canvas, subdued dot-grid texture,
translucent charcoal panels, and one warm amber/gold accent. It should feel
like a premium control room. Do not use blue or purple gradients, colorful
marketing imagery, large empty hero regions, serif display type, or decorative
glass effects that reduce legibility.

## Tokens

- Background: `#0A0A0A`; elevated canvas: `#11110F`; panel: `rgba(255,255,255,.035)`
- Borders: `rgba(255,255,255,.10)`; muted text: `#9A9A93`; primary text: `#F5F5EF`
- Accent: `#D0A46A`; accent hover: `#E8C08C`; success: `#78C69B`; danger: `#EF877C`
- Font: Inter or system sans-serif only. Labels use 11px uppercase with .12em tracking;
  body is 14px/20px; key values are 20px semibold.
- Radius: 10px for controls, 14px for cards, 18px for primary task surface.
- Shadows: restrained `0 18px 50px rgba(0,0,0,.24)`. Panel blur is allowed only
  behind opaque enough surfaces to keep text accessible.
- Motion: 160–220ms cubic-bezier(.2,.8,.2,1). Use a soft amber focus halo for
  the field currently owned by the agent, never rapid motion.

## App architecture

Desktop has a persistent 248px dark sidebar with the TaskSurface logo,
Orders/Products/Customers/Shipments nav, and a live agent status. The main
workspace has an order header and a dense, readable merchant dashboard. When a
task starts, the dashboard visually morphs into a two-column task surface:
left is the focused form and selected order facts; right is an agent activity
timeline, capability list, and semantic change preview. A compact approval bar
remains pinned to the bottom.

## Key interaction states

1. Dashboard: a complex but clear order view with status, line items, shipment,
   payment, activity, and an intent input.
2. TaskSurface: unrelated chrome recedes; the selected order and only the
   decision-critical fields remain.
3. Presence: the agent highlights its active field and exposes a short next
   action. Human-owned controls remain visibly editable.
4. Preview: all changes render as business-language diffs, never raw JSON.
5. Commit: destructive action requires a deliberate confirmation and shows a
   final committed state; cancel returns safely to the dashboard.

## Accessibility and responsiveness

Maintain WCAG-friendly contrast, real text labels, focus rings, keyboard
navigation, and no color-only status. Below 960px collapse the sidebar and
stack the preview below the task form; retain the approval bar.
