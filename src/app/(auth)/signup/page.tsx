"use client"
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";

import { IoIosArrowRoundForward, IoIosEyeOff, IoMdEye } from "react-icons/io";

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const { data: session, status } = useSession();
    const [signUpSuccess, setSignUpSuccess] = useState("");
    const router = useRouter();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                })
            })
            if (response.ok) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                });
                setTimeout(() => {
                    setSignUpSuccess("User created successfully. Please log in.");
                    router.push('/login');
                }, 2500)
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.log("Invalid Response", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={`flex justify-center items-center h-screen transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
        }`}>
            <div className={`flex flex-col justify-center items-center backdrop-blur-sm border p-6 w-96 rounded-xl gap-4 shadow-xl transition-colors duration-300 ${
                theme === 'dark' 
                    ? 'bg-gray-900/30 border-gray-700/30' 
                    : 'bg-white/30 border-white/30'
            }`}>
                <form className="flex justify-center items-center flex-col gap-4 w-full" onSubmit={handleEmailSignUp}>
                    <div className="flex justify-center items-center gap-2">
                        <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                        <h1 className={`font-semibold text-xl transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                        }`} style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
                    </div>
                    
                    <div className="text-center">
                        <h1 className={`text-4xl font-semibold mb-2 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                        }`} style={{ fontFamily: 'var(--font-playfair)' }}>Join The Family</h1>
                        <p className={`transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Sign Up to continue shopping</p>
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className={`flex justify-center items-center gap-3 px-6 py-3 font-semibold text-sm transition-all duration-300 rounded-lg border w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                            theme === 'dark' 
                                ? 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50 text-gray-200' 
                                : 'bg-white hover:bg-gray-300 border-gray-200 text-gray-800'
                        }`}
                    >
                        <FaGoogle />
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
                    
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <label htmlFor="name" className={`font-semibold transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            placeholder="John Doe" 
                            className={`outline-none backdrop-blur-sm border px-3 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300 ${
                                theme === 'dark' 
                                    ? 'bg-gray-800/70 border-gray-600/40 text-gray-200 placeholder-gray-400' 
                                    : 'bg-white/70 border-white/40 text-gray-800 placeholder-gray-500'
                            }`}
                            value={formData.name} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
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
                            value={formData.email} 
                            onChange={handleChange} 
                            required
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
                                value={formData.password} 
                                onChange={handleChange} 
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setIsClicked(!isClicked)}
                                className={`transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {isClicked ? <IoIosEyeOff size={20} /> : <IoMdEye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    {signUpSuccess && (
                        <p className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>{signUpSuccess}</p>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="flex justify-center items-center gap-4 font-semibold rounded-lg px-8 py-3 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 group w-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                        {!isLoading && <IoIosArrowRoundForward size={24} className="group-hover:translate-x-2 transition-all duration-300" />}
                    </button>
                </form>
                
                <p className={`text-sm text-center transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Already Have An Account?{' '}
                    <Link href="/login" className="text-indigo-500 font-semibold hover:underline transition-all duration-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}