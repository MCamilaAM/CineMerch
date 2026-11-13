import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsDebugger from "@/components/AnalyticsDebugger";
import ToastContainer from "@/components/ToastContainer";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CineMerch | Tienda Especializada en Ediciones Físicas y Merchandising de Cine",
  description:
    "CineMerch: Catálogo curado en 4K Ultra HD, Steelbooks exclusivos, kits temáticos y figuras oficiales en Cartagena y Colombia. Sincronizado con TMDB, simulación académica de Wompi y Google Analytics 4.",
  keywords: [
    "CineMerch",
    "4K UHD Colombia",
    "Steelbooks Cartagena",
    "Blu-ray",
    "Wompi",
    "Universidad de Cartagena",
    "Coleccionismo de Cine",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-parchment-50 text-zinc-900 antialiased selection:bg-cine-700 selection:text-white min-h-screen flex flex-col">
        {/* Google Analytics 4 Script */}
        <GoogleAnalytics />

        <CartProvider>
          {/* Top Navbar */}
          <Navbar />

          {/* Toast notifications */}
          <ToastContainer />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Slide-out Cart Drawer */}
          <CartDrawer />

          {/* Footer */}
          <Footer />

          {/* Real-time GA4 Event Inspector & Debugger for testing & presentation */}
          <AnalyticsDebugger />
        </CartProvider>
      </body>
    </html>
  );
}
