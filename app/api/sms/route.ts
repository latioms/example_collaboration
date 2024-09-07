// app/api/sendSMS/route.ts
import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/sms";

export async function POST(req: Request) {
  const { phone, message }: { phone: string; message: string } =
    await req.json();

  if (!phone || !message) {
    return NextResponse.json(
      { error: "Phone and message are required" },
      { status: 400 }
    );
  }

  try {
    const result = await sendSMS(phone, message);
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
