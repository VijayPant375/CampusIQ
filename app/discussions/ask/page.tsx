"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AskQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/discussions/ask');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch colleges for dropdown
    const fetchColleges = async () => {
      try {
        const res = await fetch('/api/colleges');
        if (res.ok) {
          const data = await res.json();
          setColleges(data);
        }
      } catch (err) {}
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    setLoading(true);
    setError("");

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          collegeId: collegeId ? Number(collegeId) : undefined,
          tags
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post question");

      router.push(`/discussions/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Ask a Question</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Get help from the community.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">{error}</div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Title</label>
              <p className="text-xs text-gray-500 mb-2">Be specific and imagine you're asking a question to another person.</p>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Is the placement rate at XYZ college accurate?"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Details</label>
              <p className="text-xs text-gray-500 mb-2">Include all the information someone would need to answer your question.</p>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Related College (Optional)</label>
              <select 
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">None</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Tags (Optional)</label>
              <p className="text-xs text-gray-500 mb-2">Add up to 5 comma-separated tags to describe what your question is about.</p>
              <input 
                type="text" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. placements, hostel, cse"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:bg-blue-400"
              >
                {loading ? "Posting..." : "Post Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
