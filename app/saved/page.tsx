"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CollegeCard } from '@/components/colleges/CollegeCard';
import Link from 'next/link';

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'colleges' | 'comparisons'>('colleges');
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'colleges') {
        const res = await fetch('/api/user/saved');
        if (res.ok) {
          const data = await res.json();
          setSavedColleges(data);
        }
      } else {
        const res = await fetch('/api/user/comparisons');
        if (res.ok) {
          const data = await res.json();
          setSavedComparisons(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeCollege = async (collegeId: number) => {
    try {
      await fetch('/api/user/saved', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId })
      });
      setSavedColleges(prev => prev.filter(sc => sc.collegeId !== collegeId));
    } catch (err) {
      console.error(err);
    }
  };

  const removeComparison = async (id: string) => {
    try {
      await fetch('/api/user/comparisons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setSavedComparisons(prev => prev.filter(sc => sc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'loading' || (loading && status === 'authenticated')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">My Saved Items</h1>
        
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('colleges')}
            className={`pb-4 text-sm font-bold ${activeTab === 'colleges' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Saved Colleges
          </button>
          <button
            onClick={() => setActiveTab('comparisons')}
            className={`pb-4 text-sm font-bold ${activeTab === 'comparisons' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Saved Comparisons
          </button>
        </div>

        {activeTab === 'colleges' && (
          <div>
            {savedColleges.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">You haven't saved any colleges yet.</p>
                <Link href="/colleges" className="text-blue-600 font-medium mt-4 inline-block hover:underline">
                  Browse Colleges
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedColleges.map((saved) => (
                  <div key={saved.id} className="relative group">
                    <CollegeCard college={saved.college} />
                    <button
                      onClick={() => removeCollege(saved.collegeId)}
                      className="absolute top-3 right-3 z-20 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                      title="Remove from saved"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'comparisons' && (
          <div>
            {savedComparisons.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">You haven't saved any comparisons yet.</p>
                <Link href="/colleges" className="text-blue-600 font-medium mt-4 inline-block hover:underline">
                  Browse Colleges
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedComparisons.map((comp) => (
                  <div key={comp.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{comp.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{comp.collegeIds.split(',').length} Colleges</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                      <Link 
                        href={`/compare?ids=${comp.collegeIds}`}
                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                      >
                        View Comparison
                      </Link>
                      <button
                        onClick={() => removeComparison(comp.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
