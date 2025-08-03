import { useTheme } from "@/contexts/ThemeContext";
import { FaStar } from "react-icons/fa";


export default function RatingStars({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
    const { theme } = useTheme();
    
    return (
        <div className="flex items-center gap-1">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className={`text-2xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                >
                    <FaStar />
                </button>
            ))}
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-2`}>({value}/5)</span>
        </div>
    );
}