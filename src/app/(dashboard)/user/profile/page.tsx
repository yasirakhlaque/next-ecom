"use client";
import { FaPencil } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { userData } from "@/types/types";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<userData | null>(null);
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/user/${session?.user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (err) {
                console.log("Failed To Fetch User", err);
            } finally {
                setLoading(false)
            }
        }
        fetchUser();
    }, [session?.user.id])

    if (loading) {
        return <Loading />
    }

    const userAddress = userData?.address || "123 Main Street, New York, NY 10001, United States";

    // Parse address for better display
    const formatAddress = (address: string) => {
        if (!address) return {
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States"
        };

        // If it's a single string, try to parse it
        const parts = address.split(', ');
        if (parts.length >= 4) {
            return {
                street: parts[0],
                city: parts[1],
                state: parts[2].split(' ')[0],
                zip: parts[2].split(' ')[1] || "",
                country: parts[3] || "United States"
            };
        }

        // Fallback
        return {
            street: address,
            city: "",
            state: "",
            zip: "",
            country: ""
        };
    };

    const addressInfo = formatAddress(userAddress);

    return (
        <div className="min-h-screen m-5 md:m-10">
            <h1 className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>Profile Information</h1>
            <div className="flex justify-center gap-4 p-6 flex-col md:flex-row">
                <div className="flex flex-col items-center justify-center gap-4 bg-white/30 backdrop-blur-xl rounded-lg shadow-lg p-6 border-1 border-white w-full md:w-1/3 h-60">
                    <div className="h-30 w-30">
                        <img src={session?.user.image || "https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg"} alt="user image" className="h-[100%] w-[100%] object-cover rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>{session?.user.name}</h1>
                </div>
                <div className="flex flex-col w-full md:w-2/3 justify-center items-center gap-4">
                    <div className="bg-white/30 border-1 border-white backdrop-blur-xl rounded-lg shadow-lg p-6 flex flex-col gap-4 w-full">
                        <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Personal Information</h1>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-semibold">Name</label>
                                <input type="text" name="name" id="name" value={session?.user.name || ""} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                                <input type="email" name="email" id="email" value={session?.user.email || ""} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label htmlFor="phone" className="text-sm font-semibold">Phone</label>
                                <input type="text" name="phone" id="phone" value={"N/A"} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                        </div>
                        <button className="flex justify-center items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm text-white hover:from-indigo-700 hover:to-purple-700">Edit Profile<FaPencil /></button>
                    </div>
                    <div className="bg-white/30 border-1 border-white backdrop-blur-xl rounded-lg shadow-lg p-6 flex flex-col gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <IoLocationOutline size={24} className="text-indigo-500" /> <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Shipping Address</h1>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-center flex-col bg-white/30 border-1 border-white px-4 py-3 rounded-lg">
                                <h4>{session?.user.name}</h4>
                                <h4>{addressInfo.street}</h4>
                                <h4>{addressInfo.city}{addressInfo.state && `, ${addressInfo.state}`} {addressInfo.zip}</h4>
                                <h4>{addressInfo.country}</h4>
                                {!userData?.address && (
                                    <p className="text-sm text-gray-500 italic mt-2">
                                        * This is a sample address. Please update your shipping address.
                                    </p>
                                )}
                            </div>
                            <button className="flex justify-center items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-tr from-gray-500 to-gray-600 text-sm text-white hover:from-gray-700 hover:to-gray-800">Edit Address<FaPencil /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}