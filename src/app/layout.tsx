import type { Metadata } from "next";
import { inter } from '@/components/common/fonts';
import "./globals.css";
import Header from "@/components/layout/Header";
import { getSession } from "../lib/session";

export const metadata: Metadata = {
  title: "Easy Sakan",
  description: "A platform for booking premium properties and accommodations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const isAuthenticated = !!session;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <Header isAuthenticated={isAuthenticated} userRole={session?.role} />
        {children}
      </body>
    </html>
  );
}
