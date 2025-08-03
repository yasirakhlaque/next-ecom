"use client";
import { useState } from "react";
import { OrderData, OrdersDummyData } from "@/lib/dummyData";
import { FiHeart, FiSettings, FiShoppingBag, FiUser } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useTheme } from "@/contexts/ThemeContext";
import UserOrders from "@/app/@UserOrders/page";
import ProfilePage from "./profile/page";
import UserSetting from "./setting/page";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserDashboard() { 
    const [activeTab, setActiveTab] = useState("orders");
    const [orders] = useState<OrderData[]>(OrdersDummyData);
    const { data: session } = useSession();
    const { theme } = useTheme();

    const tabs = [
        { id: "orders", label: "Orders", icon: <FiShoppingBag /> },
        { id: "savedItems", label: "Saved Items", icon: <FiHeart /> },
        { id: "Profile", label: "Profile", icon: <FiUser /> },
        { id: "Settings", label: "Settings", icon: <FiSettings /> }
    ];

    if (!session) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            }`}>
                <div className={`text-center backdrop-blur-sm border rounded-2xl p-8 shadow-xl transition-colors duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-900/30 border-gray-700/30' 
                        : 'bg-white/30 border-white/30'
                }`}>
                    <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`}>Please log in to access your dashboard</h1>
                    <Link href={"/login"}>
                        <button className="rounded-lg px-6 py-3 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleOptions = () => {
        switch (activeTab) {
            case 'orders':
                return <UserOrders />
            case 'savedItems':
                // Navigate to saved items page
                break;
            case 'Profile':
                return <ProfilePage />
            case 'Settings':
                return <UserSetting />
            default:
                return <UserOrders />
        }
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return (
        <div className="flex justify-center flex-col gap-3 min-h-screen px-16 my-8">
            <h1 className={`text-5xl font-semibold transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`} style={{ fontFamily: 'var(--font-playfair)' }}>My Dashboard</h1>
            <p className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Manage your orders, saved items, and account settings</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className={`backdrop-blur-xl rounded-lg shadow-xl p-4 flex flex-col gap-2 transition-colors duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-900/30 border border-gray-700/30' 
                        : 'bg-white/30 border border-white/30'
                }`}>
                    <h1 className={`flex justify-between items-center font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                        Total Orders <FiShoppingBag className="text-indigo-500" />
                    </h1>
                    <h4 className={`font-bold text-3xl transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>{orders.length}</h4>
                </div>
                
                <div className={`backdrop-blur-xl rounded-lg shadow-xl p-4 flex flex-col gap-2 transition-colors duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-900/30 border border-gray-700/30' 
                        : 'bg-white/30 border border-white/30'
                }`}>
                    <h1 className={`flex justify-between items-center font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                        Total Spent <RiMoneyDollarCircleLine className="text-green-500" />
                    </h1>
                    <h4 className={`font-bold text-3xl transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>${totalSpent.toFixed(2)}</h4>
                </div>
                
                <div className={`backdrop-blur-xl rounded-lg shadow-xl p-4 flex flex-col gap-2 transition-colors duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-900/30 border border-gray-700/30' 
                        : 'bg-white/30 border border-white/30'
                }`}>
                    <h1 className={`flex justify-between items-center font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                        Saved Items <FiHeart className="text-pink-500" />
                    </h1>
                    <h4 className={`font-bold text-3xl transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>0</h4>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 m-2 rounded-lg md:rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap flex justify-center items-center gap-2 ${
                            activeTab === tab.id
                                ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                                : theme === 'dark'
                                    ? "text-gray-300 font-medium hover:bg-gray-700 hover:text-gray-100"
                                    : "text-gray-700 font-medium hover:bg-gray-600 hover:text-gray-100"
                        }`}
                    >
                        {tab.label} {tab.icon}
                    </button>
                ))}
            </div>
            <div>
                {handleOptions()}
            </div>
        </div>
    )
}