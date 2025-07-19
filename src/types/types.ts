export interface ProductCardProps {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    category?: string;
    rating?: number;
    originalPrice?: number;
    discount?: number | null;
    brand: string;
    size: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
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

export interface ToastMessageProps {
    heading: string;
    info: string;
}

export interface CartItemProps {
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

export interface CartContextType {
    cartItemsCount: number;
    updateCartCount: () => void;
    refreshCart: () => void;
}

export interface WishlistContextType {
    wishlistCount: number;
    updateWishlistCount: () => void;
    refreshWishlist: () => void;
}

export interface Reviews {
    name: string,
    image: string,
    rating: number,
    comment: string,
    likes: number,
    dislikes: number,
}

export interface Product {
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
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    createdAt: string;
    orders: { totalAmount: number; status: string }[];
}

export interface Review {
    id: string;
    rating: number;
    text: string;
    userName?: string;
    userImage?: string;
    likes?: number;
    dislikes?: number;
}