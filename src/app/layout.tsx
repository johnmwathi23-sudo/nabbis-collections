import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AppProvider } from "../context/AppContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";

export const metadata: Metadata = {
  title: { default: "Nabbis Collections | Quality Is Not A Miss", template: "%s | Nabbis Collections" },
  description: "Shop quality products from trusted vendors across Kenya. Everything you need, all in one place. Fashion, beauty, home, fitness and more.",
  keywords: ["Kenya online shopping", "multi-vendor marketplace Kenya", "buy online Kenya", "Nabbis Collections"],
  openGraph: {
    title: "Nabbis Collections — Quality Is Not A Miss",
    description: "Kenya's trusted multi-vendor marketplace. Shop from verified vendors across all 47 counties.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <CartProvider>
            <WishlistProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
