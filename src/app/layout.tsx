import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Linchpin Studio — Influencer reels that grow your brand",
  description:
    "We shoot, script, edit, and strategize premium influencer-led content for every social platform — built to grow your brand online, drive sales, and capture qualified leads.",
  keywords: ["influencer reels", "digital marketing", "video production", "reels", "short form content", "brand films", "social media marketing"],
  openGraph: {
    title: "Linchpin Studio — Influencer reels that grow your brand",
    description: "High-quality influencer reels built to grow your brand.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/lp-studio/css/tokens.css" />
        <link rel="stylesheet" href="/lp-studio/css/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
