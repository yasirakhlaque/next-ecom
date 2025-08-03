'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function AddProductForm() {
    const { data: session, status } = useSession();
    const { theme } = useTheme();
    const [role, setRole] = useState<string>("");
    const [isLoadingRole, setIsLoadingRole] = useState(true);

    // Move all useState hooks to the top
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: '',
        brand: '',
        discount: '',
        size: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getRole = async () => {
            if (session?.user?.id) {
                try {
                    const res = await fetch(`/api/user/${session.user.id}/role`);
                    if (res.ok) {
                        const data = await res.json();
                        setRole(data.role);
                    } else {
                        console.error("Failed to fetch user role");
                    }
                } catch (error) {
                    console.error("Error fetching role:", error);
                }
            }
            setIsLoadingRole(false);
        };

        if (status !== "loading") {
            getRole();
        }
    }, [session?.user?.id, status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    image: formData.image,
                    category: formData.category,
                    stock: parseInt(formData.stock),
                    brand: formData.brand,
                    discount: formData.discount ? parseInt(formData.discount) : null,
                    size: formData.size
                }),
            });

            if (response.ok) {
                alert('Product added successfully!');
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    image: '',
                    category: '',
                    stock: '',
                    brand: '',
                    discount: '',
                    size: ''
                });
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while session or role is loading
    if (status === "loading" || isLoadingRole) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!session) {
        redirect('/');
        return null;
    }

    // Redirect if not admin
    if (role !== "ADMIN") {
        redirect('/');
        return null;
    }

    return (
        <div className={`min-h-screen flex items-center justify-center py-10 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
            <div className={`p-8 rounded-lg w-full max-w-md text-xs backdrop-blur-md border ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700 shadow-2xl' : 'bg-white/80 border-white/20 shadow-xl'}`}>
                <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'var(--font-playfair)' }}>Add New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <div className='flex justify-center items-center gap-2'>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price"
                            step="0.01"
                            required
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                        />
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="Discount Percentage if any"
                            min="0"
                            max="100"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                        />
                    </div>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Image URL"
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Brand"
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="Size"
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="In Stock"
                        min="0"
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        rows={4}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'}`}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 ${theme === 'dark' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {isLoading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}