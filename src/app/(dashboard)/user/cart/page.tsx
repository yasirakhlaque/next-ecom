"use client"
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiShoppingBag, FiMinus, FiPlus } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
        stock: number;
        brand: string;
        discount: number | null;
        size: string;
        rating: number | null;
    };
    createdAt: string;
    updatedAt: string;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const { data: session } = useSession();
    const { theme } = useTheme();
    const { updateCartCount } = useCart();

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!session?.user?.id) return;
            try {
                setLoading(true);
                const response = await fetch(`/api/user/cart?userId=${session.user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setCartItems(data.cartItems || []);
                } else {
                    console.error("Failed to fetch cart items");
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [session?.user?.id]);

    const handleQuantityChange = async (productId: string, action: 'increase' | 'decrease') => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(`/api/user/cart`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    productId,
                    action
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.removed) {
                    setCartItems(prev => prev.filter(item => item.productId !== productId));
                } else {
                    setCartItems(prev => prev.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: data.cartItem.quantity }
                            : item
                    ));
                    updateCartCount();
                }
                setError("");
            } else {
                if (data.maxStockReached) {
                    setError(data.error);
                    // Clear error after 3 seconds
                    setTimeout(() => setError(""), 3000);
                } else {
                    console.error("Failed to update quantity:", data.error);
                }
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(`/api/user/cart?userId=${session.user.id}&productId=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCartItems(prev => prev.filter(item => item.productId !== productId));
                updateCartCount();
            } else {
                console.error("Failed to remove item");
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.price;
            const discount = item.product.discount || 0;
            const finalPrice = price - (price * discount / 100);
            return total + (finalPrice * item.quantity);
        }, 0);
    };

    if (!session || !session.user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className={`${theme === 'dark'
                    ? 'bg-gray-900/30 border-gray-700/30 text-gray-100'
                    : 'bg-white/30 border-white/30 text-gray-700'
                    } backdrop-blur-sm border rounded-lg py-12 px-30 flex flex-col justify-center items-center gap-4`}>
                    <FiShoppingBag size={50} />
                    <h1 className="text-4xl font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>Please Log In</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>You need to be logged in to view your cart.</p>
                    <Link href={"/login"}>
                        <button className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg px-3 py-2 text-white">Log In</button>
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className={`text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>Loading...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen py-10 flex justify-center">
                <div className={`${theme === 'dark'
                    ? 'bg-gray-900/30 border-gray-700/30 text-gray-100'
                    : 'bg-white/30 border-white/30 text-gray-700'
                    } backdrop-blur-sm border rounded-lg px-10 flex flex-col justify-center items-center gap-4`}>
                    <FiShoppingBag size={50} />
                    <h1 className="text-4xl font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>Your Cart Is Empty</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Looks like you haven't added any items to your cart yet.</p>
                    <Link href={"/products"}>
                        <button className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg px-3 py-2 text-white cursor-pointer">Continue Shopping</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen m-10">
            <div className="w-full">
                <h1 className={`text-4xl font-bold my-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`} style={{ fontFamily: 'var(--font-playfair)' }}>Shopping Cart</h1>
                <p className={`my-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{cartItems.length} item(s) in your cart</p>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="flex flex-col gap-6 px-4 py-4">
                            {cartItems.map(item => (
                                <CartCard
                                    key={item.id}
                                    prod={item}
                                    onQuantityChange={handleQuantityChange}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80">
                        <div className={`${theme === 'dark'
                            ? 'bg-gray-900/30 border-gray-700/30'
                            : 'bg-white/30 border-white/30'
                            } backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/10 p-6`}>
                            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Order Summary</h2>

                            <div className="space-y-2 mb-4">
                                <div className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span>Subtotal:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <hr className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
                                <div className={`flex justify-between font-bold text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                    <span>Total:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg px-4 py-3 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CartCard({
    prod,
    onQuantityChange,
    onRemove
}: {
    prod: CartItemProps;
    onQuantityChange: (productId: string, action: 'increase' | 'decrease') => void;
    onRemove: (productId: string) => void;
}) {
    const { theme } = useTheme();

    const finalPrice = prod.product.price - (prod.product.price * (prod.product.discount || 0) / 100);
    const isAtMaxStock = prod.quantity >= prod.product.stock;
    const isOutOfStock = prod.product.stock <= 0;

    return (
        <div className={`${theme === 'dark'
            ? 'bg-gray-900/30 border-gray-700/30'
            : 'bg-white/20 border-white/30'
            } backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/10 p-6 flex items-center gap-4`}>

            <div className="h-32 w-32 overflow-hidden flex-shrink-0">
                <img src={prod.product.image} alt={prod.product.name} className="h-full w-full object-cover rounded-lg" />
            </div>

            <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{prod.product.name}</h2>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{prod.product.description}</p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Category: {prod.product.category}</p>

                        {/* Stock Warning */}
                        {isOutOfStock && (
                            <p className="text-xs text-red-500 font-semibold mt-1">Out of Stock</p>
                        )}
                        {isAtMaxStock && !isOutOfStock && (
                            <p className="text-xs text-orange-500 font-semibold mt-1">Maximum stock reached</p>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(prod.productId)}
                        className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark'
                            ? 'bg-gray-800 hover:text-red-400 hover:bg-red-900/20'
                            : 'bg-white hover:text-red-600 hover:bg-red-200'
                            }`}
                    >
                        <RxCross2 />
                    </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-indigo-600">${finalPrice.toFixed(2)}</span>
                            {prod.product.discount && (
                                <>
                                    <span className={`line-through text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                        ${prod.product.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                                        {prod.product.discount}% Off
                                    </span>
                                </>
                            )}
                        </div>
                        <span className={`text-sm ${prod.product.stock <= 5
                                ? 'text-orange-500 font-semibold'
                                : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {prod.product.stock <= 0
                                ? 'Out of Stock'
                                : `Stock: ${prod.product.stock} ${prod.product.stock <= 5 ? '(Low Stock!)' : ''}`
                            }
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onQuantityChange(prod.productId, 'decrease')}
                            className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            <FiMinus size={16} />
                        </button>

                        <span className={`px-4 py-2 rounded-lg font-semibold min-w-[3rem] text-center ${theme === 'dark'
                            ? 'bg-gray-800 text-gray-100'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {prod.quantity}
                        </span>

                        <button
                            onClick={() => onQuantityChange(prod.productId, 'increase')}
                            disabled={isAtMaxStock || isOutOfStock}
                            className={`p-2 rounded-full transition-all duration-300 ${isAtMaxStock || isOutOfStock
                                    ? 'opacity-50 cursor-not-allowed bg-gray-300'
                                    : theme === 'dark'
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            <FiPlus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}