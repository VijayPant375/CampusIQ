"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';

const EXAMS = ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT-CET", "KCET"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const STATES = [
  "Any", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
];

interface PredictorResult {
  id: number;
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  totalFees: number;
  nirfRank?: number;
  matchScore: number;
  matchReason: string;
}

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [preferredState, setPreferredState] = useState("Any");
  const [preferredType, setPreferredType] = useState("Any");
  
  const [results, setResults] = useState<PredictorResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || isNaN(Number(rank)) || Number(rank) <= 0) {
      setError("Please enter a valid positive rank.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          category,
          preferredState,
          preferredType
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch predictions");
      
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">College Predictor Tool</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Enter your exam details to find the best college matches for your profile.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Form Column */}
          <div className="w-full lg:w-1/3 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Exam</label>
                <select 
                  value={exam} 
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Overall Rank</label>
                <input 
                  type="number" 
                  value={rank} 
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred State (Optional)</label>
                <select 
                  value={preferredState} 
                  onChange={(e) => setPreferredState(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preferred Type</label>
                <div className="flex gap-4">
                  {["Any", "Public", "Private"].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="preferredType" 
                        value={type}
                        checked={preferredType === type}
                        onChange={(e) => setPreferredType(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:bg-blue-400 mt-4"
              >
                {loading ? "Analyzing matches..." : "Predict My Colleges"}
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-2/3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Crunching the numbers based on historical data...</p>
              </div>
            ) : results === null ? (
              <div className="bg-blue-50 dark:bg-blue-900/10 p-12 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Discover Your Potential</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Fill out the form to the left and click predict to see which colleges you have the best chance of getting into.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-12 rounded-2xl text-center border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No exact matches found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters like preferred state or type to see more results.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Matches for You</h2>
                {results.map((college, idx) => (
                  <div key={college.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                          {idx + 1}. {college.name}
                        </h3>
                        <Badge variant={college.type.toLowerCase() === 'public' ? 'public' : 'private'}>
                          {college.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {college.location}, {college.state}
                        </span>
                        {college.nirfRank && (
                          <span className="font-semibold text-blue-600 dark:text-blue-400">NIRF #{college.nirfRank}</span>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Match Score</span>
                          <span className="font-bold text-gray-900 dark:text-white">{college.matchScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${getScoreColor(college.matchScore)}`} style={{ width: `${college.matchScore}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">{college.matchReason}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end justify-between min-w-[140px] border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 pt-4 sm:pt-0 sm:pl-6">
                      <div className="mb-4 sm:text-right">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Annual Fees</p>
                        <p className="font-bold text-gray-900 dark:text-white">₹{(college.totalFees / 100000).toFixed(2)} LPA</p>
                        <div className="mt-2 flex sm:justify-end">
                          <StarRating rating={college.rating} />
                        </div>
                      </div>
                      <Link 
                        href={`/colleges/${college.id}`}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold rounded-xl transition-colors text-center"
                      >
                        View College
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
