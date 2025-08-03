"use client"
import { User } from "@/types/types";
import { useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("ALL");
    const [selectOption, setSelectOption] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { theme } = useTheme();

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
            <div className={`min-h-screen m-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
        <div className={`min-h-screen m-10 flex flex-col gap-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div>
                <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: "var(--font-playfair" }}>Users Management</h1>
                <p className={`my-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Manage your platform users and their permissions</p>
            </div>
            <div className={`rounded-xl flex justify-center items-center px-6 py-10 relative backdrop-blur-md border ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'}`}>
                <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Search users...."
                    className={`w-full outline-none border rounded-lg px-4 py-2 text-xs ${theme === 'dark' ? 'bg-gray-700 border-purple-500 text-white placeholder-gray-400' : 'bg-white border-purple-600 text-gray-900 placeholder-gray-500'}`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                    className={`flex gap-2 justify-center items-center px-4 py-2 rounded-lg text-nowrap text-xs ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                    onClick={() => setSelectOption(!selectOption)}
                >
                    <FaFilter />
                    Role : {selectedRole}
                </button>
                {selectOption && (
                    <div className={`border shadow-lg rounded-lg p-3 flex flex-col justify-center items-center absolute top-full right-2 z-10 mt-2 text-xs ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                        <button
                            onClick={() => {
                                setSelectedRole("ALL");
                                setSelectOption(false);
                            }}
                            className={`rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedRole === "ALL" 
                                ? theme === 'dark' ? "bg-purple-800 text-purple-300" : "bg-purple-200 text-purple-500"
                                : theme === 'dark' ? "hover:bg-gray-700 hover:text-gray-300" : "hover:bg-gray-200 hover:text-gray-500"
                            }`}
                        >
                            All Roles
                        </button>
                        <button
                            onClick={() => {
                                setSelectedRole("ADMIN");
                                setSelectOption(false);
                            }}
                            className={`rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedRole === "ADMIN" 
                                ? theme === 'dark' ? "bg-purple-800 text-purple-300" : "bg-purple-200 text-purple-500"
                                : theme === 'dark' ? "hover:bg-gray-700 hover:text-gray-300" : "hover:bg-gray-200 hover:text-gray-500"
                            }`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => {
                                setSelectedRole("CUSTOMER");
                                setSelectOption(false);
                            }}
                            className={`rounded-lg duration-300 transition-all px-2 py-1 w-full ${selectedRole === "CUSTOMER" 
                                ? theme === 'dark' ? "bg-purple-800 text-purple-300" : "bg-purple-200 text-purple-500"
                                : theme === 'dark' ? "hover:bg-gray-700 hover:text-gray-300" : "hover:bg-gray-200 hover:text-gray-500"
                            }`}
                        >
                            Customer
                        </button>
                    </div>
                )}
            </div>

            <div className={`rounded-2xl p-8 shadow-sm backdrop-blur-md border ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'}`}>
                <h1 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "var(--font-playfair)" }}>
                    Users ({filteredUsers.length})
                </h1>

                {error && (
                    <div className={`border px-4 py-3 rounded mb-4 ${theme === 'dark' ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                                <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>User</th>
                                <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Role</th>
                                <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                                <th className={`text-center py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Orders</th>
                                <th className={`text-center py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Total Spent</th>
                                <th className={`text-left py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Join Date</th>
                                <th className={`text-center py-4 px-4 font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
                                const orderCount = user.orders.length;

                                return (
                                    <tr key={user.id} className={`border-b hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-50'}`}>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name || 'N/A'}</div>
                                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                                    ? theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                                                    : theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{orderCount}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${totalSpent.toLocaleString()}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="relative">
                                                <button className={`p-1 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
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