import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";

import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hcloud-js.nilovon.com"),
  title: {
    default: "hcloud-js - TypeScript SDK for the Hetzner Cloud API",
    template: "%s | hcloud-js",
  },
  description:
    "Modern TypeScript SDK for the Hetzner Cloud API: fully typed and validated, with auto-pagination, action waiting, retries and typed errors.",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
