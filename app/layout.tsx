import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "TaskSurface", description: "A shared task surface for humans and agents" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
