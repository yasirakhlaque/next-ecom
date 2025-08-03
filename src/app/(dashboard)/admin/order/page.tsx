"use client"
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { FiEye, FiPackage, FiTruck } from "react-icons/fi";
import { IoCheckmarkCircle, IoCloseCircle, IoTimeOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

interface OrderData {
    id: string;
    status: "PENDING" | "ACCEPTED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: number;
    address: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        image?: string;
    };
    orderDetails: Array<{
        id: string;
        quantity: number;
        priceAtPurchase: number;
        product: {
            name: string;
            image: string;
            price: number;
        };
    }>;
}

export default function Orders() {
    const { theme } = useTheme();
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/admin/orders");
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    setError("Failed to fetch orders");
                }
            } catch (err) {
                setError("Network error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (response.ok) {
                setOrders(orders.map(order => 
                    order.id === orderId 
                        ? { ...order, status: newStatus as any }
                        : order
                ));
            } else {
                alert("Failed to update order status");
            }
        } catch (error) {
            alert("Error updating order status");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return <IoCheckmarkCircle className="text-green-500" size={20} />;
            case "SHIPPED":
                return <FiTruck className="text-blue-500" size={20} />;
            case "ACCEPTED":
                return <FiPackage className="text-yellow-500" size={20} />;
            case "PENDING":
                return <IoTimeOutline className="text-orange-500" size={20} />;
            case "CANCELLED":
                return <IoCloseCircle className="text-red-500" size={20} />;
            default:
                return <IoTimeOutline className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "SHIPPED":
                return "bg-blue-100 text-blue-800";
            case "ACCEPTED":
                return "bg-yellow-100 text-yellow-800";
            case "PENDING":
                return "bg-orange-100 text-orange-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "ALL" || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen m-10">
                <div className={`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen m-10 flex flex-col gap-6">
            <div>
                <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} style={{ fontFamily: "var(--font-playfair)" }}>
                    Order Management
                </h1>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} my-2`}>Manage customer orders and update their status</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-xl flex justify-between items-center px-6 py-4 gap-4`}>
                <input
                    type="search"
                    placeholder="Search orders by customer name, email, or order ID..."
                    className={`flex-1 outline-none border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-800'} rounded-lg px-4 py-2 text-sm`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-800'} rounded-lg px-4 py-2 text-sm`}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-8 shadow-sm`}>
                <h1 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: "var(--font-playfair)" }}>
                    Orders ({filteredOrders.length})
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                                <th className={`text-left py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Order ID</th>
                                <th className={`text-left py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Customer</th>
                                <th className={`text-left py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Items</th>
                                <th className={`text-left py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Total</th>
                                <th className={`text-left py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Status</th>
                                <th className={`text-left py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Date</th>
                                <th className={`text-center py-4 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className={`border-b ${theme === 'dark' ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                                    <td className="py-4 px-4">
                                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            #{order.id.slice(-8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            {order.user.image ? (
                                                <img src={order.user.image} alt={order.user.name} className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-medium`}>
                                                    {order.user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{order.user.name || 'N/A'}</div>
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{order.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {order.orderDetails.slice(0, 2).map((detail, index) => (
                                                <span key={index} className={`text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-2 py-1 rounded`}>
                                                    {detail.product.name} (x{detail.quantity})
                                                </span>
                                            ))}
                                            {order.orderDetails.length > 2 && (
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    +{order.orderDetails.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            ${order.totalAmount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="ACCEPTED">Accepted</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-1`}>
                                            <FiEye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}