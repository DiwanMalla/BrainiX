export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("id");
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { likes: { increment: 1 } },
      include: {
        sender: {
          select: { name: true, image: true, role: true },
        },
      },
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
