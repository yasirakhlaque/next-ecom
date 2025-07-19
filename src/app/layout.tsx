import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/providers/auth-provider";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ThemeProvider from "@/contexts/ThemeContext";
import CartProvider from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Luxe",
  description: "An Ecommerce Platform, great expereince for great Users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}  >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ThemeProvider>
                <Navbar />
                {children}
              </ThemeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
