'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { TabNav } from '@/components/colleges/TabNav';
import { PlacementCard } from '@/components/colleges/PlacementCard';
import { ReviewCard } from '@/components/colleges/ReviewCard';
import { CompareBar } from '@/components/colleges/CompareBar';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setCollege(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    const checkSavedState = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/user/saved');
          if (res.ok) {
            const savedColleges = await res.json();
            const currentId = parseInt(id as string, 10);
            setIsSaved(savedColleges.some((sc: any) => sc.collegeId === currentId));
          }
        } catch (err) {}
      }
    };

    fetchCollege();
    checkSavedState();
  }, [id, status]);

  useEffect(() => {
    const checkCompareIds = () => {
      const idsStr = localStorage.getItem('compareIds');
      if (idsStr) {
        try {
          const ids = JSON.parse(idsStr);
          setCompareIds(Array.isArray(ids) ? ids : []);
        } catch(e) {}
      }
    };
    checkCompareIds();
    window.addEventListener('compareUpdated', checkCompareIds);
    return () => window.removeEventListener('compareUpdated', checkCompareIds);
  }, []);

  const handleAddToCompare = () => {
    const currentId = parseInt(id as string, 10);
    if (isNaN(currentId)) return;
    
    let newIds = [...compareIds];
    if (!newIds.includes(currentId)) {
      if (newIds.length >= 3) return;
      newIds.push(currentId);
      localStorage.setItem('compareIds', JSON.stringify(newIds));
      window.dispatchEvent(new Event('compareUpdated'));
    }
  };

  const handleSaveCollege = async () => {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const currentId = parseInt(id as string, 10);
    if (isNaN(currentId)) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        await fetch('/api/user/saved', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: currentId })
        });
        setIsSaved(false);
      } else {
        await fetch('/api/user/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: currentId })
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl text-center max-w-md w-full shadow-sm border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">College Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">The college you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors w-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentId = parseInt(id as string, 10);
  const isAdded = compareIds.includes(currentId);
  const isFull = compareIds.length >= 3 && !isAdded;

  let compareButtonText = "Add to Compare";
  if (isAdded) compareButtonText = "Added to Compare";
  else if (isFull) compareButtonText = "Compare Full \u2014 Remove one first";

  const latestPlacement = college.placements?.length 
    ? [...college.placements].sort((a, b) => b.year - a.year)[0]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[450px] w-full bg-gray-900">
        {college.imageUrl ? (
          <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-5">
                  <Badge variant={college.type.toLowerCase() === 'public' ? 'public' : 'private'}>
                    {college.type}
                  </Badge>
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <StarRating rating={college.rating} />
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  {college.name}
                </h1>
                <div className="flex items-center text-gray-300 text-lg font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {college.location}, {college.state}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSaveCollege}
                  disabled={isSaving}
                  className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold shadow-xl transition-all duration-300 ${
                    isSaved 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/20'
                      : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSaved ? 0 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isSaved ? "Saved" : "Save College"}
                </button>
                <button 
                  onClick={handleAddToCompare}
                  disabled={isAdded || isFull}
                  className={`flex-shrink-0 px-8 py-3.5 rounded-2xl font-bold shadow-xl transition-all duration-300 ${
                    isAdded 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                      : isFull
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-blue-50 hover:scale-105 active:scale-95 hover:shadow-blue-500/20'
                  }`}
                >
                  {compareButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 md:px-10 pt-6 md:pt-8 bg-gray-50/50 dark:bg-gray-800/20">
            <TabNav 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              tabs={['Overview', 'Courses', 'Placements']} 
            />
          </div>

          <div className="p-6 md:p-10 min-h-[500px]">
            {/* Overview Tab */}
            {activeTab === 'Overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About the Institution</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-12 max-w-4xl">
                  {college.overview}
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Key Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Total Annual Fees</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{(college.totalFees / 100000).toFixed(2)} <span className="text-xl font-bold text-gray-500">LPA</span></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Institution Rating</p>
                    <div className="flex items-center space-x-3">
                      <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{college.rating}</p>
                      <StarRating rating={college.rating} />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Location</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{college.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'Courses' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {college.courses?.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Course Name
                          </th>
                          <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Duration
                          </th>
                          <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Annual Fees
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800/50">
                        {college.courses.map((course: any) => (
                          <tr key={course.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-8 py-5 whitespace-nowrap text-[15px] font-bold text-gray-900 dark:text-white">
                              {course.name}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-[15px] font-medium text-gray-500 dark:text-gray-400">
                              {course.duration}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-[15px] font-bold text-blue-600 dark:text-blue-400">
                              ₹{course.fees.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No courses listed.</p>
                  </div>
                )}
              </div>
            )}

            {/* Placements Tab */}
            {activeTab === 'Placements' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {latestPlacement ? (
                  <div className="mb-12">
                    <PlacementCard placement={latestPlacement} />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic mb-8">No placement data available.</p>
                )}

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Reviews</h3>
                {college.reviews?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {college.reviews.map((review: any) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CompareBar />
    </div>
  );
}
