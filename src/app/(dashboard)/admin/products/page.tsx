"use client"
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Product } from "@/types/types";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectOption, setSelectOption] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();

                if (response.ok) {
                    setProducts(data);
                } else {
                    setError(data.error || "Failed to fetch products");
                }
            } catch (err) {
                setError("Network error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen m-10">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Get unique categories for filter dropdown
    const categories = ["ALL", ...Array.from(new Set(products.map(product => product.category)))];

    return (
        <div className="min-h-screen m-10 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: "var(--font-playfair)" }}>Product Management</h1>
                <p className="text-gray-400 my-2">Manage your product catalog and inventory</p>
            </div>
            
            <div className="bg-white rounded-xl flex justify-center items-center px-6 py-10 relative">
                <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Search products...."
                    className="w-full outline-none border border-gray-300 rounded-lg px-4 py-2 text-xs"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                    className="flex gap-2 justify-center items-center px-4 py-2 rounded-lg text-nowrap text-xs"
                    onClick={() => setSelectOption(!selectOption)}
                >
                    <FaFilter />
                    Category : {selectedCategory}
                </button>
                {selectOption && (
                    <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-3 flex flex-col justify-center items-center absolute top-full right-2 z-10 mt-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setSelectOption(false);
                                }}
                                className={`hover:bg-gray-200 hover:text-gray-500 rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedCategory === category && "bg-purple-200 text-purple-500"}`}
                            >
                                {category === "ALL" ? "All Categories" : category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                    Products ({filteredProducts.length})
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Product</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Category</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Price</th>
                                <th className="text-center py-4 px-4 font-medium text-gray-500 text-sm">Stock</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Brand</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Size</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Created</th>
                                <th className="text-center py-4 px-4 font-medium text-gray-500 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => {
                                const discountedPrice = product.discount 
                                    ? product.price - (product.price * product.discount / 100)
                                    : product.price;

                                return (
                                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    ${discountedPrice.toFixed(2)}
                                                </span>
                                                {product.discount && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.stock > 10 
                                                    ? 'bg-green-100 text-green-700'
                                                    : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-600">{product.brand}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-600">{product.size}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-600">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="relative">
                                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                                    <BsThreeDotsVertical />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}