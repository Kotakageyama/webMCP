# TaskSurface

[日本語版 README](README.ja.md)

TaskSurface demonstrates a WebMCP-native collaborative UI: page capabilities
are the source of truth, an agent narrows the work into a task-specific surface,
and the merchant previews and explicitly commits the semantic change.

The MVP supports the three flows from the proposal: item refund, delivery address
change, and shipment cancellation. It exposes a focused UI, agent presence,
WebMCP capability names, and business-language previews rather than a chat sidebar.

On a WebMCP-enabled Chrome origin, `app/webmcp.ts` uses the Imperative API
(`document.modelContext.registerTool`) to register only the tools useful in the
current page/task state. In browsers without WebMCP the merchant UI remains fully
functional; the capability panel visibly explains the same task graph.

## Verify WebMCP

WebMCP site tools are not a ChatGPT connector or an item in the chat `+` menu.
They belong to the currently open page and are discovered by a WebMCP-aware
browser agent.

### ChatGPT desktop app

1. Open the Cloud Run URL in the ChatGPT desktop app's built-in browser.
2. Confirm **Browser settings → Permissions → Enable site tools** is enabled.
3. Check the arrow in the browser address bar. It lists the tools available on
   the current page state.
4. Ask ChatGPT to return the red T-shirt, change the delivery address, or
   cancel the shipment. The app intentionally exposes task-starting tools on
   the dashboard and only the relevant read/preparation tools after entering a
   task.

The in-page **Live WebMCP tools** panel is derived from the same tool-name
definition used for registration. Its status reports whether this browser
registered the tools, does not expose WebMCP, or returned a registration error.

### Google Chrome

Chrome verification confirms the page API, but it does not turn the site into a
ChatGPT custom app. Use Chrome 149 or newer, enable
`chrome://flags/#enable-webmcp-testing`, relaunch, then open the deployed URL.
Use Chrome DevTools' WebMCP tooling or the page's **Live WebMCP tools** status to
confirm that the dashboard exposes three task starters. Enter each task and
confirm that the exposed list changes to its task-specific tools.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without `DATABASE_URL`, the demo uses the same seeded order in memory. With a Neon
connection string, apply `db/schema.sql` using Neon SQL Editor or `psql "$DATABASE_URL" -f db/schema.sql`;
the app reads `orders` and writes approved actions to `task_actions`.

## Cloud Run + Neon

1. Create a Neon Postgres database and run `db/schema.sql`.
2. Put its pooled connection URL (including `sslmode=require`) in Secret Manager:
   `gcloud secrets create tasksurface-database-url --replication-policy=automatic` then add the value.
3. Create Artifact Registry repository `tasksurface` in the selected region.
4. Deploy with `make PROJECT_ID=... REGION=asia-northeast1 release`.

Cloud Run receives only the Secret Manager reference; `DATABASE_URL` is never baked into the image. The app uses Next.js standalone output and binds to Cloud Run's `PORT` (8080 by default).

## License

This project is licensed under the [MIT License](LICENSE).
