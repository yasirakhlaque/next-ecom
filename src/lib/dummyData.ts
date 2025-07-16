export const DummyData = [
    {
        id: "1",
        name: "Luxury Bag",
        image: "https://i.pinimg.com/474x/d0/e1/2b/d0e12bf8758a3e14202010b2cad61d6c.jpg",
        description: "A premium leather bag that combines style and functionality.",
        category: "Accessories",
        brand: "LuxeBrand",
        size: "Medium",
        stock: 15,
        rating: 4.5,
        originalPrice: 250,
        discount: 20,
        price: 199,
        reviews: [
            {
                id: "r1",
                userName: "Sarah Johnson",
                userImage: "https://i.pravatar.cc/150?img=1",
                text: "Amazing quality bag! Really love the leather texture and spacious interior.",
                rating: 5,
                likes: 12,
                dislikes: 0,
                createdAt: "2024-01-15"
            },
            {
                id: "r2",
                userName: "Mike Chen",
                userImage: "https://i.pravatar.cc/150?img=2",
                text: "Good bag but slightly expensive. Quality is top-notch though.",
                rating: 4,
                likes: 8,
                dislikes: 1,
                createdAt: "2024-01-10"
            }
        ]
    },
    {
        id: "2",
        name: "Premium Watch",
        image: "https://i.pinimg.com/736x/8a/13/11/8a1311642bc58a1347829bbe35e92004.jpg",
        description: "A luxury watch with a classic design and modern features.",
        category: "Watches",
        brand: "TimeElite",
        size: "42mm",
        stock: 8,
        rating: 4.8,
        originalPrice: 350,
        discount: 15,
        price: 299,
        reviews: [
            {
                id: "r3",
                userName: "Emma Davis",
                userImage: "https://i.pravatar.cc/150?img=3",
                text: "Elegant design and keeps perfect time. Worth every penny!",
                rating: 5,
                likes: 15,
                dislikes: 0,
                createdAt: "2024-01-12"
            }
        ]
    },
    {
        id: "3",
        name: "Elegant Dress",
        image: "https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg",
        description: "A stunning dress perfect for any formal occasion.",
        category: "Clothing",
        rating: 4.7,
        originalPrice: 200,
        price: 249
    },
    {
        id: "4",
        name: "Designer Shoes",
        image: "https://i.pinimg.com/474x/28/38/aa/2838aab51d9395dcf3a59800d4698902.jpg",
        description: "Stylish shoes that offer both comfort and elegance.",
        category: "Footwear",
        rating: 4.6,
        originalPrice: 180,
        discount: 10,
        price: 159
    },
    {
        id: "5",
        name: "Luxury Sunglasses",
        image: "https://i.pinimg.com/474x/5b/d2/c9/5bd2c9abc116d0a5f438f82cb2b662fd.jpg",
        description: "Trendy sunglasses that provide UV protection and style.",
        category: "Accessories",
        rating: 4.4,
        originalPrice: 120,
        discount: 25,
        price: 89
    },
    {
        id: "6",
        name: "Chic Handbag",
        image: "https://i.pinimg.com/474x/d0/e1/2b/d0e12bf8758a3e14202010b2cad61d6c.jpg",
        description: "A chic handbag that complements any outfit.",
        category: "Accessories",
        rating: 4.3,
        originalPrice: 150,
        discount: 15,
        price: 120
    },
    {
        id: "7",
        name: "Stylish Jacket",
        image: "https://i.pinimg.com/736x/8a/13/11/8a1311642bc58a1347829bbe35e92004.jpg",
        description: "A stylish jacket that keeps you warm and fashionable.",
        category: "Clothing",
        rating: 4.5,
        originalPrice: 220,
        discount: 20,
        price: 199
    },
    {
        id: "8",
        name: "Luxury Perfume",
        image: "https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg",
        description: "A luxury perfume with a captivating fragrance.",
        category: "Fragrances",
        rating: 4.9,
        originalPrice: 100,
        discount: 10,
        price: 89
    }
];

export interface OrderData {
    id: string;
    userId: string;
    status: "PENDING" | "ACCEPTED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: number;
    address: string;
    createdAt: string;
    updatedAt: string;
    orderDetails: OrderDetailData[];
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
}

export interface OrderDetailData {
    id: string;
    orderId: string;
    productId: string;
    userId: string;
    quantity: number;
    priceAtPurchase: number;
    size?: string;
    product: {
        id: string;
        name: string;
        image: string;
        brand: string;
        category: string;
    };
}

export const OrdersDummyData: OrderData[] = [
    {
        id: "order_1",
        userId: "user_1",
        status: "DELIVERED",
        totalAmount: 249.99,
        address: "123 Main St, New York, NY 10001",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-18T16:45:00Z",
        user: {
            id: "user_1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            image: "https://i.pravatar.cc/150?img=1"
        },
        orderDetails: [
            {
                id: "detail_1",
                orderId: "order_1",
                productId: "prod_1",
                userId: "user_1",
                quantity: 1,
                priceAtPurchase: 199.99,
                size: "Medium",
                product: {
                    id: "prod_1",
                    name: "Luxury Leather Bag",
                    image: "https://i.pinimg.com/474x/d0/e1/2b/d0e12bf8758a3e14202010b2cad61d6c.jpg",
                    brand: "LuxeBrand",
                    category: "Accessories"
                }
            },
            {
                id: "detail_2",
                orderId: "order_1",
                productId: "prod_2",
                userId: "user_1",
                quantity: 1,
                priceAtPurchase: 50.00,
                size: "One Size",
                product: {
                    id: "prod_2",
                    name: "Silk Scarf",
                    image: "https://i.pinimg.com/474x/8a/13/11/8a1311642bc58a1347829bbe35e92004.jpg",
                    brand: "SilkCo",
                    category: "Accessories"
                }
            }
        ]
    },
    {
        id: "order_2",
        userId: "user_1",
        status: "SHIPPED",
        totalAmount: 299.99,
        address: "123 Main St, New York, NY 10001",
        createdAt: "2024-01-20T14:20:00Z",
        updatedAt: "2024-01-22T09:15:00Z",
        user: {
            id: "user_1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            image: "https://i.pravatar.cc/150?img=1"
        },
        orderDetails: [
            {
                id: "detail_3",
                orderId: "order_2",
                productId: "prod_3",
                userId: "user_1",
                quantity: 1,
                priceAtPurchase: 299.99,
                size: "42mm",
                product: {
                    id: "prod_3",
                    name: "Premium Watch",
                    image: "https://i.pinimg.com/736x/8a/13/11/8a1311642bc58a1347829bbe35e92004.jpg",
                    brand: "TimeElite",
                    category: "Watches"
                }
            }
        ]
    },
    {
        id: "order_3",
        userId: "user_1",
        status: "PENDING",
        totalAmount: 159.99,
        address: "123 Main St, New York, NY 10001",
        createdAt: "2024-01-25T11:45:00Z",
        updatedAt: "2024-01-25T11:45:00Z",
        user: {
            id: "user_1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            image: "https://i.pravatar.cc/150?img=1"
        },
        orderDetails: [
            {
                id: "detail_4",
                orderId: "order_3",
                productId: "prod_4",
                userId: "user_1",
                quantity: 2,
                priceAtPurchase: 79.99,
                size: "Large",
                product: {
                    id: "prod_4",
                    name: "Designer Sunglasses",
                    image: "https://i.pinimg.com/474x/c1/d2/e3/c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6.jpg",
                    brand: "SunStyle",
                    category: "Accessories"
                }
            }
        ]
    },
    {
        id: "order_4",
        userId: "user_1",
        status: "ACCEPTED",
        totalAmount: 449.99,
        address: "123 Main St, New York, NY 10001",
        createdAt: "2024-01-28T16:30:00Z",
        updatedAt: "2024-01-29T10:20:00Z",
        user: {
            id: "user_1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            image: "https://i.pravatar.cc/150?img=1"
        },
        orderDetails: [
            {
                id: "detail_5",
                orderId: "order_4",
                productId: "prod_5",
                userId: "user_1",
                quantity: 1,
                priceAtPurchase: 449.99,
                size: "Medium",
                product: {
                    id: "prod_5",
                    name: "Premium Jacket",
                    image: "https://i.pinimg.com/474x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg",
                    brand: "FashionElite",
                    category: "Clothing"
                }
            }
        ]
    },
    {
        id: "order_5",
        userId: "user_1",
        status: "CANCELLED",
        totalAmount: 89.99,
        address: "123 Main St, New York, NY 10001",
        createdAt: "2024-01-10T13:15:00Z",
        updatedAt: "2024-01-12T14:30:00Z",
        user: {
            id: "user_1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            image: "https://i.pravatar.cc/150?img=1"
        },
        orderDetails: [
            {
                id: "detail_6",
                orderId: "order_5",
                productId: "prod_6",
                userId: "user_1",
                quantity: 1,
                priceAtPurchase: 89.99,
                size: "One Size",
                product: {
                    id: "prod_6",
                    name: "Leather Wallet",
                    image: "https://i.pinimg.com/474x/b1/c2/d3/b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6.jpg",
                    brand: "LeatherCraft",
                    category: "Accessories"
                }
            }
        ]
    }
];