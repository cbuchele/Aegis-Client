import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://aegis.ai"),
  title: "Aegis AI",
  description: "Aegis AI is a minimalistic MCP client with a good feature set.",
  openGraph: {
    siteName: "Aegis AI",
    url: "https://aegis.ai",
    images: [
      {
        url: "https://aegis.ai/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegis AI",
    description: "Aegis AI is a minimalistic MCP client with a good feature set.",
    images: ["https://aegis.ai/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <div className="flex h-dvh w-full">
            <ChatSidebar />
            <main className="flex-1 flex flex-col relative">
              <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger>
                  <button className="flex items-center justify-center h-8 w-8 bg-muted hover:bg-accent rounded-md transition-colors">
                    <Menu className="h-4 w-4" />
                  </button>
                </SidebarTrigger>
              </div>
              <div className="flex-1 flex justify-center">
                {children}
              </div>
            </main>
          </div>
        </Providers>
        <Analytics />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="1373896a-fb20-4c9d-b718-c723a2471ae5" />
      </body>
    </html>
  );
}
