import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId") || undefined;

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cartItems = await db.cart.findMany({
        where: { userId },
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
    });

    if (!cartItems || cartItems.length === 0)
        return NextResponse.json({ cartItems: [] }, { status: 200 }); // Return empty array instead of error

    return NextResponse.json({ cartItems }, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
        }

        const existingCartItem = await db.cart.findFirst({
            where: {
                userId,
                productId,
            },
        });

        if (existingCartItem) {
            const updatedCartItem = await db.cart.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: { increment: 1 },
                },
            });

            return NextResponse.json({ cartItem: updatedCartItem }, { status: 200 });
        }

        const newCartItem = await db.cart.create({
            data: {
                userId,
                productId,
                quantity: 1,
            },
        });

        return NextResponse.json({ cartItem: newCartItem }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/user/cart:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");
    const productId = req.nextUrl.searchParams.get("productId");

    if (!userId || !productId) {
        return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 }); // Fixed syntax error
    }

    try {
        const deletedCartItem = await db.cart.deleteMany({
            where: {
                userId,
                productId,
            }
        });

        if (deletedCartItem.count === 0) {
            return NextResponse.json({ error: "No cart item found to delete" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cart item deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE /api/user/cart:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { userId, productId, action } = await req.json(); // Added action parameter

        if (!userId || !productId || !action) {
            return NextResponse.json({ error: "User ID, Product ID, and action are required" }, { status: 400 });
        }

        const cartItem = await db.cart.findFirst({
            where: { userId, productId },
        });

        if (!cartItem) {
            return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
        }

        if (action === "decrease") {
            if (cartItem.quantity <= 1) {
                await db.cart.delete({ where: { id: cartItem.id } });
                return NextResponse.json({ message: "Item removed from cart", removed: true }, { status: 200 });
            }

            const updatedItem = await db.cart.update({
                where: { id: cartItem.id },
                data: {
                    quantity: { decrement: 1 },
                },
            });

            return NextResponse.json({ cartItem: updatedItem }, { status: 200 });
        } else if (action === "increase") {
            const updatedItem = await db.cart.update({
                where: { id: cartItem.id },
                data: {
                    quantity: { increment: 1 },
                },
            });

            return NextResponse.json({ cartItem: updatedItem }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid action. Use 'increase' or 'decrease'" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in PATCH /api/user/cart:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}