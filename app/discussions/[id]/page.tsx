"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DiscussionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [answering, setAnswering] = useState(false);
  const [answerError, setAnswerError] = useState("");

  const fetchQuestion = async () => {
    try {
      const res = await fetch(`/api/questions/${id}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setQuestion(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/discussions/${id}`);
      return;
    }
    if (!answerBody.trim()) {
      setAnswerError("Answer cannot be empty.");
      return;
    }

    setAnswering(true);
    setAnswerError("");

    try {
      const res = await fetch(`/api/questions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answerBody })
      });
      if (!res.ok) throw new Error("Failed to post answer");
      
      setAnswerBody("");
      await fetchQuestion(); // refresh to get new answer
    } catch (err: any) {
      setAnswerError(err.message);
    } finally {
      setAnswering(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/questions/${id}/answers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerId, isAccepted: !currentStatus })
      });
      await fetchQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Question not found</h2>
        <Link href="/discussions" className="text-blue-600 hover:underline">Back to Discussions</Link>
      </div>
    );
  }

  const isQuestionOwner = session?.user?.id === question.userId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <Link href="/discussions" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
            &larr; Back to all discussions
          </Link>
        </div>

        {/* Question Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-8">
          <div className="flex justify-between items-start mb-6 gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {question.title}
            </h1>
            <div className="text-right flex-shrink-0 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">{question.views}</span> views
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            {question.user?.image ? (
              <img src={question.user.image} alt={question.user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                {question.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-200 block">{question.user?.name || "User"}</span>
              <span>Asked on {new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8 whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-[17px] leading-relaxed">
            {question.body}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {question.tags?.map((t: any) => (
                <span key={t.id} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-md">
                  {t.tag}
                </span>
              ))}
            </div>
            {question.college && (
              <Link href={`/colleges/${question.college.id}`} className="text-sm font-bold text-gray-600 hover:text-blue-600 dark:text-gray-400 flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                Related: {question.college.name} &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* Answers Area */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h3>

          <div className="space-y-6">
            {question.answers.map((answer: any) => (
              <div key={answer.id} className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border ${answer.isAccepted ? 'border-green-400 dark:border-green-600 ring-1 ring-green-400/50' : 'border-gray-200 dark:border-gray-800'} p-8 relative flex gap-6`}>
                
                {/* Voting / Accept Column */}
                <div className="flex flex-col items-center">
                  {answer.isAccepted && (
                    <div className="text-green-500 mb-4" title="Accepted Answer">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {isQuestionOwner && (
                    <button 
                      onClick={() => handleAcceptAnswer(answer.id, answer.isAccepted)}
                      className={`p-2 rounded-full ${answer.isAccepted ? 'bg-green-100 text-green-600' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}`}
                      title={answer.isAccepted ? "Unaccept" : "Mark as accepted"}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="prose dark:prose-invert max-w-none mb-6 whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-base">
                    {answer.body}
                  </div>

                  <div className="flex items-center justify-end">
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-xl inline-block border border-gray-100 dark:border-gray-700/50">
                      <span className="text-xs text-gray-500 block mb-1">Answered {new Date(answer.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        {answer.user?.image ? (
                          <img src={answer.user.image} alt={answer.user.name} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {answer.user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{answer.user?.name || "User"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Answer */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Answer</h3>
          <form onSubmit={handlePostAnswer}>
            {answerError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{answerError}</div>
            )}
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              rows={6}
              placeholder="Write your answer here..."
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            ></textarea>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {status !== 'authenticated' ? "You must be logged in to answer." : ""}
              </span>
              <button 
                type="submit" 
                disabled={answering}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                {answering ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
