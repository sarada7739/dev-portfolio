import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Noto_Sans_JP,
  Shippori_Mincho,
} from "next/font/google";
import { site } from "@/data";
import "./globals.css";

// 日本語フォントは subsets に japanese が無いため latin を指定し、CJK は unicode-range 分割で配信される
const serifJp = Shippori_Mincho({
  variable: "--font-serif-jp",
  weight: ["500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const sansJp = Noto_Sans_JP({
  variable: "--font-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const serifLatin = Cormorant_Garamond({
  variable: "--font-serif-latin",
  weight: ["500", "600"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    locale: "ja_JP",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${serifJp.variable} ${sansJp.variable} ${serifLatin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
