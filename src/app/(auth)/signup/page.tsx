"use client"
import Link from "next/link";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { IoIosArrowRoundForward, IoIosEyeOff, IoMdEye } from "react-icons/io";

export default function SignUp() {
    const [isClicked, setIsClicked] = useState(false)
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center bg-white/30 p-5 w-100 rounded-xl gap-2">
                <form className=" flex justify-center items-center flex-col gap-3 w-full">
                    <div className="flex justify-center items-center gap-2">
                        <h3 className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">L</h3>
                        <h1 className="text-gray-800 font-semibold text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>Luxe</h1>
                    </div>
                    <h1 className="text-4xl font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>Join The Family</h1>
                    <p className="text-gray-600">Sign Up to continue shopping</p>
                    <button className="flex justify-center items-center gap-3 px-6 py-2 font-semibold text-sm hover:bg-gray-300 transition-all duration-300 rounded-lg"><FaGoogle />Continue With Google</button>
                    <p className="text-sm text-gray-600">or continue with email</p>
                    <div className="flex flex-col gap-1 w-full my-2 text-sm">
                        <label htmlFor="name" className="font-semibold">Name</label>
                        <input type="name" name="name" id="name" placeholder="Jhon Doe" className="outline-none bg-white px-2 py-3 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-1 w-full my-2 text-sm">
                        <label htmlFor="email" className="font-semibold">Email Address</label>
                        <input type="email" name="email" id="email" placeholder="jhon@example.com" className="outline-none bg-white px-2 py-3 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <div className="bg-white px-2 py-3 rounded-lg flex justify-between">
                            <input type={`${isClicked ? "text" : "password"}`} name="password" id="password" placeholder="Enter Your Password" className="outline-none " />
                            {isClicked ? <IoIosEyeOff onClick={() => setIsClicked(false)} /> : <IoMdEye onClick={() => setIsClicked(true)} />}
                        </div>
                    </div>
                    <button className="flex justify-center items-center gap-4 font-semibold rounded-lg px-8 py-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-800 group w-full">Sign In<IoIosArrowRoundForward size={24} className="group-hover:translate-x-2 transition-all duration-300" /></button>
                </form>
                <p className="text-sm">
                    Already Have An Account?
                    <Link href={"/login"}>
                        <button className="text-indigo-500 font-semibold hover:underline transition-all duration-300 cursor-pointer">
                            login
                        </button>
                    </Link>
                </p>
            </div>
        </div>
    )
}