interface ProductCardProps {
    name: string;
    image: string;
    description: string;
    price: number;
    category?: string;
    rating?: number;
    originalPrice?: number;
    discount?: number;
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
    let productPrice = ((product.price * 100) / (product?.originalPrice || 100)).toFixed(0);
    let finalPrice = product.originalPrice ? product.originalPrice - (product.originalPrice * (product.discount || 0) / 100) : product.price;
    return (
        <div className="bg-white/30 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 text-left">
            <div className="h-64 w-full overflow-hidden p-4 ">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
            </div>
            <div className="p-4">
                <h4 className="text-indigo-500 text-sm font-semibold">{product.category}</h4>
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>

                <div className="flex gap-4 items-center mt-4">
                    <span className="text-xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>${finalPrice}</span>
                    <span className="line-through text-xs">${product.originalPrice}</span>
                    {product.discount && (
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                            {product.discount}% Off
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}