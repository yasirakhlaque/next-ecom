"use client";
import { Product } from "@/types/types";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function EditProductForm({ productId, products, setEditForm }: {
    productId: string; products: Product[];
    setEditForm: (value: boolean) => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { theme } = useTheme();
    
    const productToEdit = products.find(product => product.id === productId);
    
    if (!productToEdit) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    <p>Product not found</p>
                    <button onClick={() => setEditForm(false)}>Close</button>
                </div>
            </div>
        );
    }
    const [formData, setFormData] = useState({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
        image: productToEdit.image,
        discount: productToEdit.discount || 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' || name === 'discount' 
                ? parseFloat(value) || 0 
                : value
        }));
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");
        
        try {
            const response = await fetch(`/api/product/${productId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const updatedProduct = await response.json();
                setSuccessMessage("🎉 Product Updated Successfully! 🎉");
                setTimeout(() => {
                    setEditForm(false);
                    window.location.reload();
                }, 1500);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Failed to update product");
            }
        } catch (error) {
            setErrorMessage("Failed To Edit Product 💀");
            console.log("Failed To Edit", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-md border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-white/20'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Edit Product</h2>
                    <button
                        onClick={() => setEditForm(false)}
                        className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        ✕
                    </button>
                </div>

                {/* Move messages inside the modal */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleEdit} className="text-xs grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="name" className="text-gray-800 font-semibold">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="outline-none rounded-lg bg-white py-4 px-2 border border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="description" className="text-gray-800 font-semibold">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="outline-none rounded-lg bg-white py-4 px-2 border border-gray-300"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="price" className="text-gray-800 font-semibold">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="outline-none rounded-lg bg-white py-4 px-2 border border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="discount" className="text-gray-800 font-semibold">
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            name="discount"
                            id="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            className="outline-none rounded-lg bg-white py-4 px-2 border border-gray-300"
                        />
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="image" className="text-gray-800 font-semibold">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            id="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="outline-none rounded-lg bg-white py-4 px-2 border border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="stock" className="text-gray-800 font-semibold">
                            Stock
                        </label>
                        <input
                            type="number"
                            name="stock"
                            id="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            className="outline-none rounded-lg bg-white py-4 px-2 border border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end mt-6 col-span-2">
                        <button
                            type="button"
                            onClick={() => setEditForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-tr from-purple-500 to-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}