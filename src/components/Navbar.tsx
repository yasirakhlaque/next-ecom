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
import { SlOptionsVertical } from "react-icons/sl"
import { RxCross2 } from "react-icons/rx"

export default function Navbar() {
    const { data: session, status } = useSession();
    const [role, setRole] = useState<string>("");
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [selectedOption, setSelectedOption] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    useEffect(() => {
        const handleClickOutside = () => {
            setSelectedOption(false);
        };

        if (selectedOption) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [selectedOption]);

    return (
        <>
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
            {/* Mobile Navbar */}
            <nav className={`sticky top-3 z-50 backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/10 px-6 py-4 mx-4 mt-4 flex md:hidden ${theme === 'dark'
                ? 'bg-gray-900/20 border-gray-700/30'
                : 'bg-white/20 border-white/30'
                }`}>
                <div className="flex justify-between items-center w-full">
                    <div className="flex justify-center items-center gap-2">
                        <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                        <h1 className={`font-semibold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Cart Icon */}
                        <Link href={"/user/cart"}>
                            <button className={`rounded-full p-2 relative transition-all duration-300 ${theme === 'dark'
                                ? 'text-gray-200 hover:bg-gray-700/60'
                                : 'text-gray-800 hover:bg-gray-200'
                                }`}>
                                {cartItemsCount > 0 && (
                                    <div className="absolute font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -top-1 -right-1 shadow-lg">
                                        {cartItemsCount}
                                    </div>
                                )}
                                <LuShoppingBag size={20} />
                            </button>
                        </Link>

                        {/* Wishlist Icon */}
                        <Link href={"/user/wishlist"}>
                            <button className={`rounded-full p-2 relative transition-all duration-300 ${theme === 'dark'
                                ? 'text-gray-200 hover:bg-gray-700/60'
                                : 'text-gray-800 hover:bg-gray-200'
                                }`}>
                                {wishlistCount > 0 && (
                                    <div className="absolute font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -top-1 -right-1 shadow-lg">
                                        {wishlistCount}
                                    </div>
                                )}
                                <FiHeart size={20} />
                            </button>
                        </Link>

                        {/* Menu Button */}
                        <button
                            className={`rounded-full p-2 transition-all duration-300 ${theme === 'dark'
                                ? 'text-gray-200 hover:bg-gray-700/60'
                                : 'text-gray-800 hover:bg-gray-200'
                                }`}
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <SlOptionsVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className={`fixed h-[98vh] inset-0 z-[9999] ${theme === 'dark'
                        ? 'bg-black/80'
                        : 'bg-white/80'
                        } backdrop-blur-2xl`}>
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark'
                                ? 'border-gray-700/50 bg-gray-900/95'
                                : 'border-gray-300/50 bg-white/95'
                                } backdrop-blur-xl`}>
                                <div className="flex items-center gap-2">
                                    <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                                    <h1 className={`font-semibold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`p-3 rounded-full transition-all duration-300 ${theme === 'dark'
                                        ? 'text-gray-200 hover:bg-gray-700/80 bg-gray-800/50'
                                        : 'text-gray-800 hover:bg-gray-200 bg-gray-100/50'
                                        }`}
                                >
                                    <RxCross2 size={24} />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className={`flex-1 px-6 py-2 ${theme === 'dark'
                                ? 'bg-gray-900/95'
                                : 'bg-white/95'
                                } backdrop-blur-xl`}>
                                <div className="flex flex-col items-center gap-2">
                                    {NavLinks.map((option, index) => (
                                        <Link
                                            key={index}
                                            href={option.link}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block text-xl font-bold py-2 px-4 rounded-xl transition-all duration-300 ${theme === 'dark'
                                                ? 'text-gray-100 hover:text-indigo-400 hover:bg-gray-800/60'
                                                : 'text-gray-800 hover:text-indigo-600 hover:bg-gray-100/60'
                                                } transform hover:scale-105`}
                                            style={{ fontFamily: 'var(--font-playfair)' }}
                                        >
                                            {option.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Search Bar */}
                                <div className={`mt-6 flex items-center gap-4 border-2 rounded-2xl p-3 text-sm backdrop-blur-sm shadow-lg ${theme === 'dark'
                                    ? 'border-gray-600/50 bg-gray-800/60'
                                    : 'border-gray-300/50 bg-gray-50/60'
                                    }`}>
                                    <FaSearch className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`} />
                                    <input
                                        type="search"
                                        placeholder="Search Premium Products..."
                                        className={`outline-none w-full bg-transparent ${theme === 'dark' ? 'placeholder-gray-400 text-gray-200' : 'placeholder-gray-500 text-gray-800'}`}
                                    />
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div className={`p-2 border-t ${theme === 'dark'
                                ? 'border-gray-700/50 bg-gray-900/95'
                                : 'border-gray-300/50 bg-white/95'
                                } backdrop-blur-xl`}>

                                {/* Theme Toggle */}
                                <div className={`flex items-center justify-between mb-2 p-4 rounded-xl ${theme === 'dark'
                                    ? 'bg-gray-800/60'
                                    : 'bg-gray-100/60'
                                    }`}>
                                    <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                        Theme Mode
                                    </span>
                                    <button
                                        onClick={toggleTheme}
                                        className={`p-4 rounded-full transition-all duration-300 shadow-lg ${theme === 'dark'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                            : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                                            } transform hover:scale-110`}
                                    >
                                        {theme === "light" ? <FiSun size={24} /> : <FiMoon size={24} />}
                                    </button>
                                </div>

                                {/* User Actions */}
                                {session?.user ? (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/user/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-4 p-1 rounded-xl transition-all duration-300 ${theme === 'dark'
                                                ? 'text-gray-200 hover:bg-gray-800/60 bg-gray-800/30'
                                                : 'text-gray-800 hover:bg-gray-100/60 bg-gray-100/30'
                                                } transform hover:scale-[1.02]`}
                                        >
                                            <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                <FaRegUserCircle size={20} />
                                            </div>
                                            <span className="text-lg font-medium">Profile</span>
                                        </Link>

                                        <Link
                                            href={`${role === "ADMIN" ? "/admin" : "/user"}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-4 p-1 rounded-xl transition-all duration-300 ${theme === 'dark'
                                                ? 'text-gray-200 hover:bg-gray-800/60 bg-gray-800/30'
                                                : 'text-gray-800 hover:bg-gray-100/60 bg-gray-100/30'
                                                } transform hover:scale-[1.02]`}
                                        >
                                            <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                <FaBoxesStacked size={20} />
                                            </div>
                                            <span className="text-lg font-medium">Dashboard</span>
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className={`flex items-center gap-4 p-1 text-sm rounded-xl transition-all duration-300 w-full text-left ${theme === 'dark'
                                                ? 'text-red-400 hover:bg-red-900/20 bg-red-900/10'
                                                : 'text-red-600 hover:bg-red-100/60 bg-red-50/60'
                                                } transform hover:scale-[1.02]`}
                                        >
                                            <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                                <BsBoxArrowRight size={20} />
                                            </div>
                                            <span className="text-lg font-medium">Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-4 p-2 rounded-xl transition-all duration-300 ${theme === 'dark'
                                                ? 'text-gray-200 hover:bg-gray-800/60 bg-gray-800/30'
                                                : 'text-gray-800 hover:bg-gray-100/60 bg-gray-100/30'
                                                } transform hover:scale-[1.02]`}
                                        >
                                            <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                                <IoSettingsOutline size={20} />
                                            </div>
                                            <span className="text-lg font-medium">Login</span>
                                        </Link>

                                        <button>
                                            <Link
                                                href="/signup"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-4 p-2 rounded-xl transition-all duration-300 ${theme === 'dark'
                                                    ? 'text-gray-200 hover:bg-gray-800/60 bg-gray-800/30'
                                                    : 'text-gray-800 hover:bg-gray-100/60 bg-gray-100/30'
                                                    } transform hover:scale-[1.02]`}
                                            >
                                                <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                                    <BsBoxArrowRight size={20} />
                                                </div>
                                                <span className="text-lg font-medium">Register</span>
                                            </Link>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}