"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface WishlistContextType {
    wishlistCount: number;
    updateWishlistCount: () => void;
    refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [wishlistCount, setWishlistCount] = useState(0);

    const fetchWishlistCount = async () => {
        if (!session?.user?.id) {
            setWishlistCount(0);
            return;
        }

        try {
            const response = await fetch(`/api/user/wishlist/${session.user.id}`);
            if (response.ok) {
                const data = await response.json();
                setWishlistCount(data.wishlistItems?.length || 0);
            } else {
                setWishlistCount(0);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setWishlistCount(0);
        }
    };

    useEffect(() => {
        if (status !== "loading") {
            fetchWishlistCount();
        }
    }, [session?.user?.id, status]);

    const updateWishlistCount = () => {
        fetchWishlistCount();
    };

    const refreshWishlist = () => {
        fetchWishlistCount();
    };

    return (
        <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount, refreshWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}