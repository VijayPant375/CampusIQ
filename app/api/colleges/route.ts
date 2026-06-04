import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const search = searchParams.get('search');
    const state = searchParams.get('state');
    const type = searchParams.get('type');
    const minFees = searchParams.get('minFees');
    const maxFees = searchParams.get('maxFees');
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    
    const where: Prisma.CollegeWhereInput = {};
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (state) {
      where.state = state;
    }
    if (type) {
      where.type = type;
    }
    if (minFees || maxFees) {
      where.totalFees = {};
      if (minFees) where.totalFees.gte = parseInt(minFees, 10);
      if (maxFees) where.totalFees.lte = parseInt(maxFees, 10);
    }
    
    const skip = (page - 1) * limit;
    
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: {
          courses: true,
          placements: true,
        },
        orderBy: {
          rating: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);
    
    return NextResponse.json({
      colleges,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
