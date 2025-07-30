"use client"
import { userData } from "@/types/types";
import { useSession } from "next-auth/react";
import { useState } from "react";


export default function EditProfileForm({ userData, setEditForm, onUpdate }: {
    userData: userData | null; setEditForm: (value: boolean) => void; onUpdate: () => void;
}) {
    const { data: session, update: updateSession } = useSession();
    const [submitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Add controlled state for form data
    const [formData, setFormData] = useState({
        name: userData?.name || session?.user?.name || '',
        email: userData?.email || session?.user?.email || '',
        image: session?.user?.image || ''
    });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch(`/api/user/${session?.user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    image: formData.image
                }), // Remove id from body since it's in the URL
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setSuccessMessage("Profile updated successfully! 🎉");

                // Update session
                await updateSession({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                        image: formData.image
                    }
                });

                setTimeout(() => {
                    setEditForm(false);
                    onUpdate(); // Call the update callback instead of reloading
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorMessage("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
                    <button
                        onClick={() => setEditForm(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded-lg mb-4 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Form for editing user profile */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-white px-3 py-4 rounded-lg outline-none border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            className="bg-gray-100 px-3 py-4 rounded-lg outline-none border border-gray-300"
                            disabled
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="image" className="text-sm font-medium text-gray-700">Profile Image URL</label>
                        <input
                            type="url"
                            name="image"
                            id="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="bg-white px-3 py-4 rounded-lg outline-none border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="https://example.com/your-image.jpg"
                        />
                    </div>

                    {/* Image Preview */}
                    {formData.image && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Preview:</label>
                            <div className="flex justify-center">
                                <img
                                    src={formData.image}
                                    alt="Profile preview"
                                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg";
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setEditForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 rounded-lg disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}