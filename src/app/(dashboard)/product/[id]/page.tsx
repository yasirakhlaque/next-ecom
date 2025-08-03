"use client"
import ReviewCard from "@/app/@ReviewCard/page";
import Loading from "@/app/loading";
import ToastMessage from "@/components/ToastMessage";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Review, WishlistItem } from "@/types/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaPlus } from 'react-icons/fa';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import AddReviewForm from "@/components/Forms/AddReview";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    brand: string;
    discount?: number;
    size: string;
    rating?: number;
    reviews?: Review[];
}

// Star Rating Component
const StarRating = ({ rating = 0 }: { rating: number }) => {
    const { theme } = useTheme();
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, index) => (
                <FaStar key={`full-${index}`} className="text-yellow-400 text-lg" />
            ))}
            {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-lg" />}
            {[...Array(emptyStars)].map((_, index) => (
                <FaRegStar key={`empty-${index}`} className="text-gray-300 text-lg" />
            ))}
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-2`}>({rating.toFixed(1)})</span>
        </div>
    );
};

export default function DetailedProductCard({ params }: { params: Promise<{ id: string }> }) {
    const { theme } = useTheme();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [wishlistToaster, setWishlistToaster] = useState(false);
    const [cartToaster, setCartToaster] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [editReview, setEditReview] = useState<boolean | null>(null);

    const { updateWishlistCount } = useWishlist();
    const { updateCartCount } = useCart();
    const { data: session } = useSession();

    const handleWishlistToaster = () => {
        setWishlistToaster(true);
        setTimeout(() => {
            setWishlistToaster(false);
        }, 3000);
    }

    const handleCartToaster = () => {
        setCartToaster(true);
        setTimeout(() => {
            setCartToaster(false);
        }, 3000);
    }

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;

                const response = await fetch(`/api/product/${id}`);

                if (response.ok) {
                    const foundProduct: Product = await response.json();
                    setProduct(foundProduct);
                    setReviews(foundProduct.reviews || []);
                    setSelectedSize(foundProduct.size || "");
                    setNotFound(false);
                } else {
                    console.log("Failed to fetch product");
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [params]);

    // Check if product is in wishlist
    useEffect(() => {
        const fetchWishlistStatus = async () => {
            if (!session?.user?.id || !product?.id) return;

            try {
                const response = await fetch(`/api/user/wishlist/${session.user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const isProductWishlisted = data.wishlistItems?.some(
                        (item: WishlistItem) => item.product?.id === product.id
                    );
                    setIsWishlisted(isProductWishlisted || false);
                    setWishlistItems(data.wishlistItems || []);
                }
            } catch (error) {
                console.error("Error fetching wishlist status:", error);
            }
        };

        fetchWishlistStatus();
    }, [session?.user?.id, product?.id]);

    const handleCartAdd = async () => {
        if (!session?.user?.id) {
            console.log("Please log in to add items to cart");
            return;
        }

        if (!product) {
            console.error("No product selected");
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
                    productId: product.id,
                    size: selectedSize
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
                    console.error("Failed to add item to cart:", data.error);
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    const handleWishlistToggle = async () => {
        if (!session?.user?.id) {
            console.log("Please log in to manage wishlist");
            return;
        }

        if (!product) {
            console.error("No product selected");
            return;
        }

        try {
            if (isWishlisted) {
                // Remove from wishlist
                const response = await fetch(`/api/user/wishlist?userId=${session.user.id}&productId=${product.id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setIsWishlisted(false);
                    updateWishlistCount();
                    console.log("Removed from wishlist");
                } else {
                    console.error("Failed to remove from wishlist");
                }
            } else {
                // Add to wishlist
                const response = await fetch(`/api/user/wishlist`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session.user.id,
                        productId: product.id
                    })
                });

                if (response.ok) {
                    setIsWishlisted(true);
                    handleWishlistToaster();
                    updateWishlistCount();
                } else {
                    const data = await response.json();
                    console.error("Failed to add to wishlist:", data.error);
                }
            }
        } catch (error) {
            console.error("Error managing wishlist:", error);
        }
    };

    // Loading state
    if (loading) {
        return <Loading />
    }

    // Not found state
    if (notFound || !product) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            }`}>
                <div className={`text-center ${
                    theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700/50' 
                        : 'bg-white/30 border-white/30'
                } backdrop-blur-sm border rounded-2xl p-8 shadow-xl`}>
                    <h1 className={`text-3xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`} style={{ fontFamily: 'var(--font-playfair)' }}>
                        Product Not Found
                    </h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Calculate final price
    const finalPrice = product.price - (product.price * (product.discount || 0) / 100);
    const hasDiscount = product.discount && product.discount > 0;

    return (
        <>
            <div className={`min-h-screen ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            } px-4 py-8`}>
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Product Details Section */}
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${
                        theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-700/50' 
                            : 'bg-white/30 border-white/30'
                    } backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden`}>
                        {/* Product Image */}
                        <div className="p-6">
                            <div className="h-96 lg:h-[500px] w-full overflow-hidden rounded-xl">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-block bg-indigo-100 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
                                    {product.category}
                                </span>
                            </div>

                            <h1 className={`text-3xl lg:text-4xl font-bold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                            } mb-4`} style={{ fontFamily: 'var(--font-playfair)' }}>
                                {product.name}
                            </h1>

                            <div className="mb-4">
                                <StarRating rating={product.rating || 0} />
                            </div>

                            <p className={`${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            } text-lg leading-relaxed mb-6`}>
                                {product.description}
                            </p>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    ${finalPrice.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="line-through text-xl text-gray-500">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-red-500 bg-red-100 px-3 py-1 rounded-full font-medium">
                                            {product.discount}% Off
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <label className={`block text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                } mb-2`}>Size</label>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className={`w-full border ${
                                        theme === 'dark' 
                                            ? 'border-gray-600 bg-gray-700 text-gray-200' 
                                            : 'border-gray-300 bg-white text-gray-800'
                                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                >
                                    <option value={product.size}>{product.size}</option>
                                    {/* Add more sizes if needed */}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className={`${
                                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'
                                } rounded-lg p-3`}>
                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Brand:</span>
                                    <p className={`font-medium ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                    }`}>{product.brand || "N/A"}</p>
                                </div>
                                <div className={`${
                                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'
                                } rounded-lg p-3`}>
                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Stock:</span>
                                    <p className={`font-medium ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                    }`}>{product.stock} available</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleCartAdd}
                                    disabled={product.stock === 0}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${product.stock === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                                        }`}
                                >
                                    <FiShoppingBag />
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>

                                <button
                                    onClick={handleWishlistToggle}
                                    className={`${
                                        theme === 'dark' 
                                            ? 'bg-gray-700/50 border-gray-600/50' 
                                            : 'bg-white/50 border-white/40'
                                    } backdrop-blur-sm border py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                        isWishlisted 
                                            ? 'text-pink-600 bg-pink-50 border-pink-200' 
                                            : `${theme === 'dark' ? 'text-gray-200 hover:text-pink-600' : 'text-gray-700 hover:text-pink-600'}`
                                    }`}
                                >
                                    {isWishlisted ? <FaHeart /> : <FiHeart />}
                                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className={`${
                        theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-700/50' 
                            : 'bg-white/30 border-white/30'
                    } backdrop-blur-sm border rounded-2xl shadow-xl p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-2xl font-bold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                            } mb-6`} style={{ fontFamily: 'var(--font-playfair)' }}>
                                Customer Reviews ({reviews.length})
                            </h2>
                            <button className="flex items-center justify-center gap-3 bg-gradient-to-tl text-white text-sm font-semibold from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 cursor-pointer py-4 px-8 rounded-lg" onClick={() => setEditReview(true)}>
                                <FaPlus /> Add Review
                            </button>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review: Review, index: number) => (
                                    <ReviewCard
                                        key={`review-${index}`}
                                        name={review.userName || "Anonymous"}
                                        image={review.userImage || "/api/placeholder/50/50"}
                                        comment={review.text}
                                        rating={review.rating}
                                        likes={review.likes || 0}
                                        dislikes={review.dislikes || 0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className={`${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                } text-lg`}>No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toast Messages */}
                {wishlistToaster && (
                    <div className="fixed bottom-4 right-4 z-[9999]">
                        <ToastMessage heading="Added to Wishlist" info={product.name} />
                    </div>
                )}

                {cartToaster && (
                    <div className="fixed bottom-4 right-4 z-[9999]">
                        <ToastMessage heading="Added to Cart" info={product.name} />
                    </div>
                )}
            </div>
            <div>
                {editReview && (
                    <AddReviewForm
                        userId={session?.user?.id}
                        productId={product?.id}
                        onClose={() => setEditReview(false)}
                    />
                )}
            </div>
        </>
    );
}

export function RatingStars({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
    const { theme } = useTheme();
    
    return (
        <div className="flex items-center gap-1">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className={`text-2xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                >
                    <FaStar />
                </button>
            ))}
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-2`}>({value}/5)</span>
        </div>
    );
}