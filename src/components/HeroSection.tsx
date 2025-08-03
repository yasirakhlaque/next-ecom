"use client";
import { IoIosArrowRoundForward } from "react-icons/io";
import { LuSparkles } from "react-icons/lu";
import { useTheme } from "@/contexts/ThemeContext";
import FloatCard from "./FloatCard";

export default function HeroSection() {
    const { theme } = useTheme();
    
    return (
        <div className="grid md:grid-cols-2 px-8 pt-10 grid-cols-1 gap-8 md:gap-4">
            <div className="space-y-6 flex flex-col">
                <div className={`flex justify-center items-center gap-2 border rounded-full p-2 font-semibold backdrop-blur-xl w-60 float transition-colors duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-800/40 border-gray-700/40 text-gray-200' 
                        : 'bg-white/40 border-white text-gray-700'
                }`}>
                    <LuSparkles className="text-indigo-500" />
                    <h4 className="text-sm">New Collection Available</h4>
                </div>
                
                <h1 className={`sm:text-7xl text-5xl font-bold flex gap-2 flex-col transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`} style={{ fontFamily: 'var(--font-playfair)' }}>
                    Discover <span className="bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent">Premium</span> Elegance
                </h1>
                
                <p className={`text-md md:text-lg leading-relaxed transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Experience luxury shopping redefined. Curated collections that blend timeless sophistication with modern innovation.
                </p>
                
                <button className="flex justify-center items-center gap-4 font-semibold rounded-lg px-8 py-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-800 group transition-all duration-300">
                    Explore Collection 
                    <IoIosArrowRoundForward size={24} className="group-hover:translate-x-2 transition-all duration-300" />
                </button>

                <div className="flex items-center pt-8 flex-wrap justify-center md:justify-start gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>10K+</div>
                        <div className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                        }`}>Happy Customers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>500+</div>
                        <div className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                        }`}>Premium Products</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>99%</div>
                        <div className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                        }`}>Satisfaction Rate</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center relative">
                <div className="h-120 w-120 overflow-hidden">
                    <img src="https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg" alt="cloth Image" className="h[100%] w-[100%] object-cover rounded-lg" />
                </div>
                <div className="absolute top-0 left-0">
                    <FloatCard name="Luxry Bag" img="https://i.pinimg.com/474x/d0/e1/2b/d0e12bf8758a3e14202010b2cad61d6c.jpg" price="199" />
                </div>
                <div className="absolute bottom-0 right-0">
                    <FloatCard name="Premium Watch" img="https://i.pinimg.com/736x/8a/13/11/8a1311642bc58a1347829bbe35e92004.jpg" price="299" />
                </div>
            </div>
        </div>
    )
}