import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const products = await db.product.findMany({
            include: { tags: true },
        });
        
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, price, image, category, stock, brand, discount, size } = body;

        // Validation
        if (!name || !description || !price || !image || !category || stock === undefined || !brand || !size) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await db.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                size,
                image,
                category,
                stock: parseInt(stock),
                brand,
                discount: discount ? parseInt(discount) : null
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Product creation error:', error);
        return NextResponse.json({ error: "Product creation failed" }, { status: 500 });
    }
}