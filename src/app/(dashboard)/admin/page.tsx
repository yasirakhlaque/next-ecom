"use client";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus, FaRegEye } from "react-icons/fa";
import Users from "./user/page";
import Products from "./products/page";
import Orders from "./order/page";
import { FiShoppingBag, FiShoppingCart, FiUser } from "react-icons/fi";
import { VscGraph } from "react-icons/vsc";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import Loading from "@/app/loading";

export default function AdminDashboard() {
    const { data: session, status } = useSession(); 
    const router = useRouter(); 
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (status === "loading") return; 

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (session?.user?.role !== "ADMIN") {
            router.push("/");
            return;
        }
    }, [session?.user?.role, status, router]); 
    if (status === "loading") {
        return <Loading />
    }

    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    const handleTabs = () => {
        switch (activeTab) {
            case "overview":
                return <Overview />;
            case "users":
                return <Users />;
            case "products":
                return <Products />;
            case "orders":
                return <Orders />;
            default:
                return <Overview />;
        }
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: <VscGraph /> },
        { id: "users", label: "Users", icon: <FiUser /> },
        { id: "products", label: "Products", icon: <FiShoppingBag /> },
        { id: "orders", label: "Orders", icon: <FiShoppingCart /> },
    ];

    return (
        <div className="min-h-screen m-10">
            <div className="flex justify-between items-center flex-col sm:flex-row">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-700 my-2">Welcome back! Here's what's happening with your store.</p>
                </div>
                <div>
                    <Link href={"/admin/addProduct"}>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-tr from-indigo-700 to-purple-700 text-white font-semibold text-sm flex justify-center items-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300">
                            <FaPlus /> Add Product
                        </button>
                    </Link>
                </div>
            </div>

            <div className="rounded-xl bg-white p-4 my-4">
                <h1 className="text-2xl font-bold text-gray-700" style={{ fontFamily: "var(--font-playfair)" }}>Quick Action</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-2">
                    <Link href={"/admin/addProduct"} className="py-6 flex justify-center items-center gap-2 bg-gradient-to-tl from-emerald-400 to-emerald-600 text-white rounded-xl hover:from-emerald-300 hover:to-emerald-500 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col justify-center items-center gap-4">
                            <FaPlus /> Add Product
                        </div>
                    </Link>

                    <Link href={"/admin/user"} className="py-6 flex justify-center items-center gap-2 bg-gradient-to-tl from-blue-400 to-blue-600 text-white rounded-xl hover:from-blue-300 hover:to-blue-500 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col justify-center items-center gap-4">
                            <LuUsers /> Manage Users
                        </div>
                    </Link>

                    <Link href={"/admin/order"} className="py-6 flex justify-center items-center gap-2 bg-gradient-to-tl from-purple-400 to-purple-600 text-white rounded-xl hover:from-purple-300 hover:to-purple-500 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col justify-center items-center gap-4">
                            <FiShoppingCart /> View Orders
                        </div>
                    </Link>

                    <Link href={"/admin/products"} className="py-6 flex justify-center items-center gap-2 bg-gradient-to-tl from-orange-400 to-orange-600 text-white rounded-xl hover:from-orange-300 hover:to-orange-500 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col justify-center items-center gap-4">
                            <FiShoppingBag /> Manage Products
                        </div>
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap w-fit shadow-lg items-center mt-6 bg-white rounded-lg md:rounded-full backdrop-blur-2xl justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 m-2 rounded-lg md:rounded-full font-bold text-xs transition-all duration-200 whitespace-nowrap flex justify-center items-center gap-2
                                ${activeTab === tab.id
                                ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                                : "text-gray-700 font-medium hover:bg-gray-600 hover:text-gray-100"}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            <div className="-m-10 my-10">
                {handleTabs()}
            </div>
        </div>
    )
}

function Overview() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                } else {
                    setError('Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Network error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-200 text-green-500"
            case "ACCEPTED":
                return "bg-yellow-200 text-yellow-500"
            case "SHIPPED":
                return "bg-blue-200 text-blue-500"
            case "PENDING":
                return "bg-orange-200 text-orange-500"
            case "CANCELLED":
                return "bg-red-200 text-red-500"
            default:
                return "bg-gray-300 text-gray-500"
        }
    }

    if (loading) {
        return (
            <div className="m-10 flex justify-center items-center">
                <div className="text-xl">Loading dashboard data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="m-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-6 flex flex-col gap-2 border-1 border-white">
                    <h1 className="flex justify-between items-center font-semibold">
                        Total Revenue
                        <RiMoneyDollarCircleLine className="text-green-500 bg-green-200 rounded-lg p-1" size={27} />
                    </h1>
                    <h4 className="font-bold text-2xl sm:text-3xl">${dashboardData?.totalRevenue?.toFixed(2) || '0.00'}</h4>
                </div>
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-6 flex flex-col gap-2">
                    <h1 className="flex justify-between items-center font-semibold">
                        Total Orders
                        <FiShoppingCart className="text-blue-500 bg-blue-200 rounded-lg p-1" size={27} />
                    </h1>
                    <h4 className="font-bold text-2xl sm:text-3xl">{dashboardData?.totalOrders || 0}</h4>
                </div>
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-6 flex flex-col gap-2">
                    <h1 className="flex justify-between items-center font-semibold">
                        Total Products
                        <FiShoppingBag className="text-purple-500 bg-purple-200 rounded-lg p-1" size={27} />
                    </h1>
                    <h4 className="font-bold text-2xl sm:text-3xl">{dashboardData?.totalProducts || 0}</h4>
                </div>
                <div className="bg-white/30 backdrop-blur-xl rounded-lg shadow-xl p-6 flex flex-col gap-2">
                    <h1 className="flex justify-between items-center font-semibold">
                        Total Customers
                        <LuUsers className="text-orange-500 bg-orange-200 rounded-lg p-1" size={27} />
                    </h1>
                    <h4 className="font-bold text-2xl sm:text-3xl">{dashboardData?.totalCustomers || 0}</h4>
                </div>
            </div>
            <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="px-10 py-7 bg-white rounded-xl">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Recent Orders</h1>
                        <Link href={"/admin/order"}>
                            <button className="flex justify-center items-center gap-2 rounded-full border-1 border-white bg-white/10 py-2 px-4 text-gray-700 text-sm font-semibold">
                                <FaRegEye /> View All
                            </button>
                        </Link>
                    </div>
                    <div>
                        {dashboardData?.recentOrders?.map((order: any, index: number) => (
                            <div className="flex justify-between items-center text-xs my-4" key={index}>
                                <div className="flex flex-col gap-2">
                                    <h2 className="font-semibold">{order.orderedBy}</h2>
                                    <p className="text-gray-500">{order.email}</p>
                                </div>
                                <div className="flex items-end flex-col gap-2">
                                    <h1 className="text-sm font-bold text-blue-800">${order.itemPrice}</h1>
                                    <div className="flex gap-2 items-center justify-center">
                                        <h3 className={`${getStatusStyles(order.status)} rounded-full text-xs font-semibold px-2 py-1`}>
                                            {order.status}
                                        </h3>
                                        <p className="text-gray-400">{order.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="px-10 py-7 bg-white rounded-xl">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Top Products</h1>
                        <Link href={"/admin/products"}>
                            <button className="flex justify-center items-center gap-2 rounded-full bg-white/10 py-2 px-4 text-gray-700 text-sm font-semibold">
                                <FaRegEye /> View All
                            </button>
                        </Link>
                    </div>
                    <div>
                        {dashboardData?.topProducts?.map((item: any) => (
                            <div key={item.rank} className="flex items-center justify-between gap-6 my-5 bg-white/50 rounded-lg p-2 text-xs">
                                <div className="flex gap-4">
                                    <h1 className="rounded-xl flex justify-center items-center font-semibold text-white bg-gradient-to-tl from-purple-600 to-blue-600 p-2">#{item.rank}</h1>
                                    <div className="flex gap-2">
                                        <img
                                            src={item.itemImage}
                                            alt={item.itemName}
                                            className="w-8 h-8 object-cover rounded"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <span className="font-semibold">{item.itemName}</span>
                                            <span className="text-gray-400">{item.totalSales} sales</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-blue-800 font-semibold text-xl">${item.totalRevenue}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}