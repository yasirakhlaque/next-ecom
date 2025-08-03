"use client";
import { ToastMessageProps } from "@/types/types";
import { useTheme } from "@/contexts/ThemeContext";

export default function ToastMessage({ heading, info }: ToastMessageProps) {
    const { theme } = useTheme();
    
    return (
        <div className={`backdrop-blur-xl text-left border rounded-lg shadow-lg p-4 max-w-sm w-full pr-20 fadeIn transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-700/50 text-gray-100' 
                : 'bg-white/50 border-gray-200 text-gray-800'
        }`}>
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                Added to {heading}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {info} has been added to {heading}
            </p>
        </div>
    );
}

export function LoginToaster(){
    const { theme } = useTheme();
    
    return(
        <div className={`backdrop-blur-xl text-left border rounded-lg shadow-lg p-4 max-w-sm w-full pr-20 fadeIn transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-red-900/50 border-red-700/50 text-red-100' 
                : 'bg-red-50/50 border-red-200 text-red-800'
        }`}>
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>
                Please Login
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>
                Please Login to Perform this action
            </p>
        </div>
    )
}