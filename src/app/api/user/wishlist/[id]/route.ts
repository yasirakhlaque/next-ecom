import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return new Response("User ID is required", { status: 400 });
    }

    const wishlistItems = await db.wishlist.findMany({
        where: { userId: id },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    image: true,
                    category: true,
                    stock: true,
                    brand: true,
                    discount: true,
                    size: true,
                    rating: true,
                }
            }
        },
    })

    return NextResponse.json({ wishlistItems }, { status: 200 });
}