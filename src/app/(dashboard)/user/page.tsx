"use client";
import { useState } from "react";
import { OrderData, OrdersDummyData } from "@/lib/dummyData";
import { FiHeart, FiSettings, FiShoppingBag, FiUser } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import UserOrders from "@/app/(components)/@UserOrders/page";
import ProfilePage from "./profile/page";
import UserSetting from "./setting/page";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface OrderCardProps {
    order: OrderData;
}

export default function UserDashboard({ order }: OrderCardProps) {
    const [activeTab, setActiveTab] = useState("orders");
    const [orders] = useState<OrderData[]>(OrdersDummyData);
    const tabs = [
        { id: "Orders", label: "Orders", icon: <FiShoppingBag /> },
        { id: "savedItems", label: "Saved Items", icon: <FiHeart /> },
        { id: "Profile", label: "Profile", icon: <FiUser /> },
        { id: "Settings", label: "Setting", icon: <FiSettings /> },
    ];
    const { data: session } = useSession();
    if (!session) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="flex justify-center items-center py-10 flex-col gap-3 backdrop-blur-xl bg-white/30 border-1 border-white rounded-xl px-14">
                    <h1 className="text-2xl font-semibold text-gray-700">Please log in to view your dashboard</h1>
                    <Link href={"/login"}>
                        <button className="rounded-lg px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
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
            <h1 className="text-5xl font-semibold text-gray-900 " style={{ fontFamily: 'var(--font-playfair)' }}>My Dashboard</h1>
            <p className="text-sm text-gray-600 ">Manage your orders, saved items, and account settings</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-4 flex flex-col gap-2">
                    <h1 className="flex justify-between items-center font-semibold">Total Orders <FiShoppingBag className="text-indigo-500" /></h1>
                    <h4 className="font-bold text-3xl">{orders.length}</h4>
                </div>
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-4 flex flex-col gap-2">
                    <h1 className="flex justify-between items-center font-semibold">Saved Items <FiHeart className="text-pink-500" /></h1>
                    <h4 className="font-bold text-3xl">12</h4>
                </div>
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-4 flex flex-col gap-2">
                    <h1 className="flex justify-between items-center font-semibold">Total Spent <RiMoneyDollarCircleLine size={24} className="text-green-500" /></h1>
                    <h4 className="font-bold text-3xl">${totalSpent}</h4>
                </div>
            </div>
            <div className="flex flex-wrap w-fit shadow-lg items-center justify-center mt-6 bg-white rounded-lg md:rounded-full backdrop-blur-2xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 m-2 rounded-lg md:rounded-full font-bold text-sm transition-all duration-200 whitespace-nowrap flex justify-center items-center gap-2
                                ${activeTab === tab.id
                                ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                                : "text-gray-700 font-medium hover:bg-gray-600 hover:text-gray-100"}`}
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
