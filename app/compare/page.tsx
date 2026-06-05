'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';

interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  totalFees: number;
  courses: Array<{ name: string }>;
  placements: Array<{ averagePackage: number; highestPackage: number; placementRate: number; year: number }>;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const idsParam = searchParams.get('ids');
  const ids = idsParam ? idsParam.split(',').filter(Boolean) : [];
  
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [comparisonName, setComparisonName] = useState("");

  useEffect(() => {
    if (ids.length < 2) {
      setLoading(false);
      return;
    }

    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/colleges/compare?ids=${ids.join(',')}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch comparison data');
        }
        const data = await res.json();
        setColleges(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchColleges();
  }, [idsParam]);

  const handleRemove = (idToRemove: number) => {
    const newIds = ids.filter(id => parseInt(id, 10) !== idToRemove);
    // Update localStorage
    localStorage.setItem('compareIds', JSON.stringify(newIds.map(Number)));
    window.dispatchEvent(new Event('compareUpdated'));
    
    // Update URL
    if (newIds.length > 0) {
      router.push(`/compare?ids=${newIds.join(',')}`);
    } else {
      router.push('/colleges');
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem('compareIds');
    window.dispatchEvent(new Event('compareUpdated'));
    router.push('/colleges');
  };

  const handleSaveComparison = async () => {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname + '?ids=' + ids.join(','))}`);
      return;
    }
    
    if (!comparisonName.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/user/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: comparisonName,
          collegeIds: ids.join(',')
        })
      });

      if (res.ok) {
        setShowSaveInput(false);
        setComparisonName("");
        // Optionally show toast success here later
      }
    } catch (err) {
      console.error("Error saving comparison", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (ids.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
          <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Select at least 2 colleges to compare</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-lg">You need to select multiple colleges from the browse page to see their side-by-side comparison.</p>
        <Link href="/colleges" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-blue-500/25 active:scale-95">
          Browse Colleges
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading comparison</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
          Retry
        </button>
      </div>
    );
  }

  // Pre-calculate best values for highlighting
  const bestRating = Math.max(...colleges.map(c => c.rating));
  const bestFees = Math.min(...colleges.map(c => c.totalFees));
  
  const getLatestPlacement = (college: College) => {
    if (!college.placements || college.placements.length === 0) return null;
    return [...college.placements].sort((a, b) => b.year - a.year)[0];
  };

  const bestAvgPackage = Math.max(...colleges.map(c => getLatestPlacement(c)?.averagePackage || 0));
  const bestHighestPackage = Math.max(...colleges.map(c => getLatestPlacement(c)?.highestPackage || 0));
  const bestPlacementRate = Math.max(...colleges.map(c => getLatestPlacement(c)?.placementRate || 0));

  const formatLPA = (val: number) => `₹${(val / 100000).toFixed(2)} LPA`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Compare Colleges</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Side-by-side analysis of your selected institutions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleClearAll} className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            Clear All
          </button>
          
          {showSaveInput ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Comparison Name..."
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button 
                onClick={handleSaveComparison}
                disabled={isSaving || !comparisonName.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {isSaving ? "Saving..." : "Confirm"}
              </button>
              <button 
                onClick={() => setShowSaveInput(false)}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                if (status !== 'authenticated') {
                  router.push(`/login?callbackUrl=${encodeURIComponent(pathname + '?ids=' + ids.join(','))}`);
                } else {
                  setShowSaveInput(true);
                }
              }} 
              className="px-5 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save this Comparison
            </button>
          )}
          {colleges.length < 3 && (
            <Link href="/colleges" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              + Add Another College
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800/30">
                <th className="p-6 lg:p-8 w-48 border-b border-gray-200 dark:border-gray-800 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs">
                  Features
                </th>
                {colleges.map(college => (
                  <th key={`header-${college.id}`} className="p-6 lg:p-8 border-b border-l border-gray-200 dark:border-gray-800 min-w-[250px] align-top">
                    <div className="flex flex-col h-full justify-between gap-4">
                      <Link href={`/colleges/${college.id}`} className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                        {college.name}
                      </Link>
                      <button 
                        onClick={() => handleRemove(college.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 self-start px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              
              {/* Location */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Location</td>
                {colleges.map(c => (
                  <td key={`loc-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                    {c.location}, {c.state}
                  </td>
                ))}
              </tr>

              {/* Type */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Institution Type</td>
                {colleges.map(c => (
                  <td key={`type-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800">
                    <Badge variant={c.type.toLowerCase() === 'public' ? 'public' : 'private'}>{c.type}</Badge>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Rating</td>
                {colleges.map(c => (
                  <td key={`rating-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800">
                    <div className={`inline-flex items-center px-4 py-2 rounded-xl ${c.rating === bestRating ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50' : ''}`}>
                      <StarRating rating={c.rating} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Annual Fees */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Annual Fees</td>
                {colleges.map(c => (
                  <td key={`fees-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800">
                    <span className={`font-extrabold text-xl ${c.totalFees === bestFees ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {formatLPA(c.totalFees)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Top Course */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Top Course</td>
                {colleges.map(c => (
                  <td key={`course-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                    {c.courses && c.courses.length > 0 ? c.courses[0].name : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Average Package */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Average Package</td>
                {colleges.map(c => {
                  const place = getLatestPlacement(c);
                  const isBest = place?.averagePackage === bestAvgPackage && bestAvgPackage > 0;
                  return (
                    <td key={`avg-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800">
                      <span className={`font-extrabold text-xl ${isBest ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {place ? formatLPA(place.averagePackage) : 'N/A'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Highest Package */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Highest Package</td>
                {colleges.map(c => {
                  const place = getLatestPlacement(c);
                  const isBest = place?.highestPackage === bestHighestPackage && bestHighestPackage > 0;
                  return (
                    <td key={`high-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800">
                      <span className={`font-extrabold text-xl ${isBest ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {place ? formatLPA(place.highestPackage) : 'N/A'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Placement Rate */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-6 lg:p-8 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/20">Placement Rate</td>
                {colleges.map(c => {
                  const place = getLatestPlacement(c);
                  const isBest = place?.placementRate === bestPlacementRate && bestPlacementRate > 0;
                  return (
                    <td key={`rate-${c.id}`} className="p-6 lg:p-8 border-l border-gray-100 dark:border-gray-800">
                      <span className={`font-extrabold text-xl ${isBest ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {place ? `${place.placementRate}%` : 'N/A'}
                      </span>
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}
