import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const questionId = params.id;
    const { body } = await req.json();

    if (!body) {
      return NextResponse.json({ message: "Answer body is required" }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        body,
        userId: session.user.id,
        questionId
      }
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const questionId = params.id;
    const { answerId, isAccepted } = await req.json();

    // Verify the user is the author of the question
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question || question.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Unaccept other answers if we are accepting this one
    if (isAccepted) {
      await prisma.answer.updateMany({
        where: { questionId },
        data: { isAccepted: false }
      });
    }

    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted }
    });

    return NextResponse.json(answer, { status: 200 });
  } catch (error) {
    console.error("Error updating answer:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
