import { BiTrendingUp } from "react-icons/bi";

export default function Loading(){
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center mt-8">
            <div className="flex justify-center items-center gap-2 border-1 border-white rounded-full p-2 font-semibold backdrop-blur-xl bg-white/40 w-60 float">
                <BiTrendingUp className="text-indigo-500" />
                <h4 className="text-sm">Loading Trending Products...</h4>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-5xl font-bold animate-pulse">Trending <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Products</span></h1>
            <p className="text-xl leading-relaxed text-wrap animate-pulse">Please wait while we fetch the latest trending products for you.</p>
        </div>
    );
}