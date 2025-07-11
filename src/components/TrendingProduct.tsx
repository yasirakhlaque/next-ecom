import { BiTrendingUp } from "react-icons/bi";
import ProductCard from "./ProductCard"
import { DummyData } from "@/lib/dummyData";

export default function TrendingProduct() {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center">
            <div className="flex justify-center items-center gap-2 border-1 border-white rounded-full p-2 font-semibold backdrop-blur-xl bg-white/40 w-60 float">
                <BiTrendingUp className="text-indigo-500" />
                <h4 className="text-sm">What's Hot Right Now</h4>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-5xl font-bold">Trending <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Products</span></h1>
            <p className="text-xl leading-relaxed text-wrap">Discover the most coveted items loved by our community of discerning shoppers</p>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8 px-8 pt-10">
                {DummyData.map((product, index) => <ProductCard key={index} product={product} />)}
            </div>
        </div>
    )
}