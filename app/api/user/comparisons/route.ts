import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(comparisons);
  } catch (error) {
    console.error("Error fetching saved comparisons:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, collegeIds } = await req.json();
    if (!name || !collegeIds) {
      return NextResponse.json({ message: "name and collegeIds are required" }, { status: 400 });
    }

    const saved = await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        name,
        collegeIds
      }
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error saving comparison:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    await prisma.savedComparison.delete({
      where: {
        id: String(id),
      }
    });

    return NextResponse.json({ message: "Comparison removed" }, { status: 200 });
  } catch (error) {
    console.error("Error removing comparison:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
