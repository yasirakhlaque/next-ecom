"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { CartContextType } from "@/types/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [cartItemsCount, setCartItemsCount] = useState<number>(0);

    const fetchCartItems = async () => {
        if (!session?.user?.id) {
            setCartItemsCount(0);
            return;
        }

        try {
            const response = await fetch(`/api/user/cart?userId=${session.user.id}`);
            if (response.ok) {
                const data = await response.json();
                setCartItemsCount(data.cartItems?.length || 0);
            } else {
                setCartItemsCount(0);
                console.error("Failed to fetch cart items");
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItemsCount(0);
        }
    }

    // Initialize cart count when session is available
    useEffect(() => {
        if (status !== "loading") {
            fetchCartItems();
        }
    }, [session?.user?.id, status]);

    const updateCartCount = () => {
        fetchCartItems();
    }

    const refreshCart = () => {
        fetchCartItems();
    }

    return (
        <CartContext.Provider value={{ cartItemsCount, updateCartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}