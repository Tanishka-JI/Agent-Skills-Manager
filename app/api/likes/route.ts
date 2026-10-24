import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const likes = await prisma.like.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
        skillId: true,
        createdAt: true,
        skill: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({ likes });
  } catch (error) {
    console.error("Failed to fetch liked skills:", error);

    return NextResponse.json(
      { error: "Failed to fetch liked skills" },
      { status: 500 }
    );
  }
}