import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

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

// Star Rating Component
const StarRating = ({ rating = 0 }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1 mb-2">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, index) => (
                <FaStar key={`full-${index}`} className="text-yellow-400 text-sm" />
            ))}
            
            {/* Half Star */}
            {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
            
            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <FaRegStar key={`empty-${index}`} className="text-gray-300 text-sm" />
            ))}
            
            <span className="text-xs text-gray-600 ml-1">({rating.toFixed(1)})</span>
        </div>
    );
};

export default function ProductCard({ product }: { product: ProductCardProps }) {
    let finalPrice = product.originalPrice ? product.originalPrice - (product.originalPrice * (product.discount || 0) / 100) : product.price;
    
    return (
        <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 text-left hover:scale-105">
            <div className="h-64 w-full overflow-hidden p-4">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-4">
                <h4 className="text-indigo-500 text-sm font-semibold mb-1">{product.category}</h4>
                <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-all duration-300">{product.name}</h2>
                
                {/* Star Rating */}
                <StarRating rating={product.rating || 0} />
                
                <div className="flex gap-4 items-center mt-4">
                    <span className="text-xl font-bold text-indigo-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                        ${finalPrice.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice !== finalPrice && (
                        <span className="line-through text-xs text-gray-500">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
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