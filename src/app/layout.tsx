import type { Metadata } from "next";
import { inter } from '@/components/common/fonts';
import "./globals.css";
import Header from "@/components/layout/Header";
import { getSession } from "../lib/session";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Easy Sakan",
  description: "A platform for booking premium properties and accommodations",
};

// Mark this layout as dynamic since it uses cookies() via getSession()
export const dynamic = "force-dynamic";

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
        <Header isAuthenticated={isAuthenticated} userRole={session?.role} token={session?.token} userName={session?.name} />
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
