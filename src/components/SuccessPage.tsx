"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";

export default function SuccessPage({ orderId }: { orderId: string | null }) {
    const router = useRouter();
    useEffect(() => {
        const OrderPageRedirect = () => {
            setTimeout(() => {
                router.push('/user/order');
            }, 3000);
        }
        OrderPageRedirect();
    }, [])
    return (
        <div className="min-h-screen justify-center items-center bg-green-700 flex flex-col gap-4 p-6 text-white">
            <div className="success">
                <TbRosetteDiscountCheckFilled size={50}/>
            </div>
            <h1 className="text-sm md:text-2xl font-bold fadeIn text-center">Order #{orderId} placed successfully!</h1>
        </div>
    )
}