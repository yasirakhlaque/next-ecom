"use client";
import { BiTrendingUp } from "react-icons/bi";
import ProductCard from "../@ProductCard/page";
import { IoIosArrowRoundForward } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Loading from "./loading";

export default function TrendingProduct() {
    const [products, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/products");
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error("Not Found");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [])

    if (loading) {
        return <Loading />;
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center mt-8">
            <div className={`flex justify-center items-center gap-2 border rounded-full p-2 font-semibold backdrop-blur-xl w-60 float transition-colors duration-300 ${
                theme === 'dark' 
                    ? 'bg-gray-800/40 border-gray-700/40 text-gray-200' 
                    : 'bg-white/40 border-white text-gray-700'
            }`}>
                <BiTrendingUp className="text-indigo-500" />
                <h4 className="text-sm">What's Hot Right Now</h4>
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-playfair)' }} className={`text-5xl font-bold transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
                Trending <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Products</span>
            </h1>
            
            <p className={`text-xl leading-relaxed text-wrap transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
                Discover the most coveted items loved by our community of discerning shoppers
            </p>
            
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8 px-8 pt-10">
                {products.slice(0, 4).map((product, index) => <ProductCard key={index} product={product} />)}
            </div>
            
            <Link href={"/products"}>
                <button className={`backdrop-blur-xl px-6 py-3 rounded-full border font-semibold text-xs my-16 cursor-pointer flex gap-2 justify-center items-center group transition-all duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-800/20 border-gray-700/40 text-gray-200 hover:bg-gray-700/30' 
                        : 'bg-white/20 border-white text-gray-900 hover:bg-white/30'
                }`}>
                    View All Trending Products
                    <IoIosArrowRoundForward size={24} className="group-hover:translate-x-3 transition-all duration-300" />
                </button>
            </Link>
        </div>
    )
}