import { BsHandThumbsDown, BsHandThumbsUp } from "react-icons/bs";

interface Reviews {
    name: string,
    image: string,
    rating: number,
    comment: string,
    likes: number,
    dislikes: number,
}

export default function ReviewCard({ name, image, rating, comment, likes, dislikes }: Reviews) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-20 w-20">
                    <img src={image} alt={name} className="rounded-full h-[100%] w-[100%] object-cover" />
                </div>
                <div>
                    <h4>{name}</h4>
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>{comment}</p>
            </div>
            <div className="flex gap-4 items-center mt-2">
                <h6 className="flex gap-1 items-center"><BsHandThumbsUp />{likes}</h6>
                <h6 className="flex gap-1 items-center"><BsHandThumbsDown /> {dislikes}</h6>
            </div>
        </div>
    );
}