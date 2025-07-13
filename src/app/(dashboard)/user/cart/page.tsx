import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";

export default function Cart() {
    return (
        <div className="h-100 flex items-center justify-center">
            <div className="bg-white/30 border-1 border-white py-12 px-30 rounded-lg flex flex-col justify-center items-center gap-4">
                <FiShoppingBag size={50} />
                <h1 className="text-4xl text-gray-700 font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>Your Cart Is Empty</h1>
                <p className="text-gray-500">Looks like you haven't added any items to your cart yet.</p>
                <Link href={"/products"}>
                    <button className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg px-3 py-2 text-white">Continue Shopping</button>
                </Link>
            </div>
        </div>
    )
}