import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }
    
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: true,
        reviews: true,
      },
    });
    
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
    
    return NextResponse.json(college);
  } catch (error) {
    console.error('Error fetching college by id:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
