import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MobileDrawer from "@/components/layout/MobileDrawer";
import JsonLd, { medflowAppSchema } from "@/components/layout/JsonLd";
import { ThemeProvider } from "@/lib/themeContext";
import { NavProvider } from "@/lib/navContext";

const BASE_URL = "https://medflow.panditsumit0.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | MedFlow",
    default: "MedFlow — Regional Medicine Shortage Intelligence",
  },
  description:
    "MedFlow monitors medicine inventory across Rajasthan healthcare facilities, predicts shortage risks before they spread, and recommends stock redistribution routes.",
  keywords: [
    "medicine shortage", "healthcare inventory", "Rajasthan",
    "drug supply chain", "shortage prediction", "MedFlow",
  ],
  authors: [{ name: "MedFlow Team" }],
  creator: "MedFlow",
  publisher: "MedFlow",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "MedFlow",
    title: "MedFlow — Regional Medicine Shortage Intelligence",
    description:
      "Predicts medicine shortage risks before they spread and recommends where available stock can be redistributed.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MedFlow Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedFlow — Regional Medicine Shortage Intelligence",
    description: "Predicts medicine shortage risks and recommends redistribution.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body
        className="min-h-full flex flex-row"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-1)" }}
      >
        <JsonLd data={medflowAppSchema} />
        <ThemeProvider>
          <NavProvider>
            {/* Desktop sidebar — hidden on mobile via Sidebar component */}
            <Sidebar />

            {/* Mobile slide-in drawer — hidden on desktop */}
            <MobileDrawer />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
              <Header />

              <main className="flex-1 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 overflow-y-auto">
                <Breadcrumbs />
                {children}
              </main>

              <Footer />
            </div>
          </NavProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
