# Layouts

## `app/layout.tsx`

Root HTML and global stylesheet shell.

```tsx
import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "TaskSurface", description: "A shared task surface for humans and agents" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
```

## `app/security-lab/layout.tsx`

Route-local layout that imports the Security Lab stylesheet.

```tsx
import "./security.css";
export default function SecurityLabLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
```
