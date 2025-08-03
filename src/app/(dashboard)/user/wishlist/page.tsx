"use client"

import { StarRating } from "@/app/@ProductCard/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiTrash2, FiHeart } from "react-icons/fi";
import { useWishlist } from "@/contexts/WishlistContext";
import { useTheme } from "@/contexts/ThemeContext";
import { WishlistItem } from "@/types/types";
import Loading from "@/app/loading";

export default function UserWishlist() {
    const { data: session } = useSession();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { updateWishlistCount } = useWishlist();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchItems = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`/api/user/wishlist/${session.user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setWishlistItems(data.wishlistItems || []);
                } else {
                    setError("Failed to fetch wishlist items");
                }
            } catch (error) {
                console.error("Error While Fetching Data", error);
                setError("Error fetching wishlist items");
            } finally {
                setLoading(false);
            }
        }

        fetchItems();
    }, [session?.user?.id]);

    const handleRemoveItem = async (userId: string, productId: string) => {
        try {
            const response = await fetch(`/api/user/wishlist?userId=${userId}&productId=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setWishlistItems(prev => prev.filter(item => item.productId !== productId));
                updateWishlistCount();
            } else {
                console.error("Failed to remove item from wishlist");
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    if (loading) {
       return <Loading />
    }

    if (error) {
        return (
            <div className="min-h-screen m-10">
                <div className={`text-xl transition-colors duration-300 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-500'
                }`}>{error}</div>
            </div>
        )
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen m-10 flex flex-col items-center justify-center">
                <div className={`backdrop-blur-sm border rounded-2xl p-8 text-center shadow-xl transition-colors duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-900/30 border-gray-700/30' 
                        : 'bg-white/30 border-white/30'
                }`}>
                    <FiHeart size={64} className={`mx-auto mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <h1 className={`text-4xl font-semibold mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`} style={{ fontFamily: 'var(--font-playfair)' }}>Your Wishlist is Empty</h1>
                    <p className={`mb-6 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Start adding items you love to your wishlist</p>
                    <Link href="/products" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold">
                        Discover Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen m-10">
            <div className="mb-8">
                <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`} style={{ fontFamily: 'var(--font-playfair)' }}>Your Wishlist</h1>
                <p className={`transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{wishlistItems.length} item(s) saved for later</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    const finalPrice = product.price
                        ? product.price - (product.price * (product.discount || 0) / 100)
                        : product.price;

                    return (
                        <div key={item.id} className={`backdrop-blur-sm border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:scale-105 group relative ${
                            theme === 'dark' 
                                ? 'bg-gray-900/30 border-gray-700/30 hover:bg-gray-800/40' 
                                : 'bg-white/30 border-white/30 hover:bg-white/40'
                        }`}>
                            {/* Remove button */}
                            <button
                                onClick={() => handleRemoveItem(item.userId, item.productId)}
                                className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${
                                    theme === 'dark' 
                                        ? 'bg-red-900/60 hover:bg-red-800/80 text-red-200' 
                                        : 'bg-red-500/80 hover:bg-red-600 text-white'
                                } backdrop-blur-sm`}
                            >
                                <FiTrash2 size={16} />
                            </button>

                            <div className="h-64 w-full overflow-hidden p-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-4">
                                <h4 className="text-indigo-500 text-sm font-semibold mb-1">{product.category}</h4>
                                <Link href={`/product/${product.id}`}>
                                    <h2 className={`text-lg font-semibold mb-2 group-hover:text-indigo-600 transition-all duration-300 ${
                                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                                    }`}>
                                        {product.name}
                                    </h2>
                                </Link>

                                {/* Star Rating */}
                                <StarRating rating={product.rating || 0} />

                                <div className="flex gap-4 items-center mt-4">
                                    <span className="text-xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        ${finalPrice?.toFixed(2)}
                                    </span>
                                    {product.price && product.price !== finalPrice && (
                                        <span className={`line-through text-xs transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                    {product.discount && (
                                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                                            {product.discount}% Off
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}