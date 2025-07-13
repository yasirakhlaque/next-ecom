"use client"
import Link from "next/link"
import { useState } from "react"
import { BsBoxArrowRight } from "react-icons/bs"
import { FaRegUserCircle, FaSearch } from "react-icons/fa"
import { FaBoxesStacked } from "react-icons/fa6"
import { FiHeart, FiSun, FiUser } from "react-icons/fi"
import { IoSettingsOutline } from "react-icons/io5"
import { LuShoppingBag } from "react-icons/lu"

export default function Navbar() {
    let NavLinks = [
        { name: "Home", link: "/" },
        { name: "Products", link: "/products" },
        { name: "Categories", link: "/categories" },
        { name: "About", link: "/about" },
    ]
    const [selectedOption, setSelectedOption] = useState(false);
    return (
        <nav className="sticky top-5 z-50 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl shadow-black/10 mx-4 mt-4 px-6 py-6 justify-between items-center text-gray-700 gap-7 hidden md:flex">
            <div className="flex justify-center items-center gap-2">
                <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                <h1 className="text-gray-800 font-semibold text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
            </div>
            <div>
                <ul className="flex justify-center items-center gap-8 text-sm font-medium">
                    {NavLinks.map((option: any, index) => (
                        <li key={index}>
                            <Link href={`${option.link}`} className="hover:text-indigo-600 transition-colors duration-300">
                                <h1>{option.name}</h1>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center gap-2 border border-white/40 rounded-full p-4 text-xs bg-white/30 backdrop-blur-sm">
                <FaSearch className="text-gray-600" />
                <input type="search" name="search" id="search" placeholder="Search Premium Products...." className="outline-none w-full bg-transparent placeholder-gray-500" />
            </div>
            <div className="gap-4 flex text-gray-800">
                <button className="rounded-full bg-white/40 backdrop-blur-sm border border-white/40 p-3 hover:bg-gray-300 transition-all duration-300 ">
                    <FiSun />
                </button>
                <button className="rounded-full bg-white/40 backdrop-blur-sm border border-white/40 p-3 relative hover:bg-gray-300 transition-all duration-300 ">
                    <div className="absolute font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center -top-2 -right-1 shadow-lg">2</div>
                    <FiHeart />
                </button>
                <Link href={"/user/cart"}>
                    <button className="rounded-full bg-white/40 backdrop-blur-sm border border-white/40 p-3 relative hover:bg-gray-300 transition-all duration-300 ">
                        <div className="absolute font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center -top-2 -right-1 shadow-lg">9</div>
                        <LuShoppingBag />
                    </button>
                </Link>
                <div>
                    <button className="rounded-full bg-white/40 backdrop-blur-sm border border-white/40 p-3 hover:bg-gray-300 transition-all duration-300" onClick={() => setSelectedOption(!selectedOption)}>
                        <FiUser />
                    </button>
                    {selectedOption &&
                        <div>
                            <div className="absolute right-0 top-20 bg-white/90 backdrop-blur-xl border border-white/50 rounded-lg shadow-2xl shadow-black/20 p-2 w-30 text-sm">
                                <ul className="flex flex-col gap-1 text-gray-800">
                                    <li className="flex items-center gap-1 hover:text-indigo-600 hover:bg-gray-200 pl-1 py-1 rounded-lg transition-colors duration-300">
                                        <FaRegUserCircle />
                                        <Link href="/user/profile">Profile</Link>
                                    </li>
                                    <li className="flex items-center gap-1 hover:text-indigo-600 hover:bg-gray-200 pl-1 py-1 rounded-lg transition-colors duration-300">
                                        <FaBoxesStacked />
                                        <Link href="/user">Dashboard</Link>
                                    </li>
                                    <li className="flex items-center gap-1 hover:text-indigo-600 hover:bg-gray-200 pl-1 py-1 rounded-lg transition-colors duration-300">
                                        <IoSettingsOutline />
                                        <Link href="/user/setting">Settings</Link>
                                    </li>
                                    <li className="flex items-center gap-1 hover:text-indigo-600 hover:bg-gray-200 pl-1 py-1 rounded-lg transition-colors duration-300">
                                        <BsBoxArrowRight />
                                        <Link href="/logout">Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>}
                </div>
            </div>
        </nav>
    )
}