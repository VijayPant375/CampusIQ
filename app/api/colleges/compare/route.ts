import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
    }
    
    const idsStr = idsParam.split(',').map((id) => id.trim());
    
    if (idsStr.length < 2 || idsStr.length > 3) {
      return NextResponse.json({ error: "Please provide between 2 and 3 college IDs to compare" }, { status: 400 });
    }
    
    const ids = idsStr.map((id) => parseInt(id, 10));
    
    if (ids.some(isNaN)) {
      return NextResponse.json({ error: "Invalid IDs provided" }, { status: 400 });
    }
    
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        courses: true,
        placements: true,
      },
    });
    
    if (colleges.length !== ids.length) {
      return NextResponse.json({ error: "One or more colleges not found" }, { status: 400 });
    }
    
    return NextResponse.json(colleges);
  } catch (error) {
    console.error('Error comparing colleges:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
