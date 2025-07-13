"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/app/(components)/@ProductCard/page";
import { FiChevronDown } from "react-icons/fi";

// Define the Product type
interface Product {
    id: string;
    name: string;
    price: number;
    rating?: number;
    brand: string;
    image: string;
    description: string;
    size: string;
    category: string;
    stock: number;
    discount?: number | null;
    createdAt: string;
    updatedAt: string;
}

// Custom Select Component
const CustomSelect = ({ value, onChange, options }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className="relative w-full max-w-xs">
            {/* Select Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-50 p-3 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 
                         flex items-center justify-between text-gray-700 font-medium
                         hover:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
                <span>{selectedOption?.label}</span>
                <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 
                              bg-white/90 backdrop-blur-xl border border-white/50 rounded-lg shadow-2xl shadow-black/20
                              overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full p-3 text-left text-xs font-medium transition-all duration-200
                                      hover:bg-indigo-500/20 hover:text-indigo-700
                                      ${value === option.value
                                    ? 'bg-indigo-500/10 text-indigo-600 border-l-4 border-indigo-500'
                                    : 'text-gray-700'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default function ProductsPage() {
    const [sortOption, setSortOption] = useState("A-Z");
    const [products, setProducts] = useState<Product[]>([]); // ✅ Added type annotation
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/products");
                if (response.ok) {
                    const data: Product[] = await response.json(); // ✅ Added type annotation
                    setProducts(data);
                } else {
                    console.log("Failed to fetch products");
                }
            } catch (err) {
                console.log("Network error occurred");
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortOptions = [
        { value: "A-Z", label: "Name (A-Z)" },
        { value: "Z-A", label: "Name (Z-A)" },
        { value: "Low-High", label: "Price (Low to High)" },
        { value: "High-Low", label: "Price (High to Low)" },
        { value: "Rating", label: "Rating (High to Low)" },
        { value: "Newest", label: "Newest First" }
    ];

    const getSortedProducts = (sortType: string): Product[] => { // ✅ Added return type
        const sortedData = [...products];

        switch (sortType) {
            case "A-Z":
                return sortedData.sort((a, b) => a.name.localeCompare(b.name));
            case "Z-A":
                return sortedData.sort((a, b) => b.name.localeCompare(a.name));
            case "Low-High":
                return sortedData.sort((a, b) => a.price - b.price);
            case "High-Low":
                return sortedData.sort((a, b) => b.price - a.price);
            case "Rating":
                return sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case "Newest":
                return sortedData.reverse();
            default:
                return sortedData;
        }
    };

    const handleSortChange = (newSortOption: string) => {
        setSortOption(newSortOption);
    };

    const sortedProducts = getSortedProducts(sortOption);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-2 py-2 text-gray-600">
            <h1 className="text-4xl font-bold text-center my-8 text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                Products Collection
            </h1>
            <div className="px-8 pt-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>All Products</h1>
                    <div className="mb-6 flex items-center gap-4">
                        <p className="text-gray-700 font-medium text-nowrap">Sort by:</p>
                        <CustomSelect
                            value={sortOption}
                            onChange={handleSortChange}
                            options={sortOptions}
                        />
                    </div>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8">
                    {sortedProducts.map((product, index) => (
                        <ProductCard key={`${product.id || product.name}-${index}`} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}