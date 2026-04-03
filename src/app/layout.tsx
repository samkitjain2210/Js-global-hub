import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "JS Global Hub - Your One-Stop Online Store",
  description:
    "Shop electronics, fashion, home & kitchen, fitness, beauty & more at JS Global Hub. Best prices with COD available across India. Your trusted online shopping destination.",
  keywords: [
    "online store",
    "electronics",
    "fashion",
    "home & kitchen",
    "fitness",
    "beauty",
    "earbuds",
    "t-shirt",
    "backpack",
    "JS Global Hub",
    "COD",
    "India",
  ],
  authors: [{ name: "JS Global Hub" }],
  icons: {
    icon: "/jsglobalhub-logo.jpg",
  },
  openGraph: {
    title: "JS Global Hub - Your One-Stop Online Store",
    description:
      "Shop everything you love — electronics, fashion, home, fitness, beauty & more. Best prices with COD across India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
