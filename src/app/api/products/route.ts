import { db } from "@/lib/db";
import { ProductSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const products = await db.product.findMany({
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
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
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

        const parseProduct = ProductSchema.safeParse({
            name,
            description,
            price: parseFloat(price),
            image,
            category,
            stock: parseInt(stock),
            brand,
            discount: discount ? parseInt(discount) : null,
            size
        })

        if (!parseProduct.success) {
            return NextResponse.json({ message: parseProduct.error.format() }, { status: 400 });
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