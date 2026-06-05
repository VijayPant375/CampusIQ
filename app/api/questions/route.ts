import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const collegeId = searchParams.get("collegeId");
    
    let whereClause: any = {};
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { body: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (collegeId) {
      whereClause.collegeId = Number(collegeId);
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: true,
        _count: { select: { answers: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, body: content, collegeId, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ message: "Title and body are required" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        body: content,
        userId: session.user.id,
        collegeId: collegeId ? Number(collegeId) : null,
        tags: tags && tags.length > 0 ? {
          create: tags.map((t: string) => ({ tag: t }))
        } : undefined
      }
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
