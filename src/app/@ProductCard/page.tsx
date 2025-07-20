"use client"
import ToastMessage from '@/components/ToastMessage';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductCardProps, WishlistItem } from '@/types/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from 'react-icons/fa';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

// Star Rating Component
export const StarRating = ({ rating = 0 }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1 mb-2">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, index) => (
                <FaStar key={`full-${index}`} className="text-yellow-400 text-sm" />
            ))}

            {/* Half Star */}
            {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}

            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <FaRegStar key={`empty-${index}`} className="text-gray-300 text-sm" />
            ))}

            <span className="text-xs text-gray-600 ml-1">({rating.toFixed(1)})</span>
        </div>
    );
};

export default function ProductCard({ product }: { product: ProductCardProps }) {
    let finalPrice = product.price ? product.price - (product.price * (product.discount || 0) / 100) : product.price;
    const [isHovered, setIsHovered] = useState(false);
    const [wishlistToaster, setWishlistToaster] = useState(false);
    const [cartToaster, setCartToaster] = useState(false);
    const { data: session } = useSession();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isWishlisted, setIsWishListed] = useState(false);
    const { updateWishlistCount } = useWishlist();
    const { refreshCart, updateCartCount } = useCart();


    useEffect(() => {
        const fetchWishlist = async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const response = await fetch(`/api/user/wishlist/${session.user.id}`);
                if (!response.ok) throw new Error('Failed to fetch wishlist');
                const data = await response.json();
                setWishlistItems(data.wishlistItems || []);

                const isProductWishlisted = data.wishlistItems?.some((item: WishlistItem) =>
                    item.product?.id === product.id
                );
                setIsWishListed(isProductWishlisted || false);
            } catch (error) {
                setError("Error fetching wishlist");
            } finally {
                setLoading(false);
            }
        }
        fetchWishlist();
    }, [session?.user?.id, product.id])

    const handleAddWishlist = async () => {
        if (!session?.user?.id) {
            console.log("Please log in to add items to wishlist");
            return;
        }

        const isAlreadyInWishlist = wishlistItems.some(item =>
            item.product?.id === product.id
        );

        if (isAlreadyInWishlist) {
            console.log("Item already in wishlist");
            return;
        }
        try {
            const addWishlist = await fetch(`/api/user/wishlist`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    productId: product.id
                })
            });

            if (addWishlist.ok) {
                setWishlistToaster(true);
                setTimeout(() => {
                    setWishlistToaster(false);
                }, 3000);
                updateWishlistCount();
                setIsWishListed(true);
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    }

    const handleRemoveItem = async (userId: string, productId: string) => {
        try {
            const response = await fetch(`/api/user/wishlist?userId=${userId}&productId=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setWishlistItems(prev => prev.filter(item => item.productId !== productId));
                updateWishlistCount();
                setIsWishListed(false);
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };


    const handleCartAdd = async () => {
        if (!session?.user?.id) {
            console.log("Please log in to add items to cart");
            return;
        }

        try {
            const response = await fetch(`/api/user/cart`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    productId: product.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                handleCartToaster();
                updateCartCount();
            } else {
                if (data.maxStockReached) {
                    console.log(data.error);
                } else {
                    console.error("Failed to add item to cart");
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }
    const handleCartToaster = () => {
        setCartToaster(true);
        setTimeout(() => {
            setCartToaster(false);
        }, 3000);
    }

    return (
        <>
            <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:scale-105 group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <div className='relative'>
                    {
                        isHovered &&
                        <div className='absolute z-50 top-2 right-2 p-2 flex flex-col gap-2 text-gray-900'>
                            {isWishlisted ?
                                <FaHeart size={35} className='bg-white rounded-full p-2 text-pink-600 cursor-pointer' onClick={() => handleRemoveItem(session?.user?.id || '', product.id)} />
                                :
                                <FiHeart size={35} className='bg-white rounded-full p-2 hover:text-pink-600 transition-all duration-300 cursor-pointer' onClick={handleAddWishlist} />
                            }
                            <FiShoppingBag size={35} className='bg-white rounded-full p-2 hover:text-blue-600 transition-all duration-300 cursor-pointer' onClick={handleCartAdd} />
                        </div>
                    }
                </div>

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
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-all duration-300">{product.name}</h2>
                    </Link>

                    {/* Star Rating */}
                    <StarRating rating={product.rating || 0} />

                    <div className="flex gap-4 items-center mt-4">
                        <span className="text-xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                            ${finalPrice.toFixed(2)}
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

            {/* Toast Messages - Positioned relative to viewport */}
            {wishlistToaster && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <ToastMessage heading={"Wishlist"} info={product.name} />
                </div>
            )}

            {cartToaster && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <ToastMessage heading={"Cart"} info={product.name} />
                </div>
            )}
        </>
    );
}