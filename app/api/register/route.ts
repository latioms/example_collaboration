import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongose";

interface Contact {
    fullname: string;
    phone: string;
}
export async function GET() {
    const client = await clientPromise;
    const db = client.db("contacts_example_collab");
    const collection = db.collection("contact");

    const contacts = await collection.find().toArray();
    return NextResponse.json(contacts);
}
export async function POST(request: NextRequest) {
    const { fullname, phone }: Contact = await request.json();

    if (!fullname || !phone) {
        return NextResponse.json(
            { error: "Fullname and phone are required" },
            { status: 400 }
        );
    }

    const client = await clientPromise;
    const db = client.db("contacts_example_collab");
    const collection = db.collection("contact");

    try {
        await collection.insertOne({ fullname, phone });
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
    }
    
}