import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../config/db";
import { Users } from "../../../config/schema";

export async function POST(req) {
  try {
    const { email, credits } = await req.json();

    if (!email || credits === undefined) {
      return NextResponse.json(
        { error: "email 또는 credits 값이 없습니다." },
        { status: 400 }
      );
    }

    const result = await db
      .update(Users)
      .set({
        credits: credits,
      })
      .where(eq(Users.email, email))
      .returning({ id: Users.id });

    return NextResponse.json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.log("Update credits error:", error);

    return NextResponse.json(
      { error: "크레딧 업데이트 실패" },
      { status: 500 }
    );
  }
}