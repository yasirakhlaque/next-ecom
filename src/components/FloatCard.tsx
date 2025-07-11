export default function FloatCard({ img, name, price }: { img: string, name: string, price: string }) {
    return (
        <div className="px-4 py-3 flex justify-center items-center gap-3 float bg-white/50 rounded-lg">
            <div className="h-15 w-15 overflow-hidden">
                <img src={img} alt="cloth Image" className="h[100%] w-[100%] object-cover rounded-lg" />
            </div>
            <div>
                <h1 className="text-sm font-semibold text-gray-900">{name}</h1>
                <p className="text-indigo-600 font-bold text-sm">${price}</p>
            </div>
        </div>
    )
}