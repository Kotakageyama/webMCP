# Page dependency trees

## `/` (TaskSurface)

Entry: `app/page.tsx`

Dependencies:
- `app/task-surface.tsx`
  - `app/webmcp.ts`
  - `lib/order.ts`
- `lib/db.ts`
  - `lib/order.ts`
- `app/styles.css`
- `app/layout.tsx`

## `/security-lab` (Security Lab)

Entry: `app/security-lab/page.tsx`

Dependencies:
- `app/security-lab/security-lab.tsx`
- `app/security-lab/security.css`
- `app/security-lab/layout.tsx`
- global CSS variables from `app/styles.css`
