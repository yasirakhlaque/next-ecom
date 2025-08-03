import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import RatingStars from "../RatingStar";

export default function AddReviewForm({ userId, productId, onClose }: { userId?: string, productId?: string, onClose: () => void }) {
    const { theme } = useTheme();
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReviewText(e.target.value);
    };

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!userId || !productId || !reviewText.trim() || rating <= 0) {
            setErrorMessage("Please fill all fields correctly and provide a rating.");
            return;
        }

        setIsSubmitting(true);

        try {
            const reviewData = {
                userId,
                productId,
                reviewText: reviewText.trim(),
                rating
            };

            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                setSuccessMessage("Review added successfully! 🎉");
                setReviewText("");
                setRating(0);

                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Failed to add review: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            setErrorMessage("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${
                theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
            } rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`}>Add a Review</h3>
                    <button
                        onClick={onClose}
                        className={`${
                            theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        } text-xl`}
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        } mb-2`}>
                            Your Review
                        </label>
                        <textarea
                            className={`w-full border ${
                                theme === 'dark' 
                                    ? 'border-gray-600 bg-gray-700 text-gray-200' 
                                    : 'border-gray-300 bg-white text-gray-800'
                            } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            rows={4}
                            placeholder="Write your review here..."
                            value={reviewText}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <RatingStars value={rating} onChange={handleRatingChange} />
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } rounded-lg transition-colors`}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}