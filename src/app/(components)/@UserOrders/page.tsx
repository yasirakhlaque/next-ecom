import { OrderData, OrdersDummyData } from "@/lib/dummyData";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiPackage, FiTruck } from "react-icons/fi";
import { IoCheckmarkCircle, IoCloseCircle, IoTimeOutline } from "react-icons/io5";

interface OrderCardProps {
    order: OrderData;
}

function OrderCard({ order }: OrderCardProps) {
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
                return "bg-green-100 text-green-800 border-green-200";
            case "SHIPPED":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "ACCEPTED":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "PENDING":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalItems = order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0);

    return (
        <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {order.orderDetails.slice(0, 3).map((detail) => (
                    <div key={detail.id} className="flex items-center gap-2 bg-white/50 rounded-lg p-2 text-xs">
                        <img
                            src={detail.product.image}
                            alt={detail.product.name}
                            className="w-8 h-8 object-cover rounded"
                        />
                        <span className="font-medium">{detail.product.name}</span>
                        {detail.quantity > 1 && (
                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                                x{detail.quantity}
                            </span>
                        )}
                    </div>
                ))}
                {order.orderDetails.length > 3 && (
                    <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-600 flex items-center">
                        +{order.orderDetails.length - 3} more items
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/30">
                <div>
                    <p className="text-sm text-gray-600">{totalItems} item(s)</p>
                    <p className="text-xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                        ${order.totalAmount.toFixed(2)}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white/60 hover:bg-white/80 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1">
                        <FiEye size={16} />
                        View Details
                    </button>
                    {order.status === "DELIVERED" && (
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                            Reorder
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function UserOrders() {
    const [orders] = useState<OrderData[]>(OrdersDummyData);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Your Recent Orders
                </h2>
                <Link href={"/user/order"}>
                    <button className="text-sm font-semibold px-3 py-2 border-1 border-white rounded-full">
                        View All Orders
                    </button>
                </Link>
            </div>

            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.slice(0, 3).map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
                            <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
                            <p className="text-gray-600">You haven't placed any orders yet.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}