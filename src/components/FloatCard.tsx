"use client";
import { useTheme } from "@/contexts/ThemeContext";

export default function FloatCard({ img, name, price }: { img: string, name: string, price: string }) {
    const { theme } = useTheme();
    
    return (
        <div className={`px-4 py-3 flex justify-center items-center gap-3 float rounded-lg backdrop-blur-xl transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gray-900/50 border border-gray-700/30' 
                : 'bg-white/50 border border-white/30'
        }`}>
            <div className="h-15 w-15 overflow-hidden">
                <img src={img} alt="cloth Image" className="h[100%] w-[100%] object-cover rounded-lg" />
            </div>
            <div>
                <h1 className={`text-sm font-semibold transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>{name}</h1>
                <p className="text-indigo-600 font-bold text-sm">${price}</p>
            </div>
        </div>
    )
}