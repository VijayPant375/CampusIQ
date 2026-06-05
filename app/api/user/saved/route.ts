import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: true
      },
      orderBy: { savedAt: 'desc' }
    });
    return NextResponse.json(savedColleges);
  } catch (error) {
    console.error("Error fetching saved colleges:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collegeId } = await req.json();
    if (!collegeId) {
      return NextResponse.json({ message: "collegeId is required" }, { status: 400 });
    }

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: Number(collegeId)
        }
      }
    });

    if (existing) {
      return NextResponse.json({ message: "College already saved" }, { status: 409 });
    }

    const saved = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId: Number(collegeId)
      }
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error saving college:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collegeId } = await req.json();
    if (!collegeId) {
      return NextResponse.json({ message: "collegeId is required" }, { status: 400 });
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: Number(collegeId)
        }
      }
    });

    return NextResponse.json({ message: "College removed from saved" }, { status: 200 });
  } catch (error) {
    console.error("Error removing saved college:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
