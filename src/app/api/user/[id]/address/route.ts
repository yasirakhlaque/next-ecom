import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { street, city, state, zip, country } = body;

        // Validating the address data
        if (!street || !city || !state || !zip || !country) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: { address: `${street}, ${city}, ${state}, ${zip}, ${country}` }
        });

        return NextResponse.json({ updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user address:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}