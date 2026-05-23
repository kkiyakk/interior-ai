import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";
import { desc, eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userEmail } = await req.json();

    const result = await db
      .select()
      .from(AiGeneratedImage)
      .where(eq(AiGeneratedImage.userEmail, userEmail))
      .orderBy(desc(AiGeneratedImage.id));

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.log("Error fetching user room list:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}