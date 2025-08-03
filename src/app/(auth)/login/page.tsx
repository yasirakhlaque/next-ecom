"use client"
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoIosArrowRoundForward, IoIosEyeOff, IoMdEye } from "react-icons/io";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export default function Login() {
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();
    const { theme } = useTheme();

    // Use useCallback to prevent recreation on every render
    const redirectToHome = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    }, []);

    // Redirect if already logged in - use a more stable approach
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // Use window.location for more reliable navigation
            redirectToHome();
        }
    }, [status, session, redirectToHome]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");
        try {
            const result = await signIn('google', {
                callbackUrl: '/',
                redirect: true, // Let NextAuth handle the redirect
            });
            
            // Don't call router.push here if redirect: true
        } catch (error) {
            console.error('Error during Google sign in:', error);
            setError('An error occurred during Google sign in');
            setIsLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.ok) {
                // Use window.location for more reliable redirect
                window.location.href = '/';
            } else {
                setError(result?.error || 'Invalid email or password');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
            setIsLoading(false);
        }
    };

    // Show loading state while session is loading
    if (status === "loading") {
        return (
            <div className={`flex justify-center items-center h-screen transition-colors duration-300 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            }`}>
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Don't render if already authenticated (prevents flash)
    if (status === "authenticated") {
        return (
            <div className={`flex justify-center items-center h-screen transition-colors duration-300 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            }`}>
                <div className="text-center">
                    <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Redirecting...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-center items-center h-screen transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
        }`}>
            <div className={`flex flex-col justify-center items-center backdrop-blur-sm border p-8 w-96 rounded-xl gap-4 shadow-xl transition-colors duration-300 ${
                theme === 'dark' 
                    ? 'bg-gray-900/30 border-gray-700/30' 
                    : 'bg-white/30 border-white/30'
            }`}>
                <div className="flex justify-center items-center gap-2">
                    <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                    <h1 className={`font-semibold text-xl transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`} style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
                </div>
                
                <div className="text-center">
                    <h1 className={`text-4xl font-semibold mb-2 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`} style={{ fontFamily: 'var(--font-playfair)' }}>Welcome Back</h1>
                    <p className={`transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>Sign in to your account to continue shopping</p>
                </div>

                {error && (
                    <div className={`w-full p-3 border rounded-lg text-sm transition-colors duration-300 ${
                        theme === 'dark' 
                            ? 'bg-red-900/30 border-red-700/50 text-red-200' 
                            : 'bg-red-100 border-red-300 text-red-700'
                    }`}>
                        {error}
                    </div>
                )}

                <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className={`flex justify-center items-center gap-3 px-6 py-3 font-semibold text-sm transition-all duration-300 rounded-lg border w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                        theme === 'dark' 
                            ? 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50 text-gray-200' 
                            : 'bg-white hover:bg-gray-300 border-gray-200 text-gray-800'
                    }`}
                >
                    <FaGoogle/>
                    {isLoading ? 'Signing in...' : 'Continue With Google'}
                </button>

                <div className="flex items-center w-full my-2">
                    <div className={`flex-1 border-t transition-colors duration-300 ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                    <span className={`px-3 text-sm transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>or continue with email</span>
                    <div className={`flex-1 border-t transition-colors duration-300 ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                </div>

                <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <label htmlFor="email" className={`font-semibold transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="john@example.com" 
                            className={`outline-none backdrop-blur-sm border px-3 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300 ${
                                theme === 'dark' 
                                    ? 'bg-gray-800/70 border-gray-600/40 text-gray-200 placeholder-gray-400' 
                                    : 'bg-white/70 border-white/40 text-gray-800 placeholder-gray-500'
                            }`}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <label htmlFor="password" className={`font-semibold transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>Password</label>
                        <div className={`backdrop-blur-sm border px-3 py-3 rounded-lg flex justify-between items-center focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-300 ${
                            theme === 'dark' 
                                ? 'bg-gray-800/70 border-gray-600/40' 
                                : 'bg-white/70 border-white/40'
                        }`}>
                            <input 
                                type={isClicked ? "text" : "password"} 
                                name="password" 
                                id="password" 
                                placeholder="Enter Your Password" 
                                className={`outline-none bg-transparent flex-1 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-200 placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                                }`}
                                required
                                disabled={isLoading}
                            />
                            <button 
                                type="button"
                                onClick={() => setIsClicked(!isClicked)}
                                className={`transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                }`}
                                disabled={isLoading}
                            >
                                {isClicked ? <IoIosEyeOff size={20} /> : <IoMdEye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="flex justify-center items-center gap-4 font-semibold rounded-lg px-8 py-3 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 group w-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        {!isLoading && <IoIosArrowRoundForward size={24} className="group-hover:translate-x-2 transition-all duration-300" />}
                    </button>
                </form>

                <p className={`text-sm text-center transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Don't Have An Account?{' '}
                    <Link href="/signup" className="text-indigo-500 font-semibold hover:underline transition-all duration-300">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}