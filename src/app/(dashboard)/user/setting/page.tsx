"use client";
import { useTheme } from "@/contexts/ThemeContext";

export default function UserSetting() {
    const { theme } = useTheme();
    
    return (
        <div className="min-h-screen">
            <div className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/30 border-white'} border-1 px-4 py-3 rounded-lg`}>
                <div className="flex flex-col justify-center gap-4">
                    <h1 className="text-2xl text-red-500 font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>Danger Zone</h1>
                    <button className="border-1 border-red-500 rounded-lg text-red-500 font-semibold py-3 hover:bg-red-500/10 transition-all duration-300 cursor-pointer">Delete Account</button>
                </div>
            </div>
        </div>
    );
}