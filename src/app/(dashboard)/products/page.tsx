"use client";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Product } from "@/types/types";
import { useTheme } from "@/contexts/ThemeContext";
import ProductCard from "@/app/@ProductCard/page";
import Loading from "@/app/loading";

// Custom Select Component
const CustomSelect = ({ value, onChange, options }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className="relative w-full">
            {/* Select Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3 rounded-lg backdrop-blur-sm border flex items-center justify-between font-medium hover:bg-opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs ${
                    theme === 'dark' 
                        ? 'bg-gray-800/30 border-gray-700/40 text-gray-200 hover:bg-gray-700/40' 
                        : 'bg-white/30 border-white/40 text-gray-700 hover:bg-white/40'
                }`}
            >
                <span>{selectedOption?.label}</span>
                <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 z-50 backdrop-blur-xl border rounded-lg shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 ${
                    theme === 'dark' 
                        ? 'bg-gray-900/90 border-gray-700/50' 
                        : 'bg-white/90 border-white/50'
                }`}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full p-3 text-left text-xs font-medium transition-all duration-200 hover:text-indigo-500 ${
                                value === option.value
                                    ? `${theme === 'dark' 
                                        ? 'bg-indigo-900/20 text-indigo-400 border-l-4 border-indigo-400' 
                                        : 'bg-indigo-500/10 text-indigo-600 border-l-4 border-indigo-500'
                                    }`
                                    : `${theme === 'dark' 
                                        ? 'text-gray-300 hover:bg-gray-800/60' 
                                        : 'text-gray-700 hover:bg-indigo-500/20'
                                    }`
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
    const { theme } = useTheme();

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
       return <Loading />
    }

    return (
        <div className={`min-h-screen px-2 py-2 transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-gray-200' 
                : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-600'
        }`}>
            <h1 className={`text-4xl font-bold text-center my-8 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`} style={{ fontFamily: 'var(--font-playfair)' }}>
                Products Collection
            </h1>
            <div className="px-8 pt-10">
                <div className="flex items-center justify-between">
                    <h1 className={`text-xl md:text-3xl font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`} style={{ fontFamily: 'var(--font-playfair)' }}>All Products</h1>
                    <div className="mb-6 flex items-center justify-end gap-4 flex-wrap">
                        <p className={`font-medium text-nowrap transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Sort by:</p>
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