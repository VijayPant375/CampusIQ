"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DiscussionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchQuestions = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions${query ? `?q=${encodeURIComponent(query)}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(search);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Discussions</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Ask questions and get answers from the CampusIQ community.</p>
          </div>
          <Link 
            href="/discussions/ask"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm inline-flex items-center justify-center whitespace-nowrap"
          >
            Ask a Question
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
              className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No discussions found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Be the first to ask a question and start a conversation!
            </p>
            <Link 
              href="/discussions/ask"
              className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <Link key={q.id} href={`/discussions/${q.id}`} className="block bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-shrink-0 flex sm:flex-col gap-4 sm:gap-2 text-center text-sm">
                    <div className="flex sm:flex-col items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800 min-w-[70px]">
                      <span className="font-bold text-gray-900 dark:text-white sm:text-lg mr-1 sm:mr-0">{q._count.answers}</span>
                      <span className="text-gray-500">answers</span>
                    </div>
                    <div className="flex sm:flex-col items-center justify-center p-2 rounded-lg text-gray-500 min-w-[70px]">
                      <span className="font-bold sm:text-lg mr-1 sm:mr-0">{q.views}</span>
                      <span>views</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:underline mb-2 line-clamp-2">
                      {q.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {q.body}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {q.tags?.map((t: any) => (
                          <span key={t.id} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-md">
                            {t.tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {q.user?.image ? (
                          <img src={q.user.image} alt={q.user.name} className="w-5 h-5 rounded-full" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold">
                            {q.user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <span>{q.user?.name || "User"}</span>
                        <span>•</span>
                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
