"use client"
import ReviewCard from "@/app/@ReviewCard/page";
import ToastMessage from "@/components/ToastMessage";
import { Review } from "@/types/types";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

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
    originalPrice?: number;
    reviews?: Review[];
}

// Star Rating Component
const StarRating = ({ rating = 0 }: { rating: number }) => {
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
            <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
        </div>
    );
};

export default function DetailedProductCard({ params }: { params: Promise<{ id: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [wishlistToaster, setWishlistToaster] = useState(false);
    const [cartToaster, setCartToaster] = useState(false);

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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;
                
                // Fetch single product by ID
                const response = await fetch(`/api/product/${id}`);
                
                if (response.ok) {
                    const foundProduct: Product = await response.json();
                    setProduct(foundProduct);
                    setReviews(foundProduct.reviews || []);
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

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
            </div>
        );
    }

    // Not found state
    if (notFound || !product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
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
    const finalPrice = product.originalPrice
        ? product.originalPrice - (product.originalPrice * (product.discount || 0) / 100)
        : product.price;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
            {/* Rest of your JSX remains the same */}
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-xl overflow-hidden">
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

                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {product.name}
                        </h1>

                        <div className="mb-4">
                            <StarRating rating={product.rating || 0} />
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                                ${finalPrice.toFixed(2)}
                            </span>
                            {product.originalPrice && product.originalPrice !== finalPrice && (
                                <span className="line-through text-xl text-gray-500">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                            {product.discount && (
                                <span className="text-sm text-red-500 bg-red-100 px-3 py-1 rounded-full font-medium">
                                    {product.discount}% Off
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="bg-white/50 rounded-lg p-3">
                                <span className="text-gray-500">Brand:</span>
                                <p className="font-medium text-gray-800">{product.brand || "N/A"}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <span className="text-gray-500">Size:</span>
                                <p className="font-medium text-gray-800">{product.size || "N/A"}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <span className="text-gray-500">Stock:</span>
                                <p className="font-medium text-gray-800">{product.stock || "N/A"} available</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <span className="text-gray-500">Rating:</span>
                                <p className="font-medium text-gray-800">{product.rating || "N/A"}/5</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2" onClick={handleCartToaster}>
                                <FiShoppingBag />
                                Add to Cart
                            </button>
                            <button className="bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 py-3 px-6 rounded-lg font-medium hover:text-pink-600 transition-all duration-300 flex items-center justify-center gap-2" onClick={handleWishlistToaster}>
                                <FiHeart />
                                Wishlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Customer Reviews ({reviews.length})
                    </h2>

                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review: Review, index: number) => (
                                <ReviewCard
                                    key={`review-${index}`}
                                    name={review.userName || "Anonymous"}
                                    image={review.userImage || ""}
                                    comment={review.text}
                                    rating={review.rating}
                                    likes={review.likes || 0}
                                    dislikes={review.dislikes || 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Messages */}
            {wishlistToaster && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <ToastMessage heading="Wishlist" info={`${product.name} added to wishlist`} />
                </div>
            )}

            {cartToaster && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <ToastMessage heading="Cart" info={`${product.name} added to cart`} />
                </div>
            )}
        </div>
    );
}