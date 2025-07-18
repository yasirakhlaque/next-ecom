import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        if (!body) {
            return NextResponse.json({ error: "Request body is required" }, { status: 400 });
        }
        
        const { userId, productId } = body;
        
        if (!userId || !productId) {
            return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
        }

        // Check if item already exists in wishlist
        const existingItem = await db.wishlist.findFirst({
            where: {
                userId,
                productId
            }
        });

        if (existingItem) {
            return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 });
        }

        const wishlistItem = await db.wishlist.create({
            data: {
                userId,
                productId
            }
        });
        
        return NextResponse.json(wishlistItem, { status: 201 });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json({ error: "Failed to add item to wishlist" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');

        if (!userId || !productId) {
            return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
        }

        // Find and delete the wishlist item
        const deletedItem = await db.wishlist.deleteMany({
            where: {
                userId,
                productId
            }
        });

        if (deletedItem.count === 0) {
            return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 });
        }

        return NextResponse.json({ message: "Item removed from wishlist" }, { status: 200 });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return NextResponse.json({ error: "Failed to remove item from wishlist" }, { status: 500 });
    }
}