import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.capybarahq.com"),
  title: "Capybara · 一个企业所有人一起养大的智能体平台",
  description: "Capybara 是开源、可自托管的企业智能体平台。装在你自己的服务器上，连着公司里的系统和人；谁都可以给它加插件、写技能。",
  alternates: { canonical: "https://www.capybarahq.com/" },
  openGraph: {
    title: "Capybara",
    description: "The open-source, self-hosted agent platform your whole company raises together.",
    url: "https://www.capybarahq.com/",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Applies the stored theme before the first paint; no stored choice means follow the system.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
