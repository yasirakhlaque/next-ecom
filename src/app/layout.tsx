import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/providers/auth-provider";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ThemeProvider from "@/contexts/ThemeContext";
import CartProvider from "@/contexts/CartContext";
import BodyWrapper from "@/components/BodyWrapper";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Luxe - Premium E-commerce",
  description: "Premium products for luxury lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <BodyWrapper>
                <Navbar />
                {children}
              </BodyWrapper>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}
