import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freshers Party 2026 — Mechanical Engineering",
  description:
    "You're invited to the Mechanical Engineering Freshers Party 2026. Where gears turn and legends begin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
