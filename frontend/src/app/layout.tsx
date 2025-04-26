import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ImageProvider } from "@/providers/ImageProvider";
import Header from "@/components/layout/Header";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASA Kerala - Japan Alumni Association of Kerala",
  description: "Japan Alumni Association of Kerala - A platform for individuals who have studied, trained, or worked in Japan and are now back in Kerala",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ImageProvider initialFallbackMode={process.env.NODE_ENV === 'development'}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <ConditionalFooter />
            </div>
            <SpeedInsights />
            <Analytics />
          </ImageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
