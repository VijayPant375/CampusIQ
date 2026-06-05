import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';

interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  totalFees: number;
  imageUrl?: string;
}

function getGradient(name: string) {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('');
}

export function CollegeCard({ college }: { college: College }) {
  // Format fees in LPA (Lakhs Per Annum). E.g., 230000 -> 2.30 LPA
  const feesInLPA = (college.totalFees / 100000).toFixed(2);

  return (
    <Link href={`/colleges/${college.id}`} className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-0">
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
        {college.imageUrl ? (
          <img 
            src={college.imageUrl} 
            alt={college.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradient(college.name)} group-hover:scale-105 transition-transform duration-500 ease-in-out`}>
            <span className="text-4xl font-bold text-white tracking-wider">
              {getInitials(college.name)}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={college.type.toLowerCase() === 'public' ? 'public' : 'private'}>
            {college.type}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow relative bg-white dark:bg-gray-800">
        <h3 className="text-[17px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {college.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">
          <svg className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {college.location}, {college.state}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Annual Fees</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">₹{feesInLPA} LPA</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Rating</p>
            <StarRating rating={college.rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}
