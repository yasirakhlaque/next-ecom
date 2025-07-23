import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const user = await db.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                address: true,
                image: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}