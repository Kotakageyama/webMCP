# TaskSurface — Devpost submission draft

[日本語版](devpost-submission.ja.md)

## Project name

TaskSurface

## Tagline

Turn live WebMCP capabilities into a shared, task-specific workspace for people and agents.

## Live app and source

- Live app: https://tasksurface-nlgt6zklja-an.a.run.app
- Source: https://github.com/Kotakageyama/webMCP

## Inspiration

WebMCP makes it possible for agents to use structured, page-native tools instead
of guessing through clicks. But a structured tool call alone does not show the
person what is changing, where the agent is working, or where human judgment is
still required. We wanted to explore a different future for the web: UI should
represent the task that a person and an agent are solving together, not merely
the application’s menu hierarchy.

## What it does

TaskSurface is an ecommerce operations prototype. A merchant starts with a
normal order-management screen and chooses one of three tasks: return an item,
change a delivery address, or cancel a shipment.

The large order UI then morphs into a focused shared workspace. It keeps only
the facts and choices relevant to that task, shows the agent’s active context,
lists the capabilities currently available on the page, and renders a
business-language semantic preview before anything is committed. The human can
change the refund destination or address, then explicitly approve the action.
The server also rejects any action request without merchant approval.

## Why WebMCP

TaskSurface is not a chat sidebar attached to an existing dashboard. Its source
of truth is the live page capability set. In a WebMCP-enabled browser,
`document.modelContext.registerTool` exposes only the tools useful in the
current state: task-starting tools on the full order page, then read/preparation
tools for the active refund, address, or shipment task. Tools are unregistered
when that state changes.

That lets the UI react to the same capability graph that an agent sees. A person
can therefore understand what the agent can do now, intervene at the exact
decision point, and review a meaningful consequence instead of raw JSON or a
history of clicks.

## How we built it

The app is a Next.js 16 application deployed on Google Cloud Run. Order data and
approved action records live in Neon Postgres. The Cloud Run runtime reads the
database URL only from Google Secret Manager through a dedicated service account.
The repository includes the Neon schema, Cloud Build configuration, Dockerfile,
and deployment instructions.

WebMCP registration is implemented in `app/webmcp.ts`. The task surface and the
human approval workflow are implemented in `app/task-surface.tsx`. The API
persists only approved refund, shipping-update, and shipment-cancellation
actions.

## Challenges we ran into

Tool schemas alone cannot always communicate the right human interface. For the
MVP, we deliberately constrained the domain and used task-specific components:
item cards for order lines, radio cards for refund destination, address fields,
and a confirmation gate for consequential changes. This keeps the capability
model legible while leaving room for richer schema-to-component hints later.

## Accomplishments that we are proud of

- Made WebMCP visible to the human, not just useful to the agent.
- Turned structured tool availability into a focused, adaptive work surface.
- Preserved human judgment through ownership cues, semantic previews, and an
  approval gate enforced by both UI and API.
- Shipped a public, deployed full-stack demo with a real Postgres persistence
  layer rather than a static UI concept.

## What we learned

The most compelling agent-native interface is often less interface. Once the
agent can discover live capabilities, the human should see only the information
needed to supervise, correct, and approve the current task.

## What’s next for TaskSurface

We plan to add developer-provided UI hints for richer JSON-schema mapping,
multi-item returns, persistent task history with semantic undo, and multi-agent
presence across several open web applications.

## Suggested demo flow

1. Open order `TS-1042` and show the normal order dashboard.
2. Start “Return an item” and show the UI morph into the focused refund surface.
3. Point out live tools, agent presence, and the semantic preview.
4. Change the refund destination from Visa to store credit as the human.
5. Check the approval box and commit the refund.
6. Briefly show that the same surface supports a shipping address update and a
   shipment cancellation.
