"use client";
import HeroSection from "@/components/HeroSection";
import TrendingProduct from "./@TrendingProduct/page";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen px-2 py-2 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-gray-100' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-600'
    }`}>
      <HeroSection />
      <TrendingProduct />
    </div>
  );
}
