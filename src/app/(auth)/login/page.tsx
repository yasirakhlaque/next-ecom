"use client"
import Link from "next/link";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoIosArrowRoundForward, IoIosEyeOff, IoMdEye } from "react-icons/io";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signIn('google', {
                callbackUrl: '/',
                redirect: false,
            });
            
            if (result?.ok) {
                router.push('/');
            } else {
                console.error('Sign in failed');
            }
        } catch (error) {
            console.error('Error during sign in:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle email/password sign in here if needed
        // This would require additional setup for credentials provider
    };

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="flex flex-col justify-center items-center bg-white/30 backdrop-blur-sm border border-white/30 p-8 w-96 rounded-xl gap-4 shadow-xl">
                <div className="flex justify-center items-center gap-2">
                    <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                    <h1 className="text-gray-800 font-semibold text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
                </div>
                
                <div className="text-center">
                    <h1 className="text-4xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account to continue shopping</p>
                </div>

                <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="flex justify-center items-center gap-3 px-6 py-3 font-semibold text-sm bg-white hover:bg-gray-300 transition-all duration-300 rounded-lg border border-gray-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaGoogle/>
                    {isLoading ? 'Signing in...' : 'Continue With Google'}
                </button>

                <div className="flex items-center w-full my-2">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-600">or continue with email</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <label htmlFor="email" className="font-semibold text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="john@example.com" 
                            className="outline-none bg-white/70 backdrop-blur-sm border border-white/40 px-3 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <label htmlFor="password" className="font-semibold text-gray-700">Password</label>
                        <div className="bg-white/70 backdrop-blur-sm border border-white/40 px-3 py-3 rounded-lg flex justify-between items-center focus-within:ring-2 focus-within:ring-indigo-500">
                            <input 
                                type={isClicked ? "text" : "password"} 
                                name="password" 
                                id="password" 
                                placeholder="Enter Your Password" 
                                className="outline-none bg-transparent flex-1" 
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setIsClicked(!isClicked)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {isClicked ? <IoIosEyeOff size={20} /> : <IoMdEye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        className="flex justify-center items-center gap-4 font-semibold rounded-lg px-8 py-3 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 group w-full transition-all duration-300"
                    >
                        Sign In
                        <IoIosArrowRoundForward size={24} className="group-hover:translate-x-2 transition-all duration-300" />
                    </button>
                </form>

                <p className="text-sm text-center">
                    Don't Have An Account?{' '}
                    <Link href="/signup" className="text-indigo-500 font-semibold hover:underline transition-all duration-300">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}