"use client"

import Loading from "@/app/loading";
import { CartItemProps } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { BsTruck } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";

interface ShippingInfo {
    name: string;
    email: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
}

export default function Checkout() {
    const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        name: '',
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
    });
    const { data: session } = useSession();
    const router = useRouter();

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

    // Pre-fill user email if available
    useEffect(() => {
        if (session?.user?.email && !shippingInfo.email) {
            setShippingInfo(prev => ({
                ...prev,
                email: session.user.email!,
                name: session.user.name || ''
            }));
        }
    }, [session, shippingInfo.email]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.price;
            const discount = item.product.discount || 0;
            const finalPrice = price - (price * discount / 100);
            return total + (finalPrice * item.quantity);
        }, 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCompleteOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            const requiredFields = ['name', 'email', 'streetAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
            const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo]);

            if (missingFields.length > 0) {
                alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
                setIsSubmitting(false);
                return;
            }

            const orderData = {
                items: cartItems,
                shippingInfo,
                total: calculateTotal()
            };

            const response = await fetch('/api/user/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Order placed successfully! Order ID: ${result.orderId}`);
                router.push('/user/order');
            } else {
                throw new Error(result.error || 'Failed to place order');
            }

        } catch (error) {
            console.error('Error placing order:', error);
            alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loading />
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen m-4 md:m-10 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h1>
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg px-6 py-3 text-white font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen m-4 md:m-10">
            <button
                className="flex justify-center items-center gap-2 text-blue-500 text-sm my-3 hover:text-blue-600 transition-colors"
                onClick={() => router.back()}
            >
                <LuArrowLeft />Back to cart
            </button>

            <h1 className="text-4xl font-bold text-gray-700 my-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Checkout
            </h1>

            <form onSubmit={handleCompleteOrder}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="col-span-2 p-4 bg-white/30 border border-white rounded-xl">
                        <h1 className="text-2xl font-bold text-gray-800 my-2 flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
                            <BsTruck className="text-blue-500" />Shipping Information
                        </h1>

                        <div className="gap-4 text-sm grid grid-cols-2">
                            <div className="flex flex-col gap-2 col-span-2">
                                <label htmlFor="name" className="font-bold">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="John Doe"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2 col-span-2">
                                <label htmlFor="email" className="font-bold">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="johndoe@example.com"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2 col-span-2">
                                <label htmlFor="streetAddress" className="font-bold">Street Address *</label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    id="streetAddress"
                                    placeholder="123 Main Street"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.streetAddress}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="city" className="font-bold">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    placeholder="New York"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="state" className="font-bold">State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    placeholder="NY"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="zipCode" className="font-bold">ZIP Code *</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    placeholder="10001"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.zipCode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="phoneNumber" className="font-bold">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    placeholder="(555) 123-4567"
                                    className="outline-none py-4 px-3 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    value={shippingInfo.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/30 border border-white rounded-xl">
                        <h1 className="text-2xl font-bold text-gray-700" style={{ fontFamily: "var(--font-playfair)" }}>
                            Order Summary
                        </h1>

                        {cartItems.map((item) => (
                            <CheckoutCard prod={item} key={item.id} />
                        ))}

                        <div className="flex flex-col gap-2 mt-4">
                            <h1 className="flex justify-between items-center">
                                Sub Total
                                <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                            </h1>
                            <h1 className="flex justify-between items-center text-green-500">
                                Shipping
                                <span>Free</span>
                            </h1>
                            <h1 className="flex justify-between items-center font-bold text-xl">
                                Total Cost
                                <span>${calculateTotal().toFixed(2)}</span>
                            </h1>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex justify-center items-center gap-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg py-4 text-white cursor-pointer my-2 text-sm w-full font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaLock className="group-hover:scale-115 transition-transform" />
                            {isSubmitting ? 'Processing...' : 'Complete Order'}
                        </button>

                        <div className="text-xs text-gray-500 text-center mt-2">
                            <p>🔒 Your payment information is secure and encrypted</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

function CheckoutCard({ prod }: { prod: CartItemProps }) {
    const finalPrice = prod.product.price - (prod.product.price * (prod.product.discount || 0) / 100);

    return (
        <div className="flex justify-between items-center p-3 my-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center gap-2">
                <img
                    src={prod.product.image}
                    alt={prod.product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                    <h2 className="text-sm font-semibold">{prod.product.name}</h2>
                    <h3 className="text-gray-400 text-xs">Qty: {prod.quantity}</h3>
                    {prod.product.discount && (
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                            {prod.product.discount}% Off
                        </span>
                    )}
                </div>
            </div>
            <div className="text-right">
                <h1 className="font-bold">${(finalPrice * prod.quantity).toFixed(2)}</h1>
                {prod.product.discount && (
                    <p className="text-xs text-gray-500 line-through">
                        ${(prod.product.price * prod.quantity).toFixed(2)}
                    </p>
                )}
            </div>
        </div>
    )
}