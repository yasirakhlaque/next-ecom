"use client"
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { FaFilter } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Product } from "@/types/types";
import EditProductForm from "@/components/Forms/EditProduct";

export default function Products() {
    const { theme } = useTheme();
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectOption, setSelectOption] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<boolean>(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        const response = await fetch(`/api/product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }

        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.error || "Failed to delete product");
            return;
        }
        setProducts(products.filter(product => product.id !== id));
    }

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

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
        };

        if (openMenuId) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenuId]);

    if (loading) {
        return (
            <div className="min-h-screen m-10">
                <div className={`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Loading...</div>
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
        <>
            <div className="min-h-screen m-10 flex flex-col gap-6">
                <div>
                    <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} style={{ fontFamily: "var(--font-playfair)" }}>Product Management</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} my-2`}>Manage your product catalog and inventory</p>
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-xl flex justify-center items-center px-6 py-10 relative`}>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        placeholder="Search products...."
                        className={`w-full outline-none border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-800'} rounded-lg px-4 py-2 text-xs`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button
                        className={`flex gap-2 justify-center items-center px-4 py-2 rounded-lg text-nowrap text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        onClick={() => setSelectOption(!selectOption)}
                    >
                        <FaFilter />
                        Category : {selectedCategory}
                    </button>
                    {selectOption && (
                        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border shadow-lg rounded-lg p-3 flex flex-col justify-center items-center absolute top-full right-2 z-10 mt-2`}>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setSelectOption(false);
                                    }}
                                    className={`${theme === 'dark' ? 'hover:bg-gray-700 hover:text-gray-300' : 'hover:bg-gray-200 hover:text-gray-500'} rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedCategory === category && "bg-purple-200 text-purple-500"} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                    {category === "ALL" ? "All Categories" : category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-8 shadow-sm`}>
                    <h1 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: "var(--font-playfair)" }}>
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
                                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                                    <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Product</th>
                                    <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
                                    <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Price</th>
                                    <th className={`text-center py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Stock</th>
                                    <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Brand</th>
                                    <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Size</th>
                                    <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Created</th>
                                    <th className={`text-center py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    const discountedPrice = product.discount
                                        ? product.price - (product.price * product.discount / 100)
                                        : product.price;

                                    return (
                                        <tr key={product.id} className={`border-b hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-50'}`}>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.name}</div>
                                                        <div className={`text-sm truncate max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {product.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        ${discountedPrice.toFixed(2)}
                                                    </span>
                                                    {product.discount && (
                                                        <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.stock > 10
                                                        ? theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                                                        : product.stock > 0
                                                            ? theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                                                            : theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{product.brand}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{product.size}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="relative">
                                                    <button
                                                        className={`p-1 hover:${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
                                                        onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                                                    >
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                    {openMenuId === product.id && (
                                                        <div className={`absolute right-0 mt-2 w-48 border rounded-md shadow-lg z-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                                            <ul className="py-1">
                                                                <li>
                                                                    <button
                                                                        className={`block px-4 py-2 text-sm w-full text-left hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                                                        onClick={() => {
                                                                            setEditingProductId(product.id); // Set which product to edit
                                                                            setEditForm(true); // Show the edit form
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className={`block px-4 py-2 text-sm w-full text-left hover:${theme === 'dark' ? 'bg-red-900' : 'bg-red-200'} ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}
                                                                        onClick={() => {
                                                                            handleDelete(product.id);
                                                                            console.log('Delete product:', product.id);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
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
            <div>
                {editForm && editingProductId && (
                    <EditProductForm
                        productId={editingProductId}
                        products={products}
                        setEditForm={setEditForm}
                    />
                )}
            </div>
        </>
    )
}