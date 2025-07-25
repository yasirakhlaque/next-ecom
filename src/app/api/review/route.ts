import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, productId, reviewText, rating } = await req.json();

        if (!userId || !productId || !reviewText || !rating) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newReview = await db.review.create({
            data: {
                userId,
                productId,
                text: reviewText,
                rating
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });
        
        console.log("New review created:", newReview);

        return NextResponse.json({ 
            message: "Review added successfully",
            review: {
                ...newReview,
                userName: newReview.user?.name || 'Anonymous',
                userImage: newReview.user?.image || '/api/placeholder/50/50'
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}