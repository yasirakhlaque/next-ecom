import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = await db.product.findUnique({
            where: { id },
            include: { 
                tags: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const transformedProduct = {
            ...product,
            reviews: product.reviews.map(review => ({
                ...review,
                userName: review.user?.name || 'Anonymous',
                userImage: review.user?.image || '/api/placeholder/50/50'
            }))
        };

        return NextResponse.json(transformedProduct, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/product/[id]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, description, price, image, category, stock, brand, discount, size } = body;

        const product = await db.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                size,
                image,
                category,
                stock,
                brand,
                discount
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product update failed" }, { status: 500 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error in PUT /api/product/[id]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await db.$transaction(async (tx) => {
            await tx.cart.deleteMany({ where: { productId: id } });
            await tx.orderDetails.deleteMany({ where: { productId: id } });
            await tx.review.deleteMany({ where: { productId: id } });
            await tx.wishlist.deleteMany({ where: { productId: id } });
            await tx.product.delete({ where: { id } });
        });

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE /api/product/[id]:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}