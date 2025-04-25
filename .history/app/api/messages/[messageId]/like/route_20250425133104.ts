import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messageId } = params;

  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { likes: { increment: 1 } },
      include: { sender: { select: { name: true, image: true, role: true } } },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error liking message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
