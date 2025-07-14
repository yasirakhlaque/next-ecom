import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await db.product.findUnique({
        where: { id },
        include: { tags: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    if (!product) return NextResponse.json({ error: "Product update failed" }, { status: 500 });

    return NextResponse.json(product, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const product = await db.product.delete({
        where: { id },
    });
    if (!product) return NextResponse.json({ error: "Product deletion failed" }, { status: 500 });
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
}