# TaskSurface

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
