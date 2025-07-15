"use client"
import { useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    createdAt: string;
    orders: { totalAmount: number; status: string }[];
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("ALL");
    const [selectOption, setSelectOption] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/admin/user");
                const data = await response.json();

                if (response.ok) {
                    setUsers(data);
                } else {
                    setError(data.error || "Failed to fetch users");
                }
            } catch (err) {
                setError("Network error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen m-10">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = selectedRole === "ALL" || user.role === selectedRole
        return matchesSearch && matchesRole
    })

    return (
        <div className="min-h-screen m-10 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: "var(--font-playfair" }}>Users Management</h1>
                <p className="text-gray-400 my-2">Manage your platform users and their permissions</p>
            </div>
            <div className="bg-white rounded-xl flex justify-center items-center px-6 py-10 relative">
                <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Search users...."
                    className="w-full outline-none border border-purple-600 rounded-lg px-4 py-2 text-xs"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                    className="flex gap-2 justify-center items-center px-4 py-2 rounded-lg text-nowrap text-xs"
                    onClick={() => setSelectOption(!selectOption)}
                >
                    <FaFilter />
                    Role : {selectedRole}
                </button>
                {selectOption && (
                    <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-3 flex flex-col justify-center items-center absolute top-full right-2 z-10 mt-2 text-xs">
                        <button
                            onClick={() => {
                                setSelectedRole("ALL");
                                setSelectOption(false);
                            }}
                            className={`hover:bg-gray-200 hover:text-gray-500 rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedRole === "ALL" && "bg-purple-200 text-purple-500"}`}
                        >
                            All Roles
                        </button>
                        <button
                            onClick={() => {
                                setSelectedRole("ADMIN");
                                setSelectOption(false);
                            }}
                            className={`hover:bg-gray-200 hover:text-gray-500 rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedRole === "ADMIN" && "bg-purple-200 text-purple-500"}`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => {
                                setSelectedRole("CUSTOMER");
                                setSelectOption(false);
                            }}
                            className={`hover:bg-gray-200 hover:text-gray-500 rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedRole === "CUSTOMER" && "bg-purple-200 text-purple-500"}`}
                        >
                            Customer
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                    Users ({filteredUsers.length})
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">User</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Role</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Status</th>
                                <th className="text-center py-4 px-4 font-medium text-gray-500 text-sm">Orders</th>
                                <th className="text-center py-4 px-4 font-medium text-gray-500 text-sm">Total Spent</th>
                                <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Join Date</th>
                                <th className="text-center py-4 px-4 font-medium text-gray-500 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
                                const orderCount = user.orders.length;

                                return (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="font-medium text-gray-900">{orderCount}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="font-medium text-gray-900">${totalSpent.toLocaleString()}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="relative">
                                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                                    <BsThreeDotsVertical />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}