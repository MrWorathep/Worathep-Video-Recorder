import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worathep Video Recorder",
  description: "Video Recorder by Worathep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
