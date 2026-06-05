import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const questionId = params.id;
    
    // Increment views
    await prisma.question.update({
      where: { id: questionId },
      data: { views: { increment: 1 } }
    });

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: true,
        college: { select: { id: true, name: true } },
        answers: {
          include: {
            user: { select: { id: true, name: true, image: true } }
          },
          orderBy: [
            { isAccepted: 'desc' },
            { upvotes: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
