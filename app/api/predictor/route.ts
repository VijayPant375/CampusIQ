import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { exam, rank, category, preferredState, preferredType } = body;

    if (!exam || !rank || !category || !preferredType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const numRank = parseInt(rank, 10);
    if (isNaN(numRank) || numRank <= 0) {
      return NextResponse.json({ message: "Rank must be a positive integer" }, { status: 400 });
    }

    // Apply category relaxation
    let adjustedRank = numRank;
    if (category === "SC" || category === "ST") adjustedRank = Math.floor(numRank / 3);
    else if (category === "OBC") adjustedRank = Math.floor(numRank / 1.5);
    else if (category === "EWS") adjustedRank = Math.floor(numRank / 1.2);

    let whereClause: any = {};
    if (preferredState && preferredState !== "Any") {
      whereClause.state = preferredState;
    }
    if (preferredType && preferredType !== "Any") {
      whereClause.type = preferredType; // "Public" or "Private"
    }

    // Get all matching colleges first
    const colleges = await prisma.college.findMany({
      where: whereClause,
      include: { tags: true }
    });

    let results: any[] = [];

    // Helper to add colleges with scores
    const addResult = (collegesList: any[], matchReason: string, baseScore: number, matchStateBonus: boolean = true) => {
      for (const c of collegesList) {
        if (results.some(r => r.id === c.id)) continue;
        if (results.length >= 10) break;
        
        let score = baseScore;
        // If preferredState is "Any", no bonus. If they chose one, and it matches, give bonus.
        // Wait, whereClause already filters by preferredState if it's set. 
        // So we just use baseScore. We might add slight randomness or variation to score.
        score = Math.max(0, Math.min(100, score - Math.floor(Math.random() * 5)));
        
        results.push({
          ...c,
          matchScore: score,
          matchReason
        });
      }
    };

    if (exam === "JEE Advanced") {
      const iits = colleges.filter(c => c.tags.some(t => t.tag === "IIT")).sort((a, b) => (a.nirfRank || 999) - (b.nirfRank || 999));
      if (adjustedRank < 2000) {
        addResult(iits, "Strong match based on excellent JEE Advanced rank", 95);
      } else if (adjustedRank <= 10000) {
        const nits = colleges.filter(c => c.tags.some(t => t.tag === "NIT")).sort((a, b) => (a.nirfRank || 999) - (b.nirfRank || 999));
        addResult(iits, "Good chance for newer IITs or specific branches", 80);
        addResult(nits, "Very strong match for top NITs", 90);
      } else {
        const privs = colleges.filter(c => c.type === "Private").sort((a, b) => b.rating - a.rating);
        addResult(privs, "Good fit for top private institutions", 75);
      }
    } else if (exam === "JEE Main") {
      const nits = colleges.filter(c => c.tags.some(t => t.tag === "NIT")).sort((a, b) => (a.nirfRank || 999) - (b.nirfRank || 999));
      const privs = colleges.filter(c => c.type === "Private").sort((a, b) => b.rating - a.rating);
      
      if (adjustedRank < 10000) {
        addResult(nits, "Strong match for top NITs with your rank range", 95);
      } else if (adjustedRank <= 50000) {
        addResult(nits, "Possible match for newer NITs or specific branches", 70);
        addResult(privs, "Strong match for top private colleges", 85);
      } else {
        addResult(privs, "Good fit for private institutions", 75);
        addResult(colleges.filter(c => c.type === "Public" && !c.tags.some(t => t.tag === "IIT" || t.tag === "NIT")).sort((a,b)=> b.rating - a.rating), "Match for state government colleges", 70);
      }
    } else if (exam === "BITSAT") {
      const bits = colleges.filter(c => c.name.includes("BITS") || c.name.includes("Birla"));
      if (adjustedRank < 200) {
        addResult(bits, "Strong match for BITS campuses", 95);
      } else {
        const privs = colleges.filter(c => c.type === "Private").sort((a, b) => b.rating - a.rating);
        addResult(privs, "Alternative private institutions based on your rank", 75);
      }
    } else {
      // Other exams (VITEEE, MHT-CET, KCET)
      const sorted = [...colleges].sort((a, b) => b.rating - a.rating);
      addResult(sorted, `Good fit based on ${exam} score and preferences`, 80);
    }

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(results.slice(0, 10), { status: 200 });
  } catch (error) {
    console.error("Predictor error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
