"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsBoxArrowRight } from "react-icons/bs"
import { FaRegUserCircle, FaSearch } from "react-icons/fa"
import { FaBoxesStacked } from "react-icons/fa6"
import { FiHeart, FiMoon, FiSun, FiUser } from "react-icons/fi"
import { IoSettingsOutline } from "react-icons/io5"
import { LuShoppingBag } from "react-icons/lu"
import { useSession, signOut } from "next-auth/react"
import { useWishlist } from "@/contexts/WishlistContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useCart } from "@/contexts/CartContext"

export default function Navbar() {
    const { data: session, status } = useSession();
    const [role, setRole] = useState<string>("");
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [selectedOption, setSelectedOption] = useState(false);
    
    const { wishlistCount } = useWishlist();
    const { cartItemsCount } = useCart();
    const { theme, toggleTheme } = useTheme();

    let NavLinks = [
        { name: "Home", link: "/" },
        { name: "Products", link: "/products" },
        { name: "Categories", link: "/categories" },
        { name: "About", link: "/about" },
    ]

    const handleLogout = async () => {
        try {
            await signOut({
                callbackUrl: '/',
                redirect: true,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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



    return (
        <nav className={`sticky top-5 z-50 backdrop-blur-xl ${theme === 'dark' 
            ? 'bg-gray-900/20 border-gray-700/30 text-gray-100' 
            : 'bg-white/20 border-white/30 text-gray-700'
        } border rounded-2xl shadow-2xl shadow-black/10 mx-4 mt-4 px-6 py-6 justify-between items-center gap-7 hidden md:flex`}>
            
            <div className="flex justify-center items-center gap-2">
                <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                <h1 className={`font-semibold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
            </div>
            
            <div>
                <ul className="flex justify-center items-center gap-8 text-sm font-medium">
                    {NavLinks.map((option: any, index) => (
                        <li key={index}>
                            <Link href={`${option.link}`} className={`hover:text-indigo-600 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                <h1>{option.name}</h1>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className={`flex items-center gap-2 border rounded-full p-4 text-xs backdrop-blur-sm ${theme === 'dark' 
                ? 'border-gray-700/40 bg-gray-900/30' 
                : 'border-white/40 bg-white/30'
            }`}>
                <FaSearch className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <input 
                    type="search" 
                    name="search" 
                    id="search" 
                    placeholder="Search Premium Products...." 
                    className={`outline-none w-full bg-transparent ${theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500'}`} 
                />
            </div>
            
            <div className="gap-4 flex">
                <button 
                    className={`rounded-full backdrop-blur-sm border p-3 hover:bg-opacity-80 transition-all duration-300 ${theme === 'dark' 
                        ? 'bg-gray-800/40 border-gray-700/40 text-gray-200 hover:bg-gray-700/60' 
                        : 'bg-white/40 border-white/40 text-gray-800 hover:bg-gray-300'
                    }`} 
                    onClick={toggleTheme}
                >
                    {theme === "light" ? <FiSun /> : <FiMoon />}
                </button>
                
                <Link href={"/user/wishlist"}>
                    <button className={`rounded-full backdrop-blur-sm border p-3 relative hover:bg-opacity-80 transition-all duration-300 ${theme === 'dark' 
                        ? 'bg-gray-800/40 border-gray-700/40 text-gray-200 hover:bg-gray-700/60' 
                        : 'bg-white/40 border-white/40 text-gray-800 hover:bg-gray-300'
                    }`}>
                        {wishlistCount > 0 && (
                            <div className="absolute font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center -top-2 -right-1 shadow-lg">
                                {wishlistCount}
                            </div>
                        )}
                        <FiHeart />
                    </button>
                </Link>
                
                <Link href={"/user/cart"}>
                    <button className={`rounded-full backdrop-blur-sm border p-3 relative hover:bg-opacity-80 transition-all duration-300 ${theme === 'dark' 
                        ? 'bg-gray-800/40 border-gray-700/40 text-gray-200 hover:bg-gray-700/60' 
                        : 'bg-white/40 border-white/40 text-gray-800 hover:bg-gray-300'
                    }`}>
                        {cartItemsCount > 0 && (
                            <div className="absolute font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center -top-2 -right-1 shadow-lg">
                                {cartItemsCount}
                            </div>
                        )}
                        <LuShoppingBag />
                    </button>
                </Link>
                
                <div>
                    <button 
                        className={`rounded-full backdrop-blur-sm border p-3 hover:bg-opacity-80 transition-all duration-300 ${theme === 'dark' 
                            ? 'bg-gray-800/40 border-gray-700/40 text-gray-200 hover:bg-gray-700/60' 
                            : 'bg-white/40 border-white/40 text-gray-800 hover:bg-gray-300'
                        }`} 
                        onClick={() => setSelectedOption(!selectedOption)}
                    >
                        <FiUser />
                    </button>
                    {selectedOption && (
                        session?.user ? (
                            <div>
                                <div className={`absolute right-0 top-20 backdrop-blur-xl border rounded-lg shadow-2xl shadow-black/20 p-2 w-30 text-sm ${theme === 'dark' 
                                    ? 'bg-gray-900/90 border-gray-700/50' 
                                    : 'bg-white/90 border-white/50'
                                }`}>
                                    <ul className="flex flex-col gap-1">
                                        <li className={`flex items-center gap-1 hover:text-indigo-600 pl-1 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' 
                                            ? 'text-gray-200 hover:bg-gray-700/50' 
                                            : 'text-gray-800 hover:bg-gray-200'
                                        }`}>
                                            <FaRegUserCircle />
                                            <Link href="/user/profile">Profile</Link>
                                        </li>
                                        <li className={`flex items-center gap-1 hover:text-indigo-600 pl-1 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' 
                                            ? 'text-gray-200 hover:bg-gray-700/50' 
                                            : 'text-gray-800 hover:bg-gray-200'
                                        }`}>
                                            <FaBoxesStacked />
                                            <Link href={`${role === "ADMIN" ? "/admin" : "/user"}`}>Dashboard</Link>
                                        </li>
                                        <li className={`flex items-center gap-1 hover:text-indigo-600 pl-1 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' 
                                            ? 'text-gray-200 hover:bg-gray-700/50' 
                                            : 'text-gray-800 hover:bg-gray-200'
                                        }`}>
                                            <IoSettingsOutline />
                                            <Link href="/user/setting">Settings</Link>
                                        </li>
                                        <li className={`flex items-center gap-1 hover:text-indigo-600 pl-1 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' 
                                            ? 'text-gray-200 hover:bg-gray-700/50' 
                                            : 'text-gray-800 hover:bg-gray-200'
                                        }`}>
                                            <BsBoxArrowRight />
                                            <button onClick={handleLogout} className={`hover:text-indigo-600 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Logout</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className={`absolute right-0 top-20 backdrop-blur-xl border rounded-lg shadow-2xl shadow-black/20 p-2 w-30 text-sm ${theme === 'dark' 
                                    ? 'bg-gray-900/90 border-gray-700/50' 
                                    : 'bg-white/90 border-white/50'
                                }`}>
                                    <ul className="flex flex-col gap-1">
                                        <li className={`flex items-center gap-1 hover:text-indigo-600 pl-1 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' 
                                            ? 'text-gray-200 hover:bg-gray-700/50' 
                                            : 'text-gray-800 hover:bg-gray-200'
                                        }`}>
                                            <IoSettingsOutline />
                                            <Link href="/login">Login</Link>
                                        </li>
                                        <li className={`flex items-center gap-1 hover:text-indigo-600 pl-1 py-1 rounded-lg transition-colors duration-300 ${theme === 'dark' 
                                            ? 'text-gray-200 hover:bg-gray-700/50' 
                                            : 'text-gray-800 hover:bg-gray-200'
                                        }`}>
                                            <BsBoxArrowRight />
                                            <Link href="/signup">Register</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </nav>
    )
}