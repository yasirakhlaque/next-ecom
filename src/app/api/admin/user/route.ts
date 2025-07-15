import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                orders: {
                    select: {
                        totalAmount: true,
                        status: true
                    }
                }
            }
        });
        
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }
        
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}