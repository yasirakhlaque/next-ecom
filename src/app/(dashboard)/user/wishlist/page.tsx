"use client"

import { StarRating } from "@/app/@ProductCard/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiTrash2 } from "react-icons/fi";
import { useWishlist } from "@/contexts/WishlistContext";
import { WishlistItem } from "@/types/types";

export default function UserWishlist() {
    const { data: session } = useSession();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { updateWishlistCount } = useWishlist();

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
        return (
            <div className="min-h-screen m-10">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen m-10">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen m-10">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <Link href="/products" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen m-10">
            <h1 className="text-2xl font-semibold mb-6">Your Wishlist ({wishlistItems.length} items)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    const finalPrice = product.price
                        ? product.price - (product.price * (product.discount || 0) / 100)
                        : product.price;

                    return (
                        <div key={item.id} className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:scale-105 group relative">
                            {/* Remove button */}
                            <button
                                onClick={() => handleRemoveItem(item.userId, item.productId)}
                                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-300"
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
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-all duration-300">
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
                                        <span className="line-through text-xs text-gray-500">
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