import HeroSection from "@/components/HeroSection";
import TrendingProduct from "./(components)/@TrendingProduct/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-2 py-2 text-gray-600">
      <HeroSection />
      <TrendingProduct />
    </div>
  );
}
