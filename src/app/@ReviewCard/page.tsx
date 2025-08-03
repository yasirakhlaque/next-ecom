"use client";
import { Reviews } from "@/types/types";
import { BsHandThumbsDown, BsHandThumbsUp } from "react-icons/bs";
import { useTheme } from "@/contexts/ThemeContext";

export default function ReviewCard({ name, image, rating, comment, likes, dislikes }: Reviews) {
    const { theme } = useTheme();
    
    return (
        <div className={`p-4 rounded-lg shadow-md backdrop-blur-md border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'}`}>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-20 w-20">
                    <img src={image} alt={name} className="rounded-full h-[100%] w-[100%] object-cover" />
                </div>
                <div>
                    <h4 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</h4>
                </div>
            </div>
            <div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} style={{ fontFamily: 'var(--font-playfair)' }}>{comment}</p>
            </div>
            <div className="flex gap-4 items-center mt-2">
                <h6 className={`flex gap-1 items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><BsHandThumbsUp />{likes}</h6>
                <h6 className={`flex gap-1 items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><BsHandThumbsDown /> {dislikes}</h6>
            </div>
        </div>
    );
}