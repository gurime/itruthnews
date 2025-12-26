"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../supabase/supabase';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

// ================= EXPORTED UI COMPONENTS =================

interface BannerProps {
  remaining: number;
  isSubscriber: boolean;
}

export function ArticleLimitBanner({ remaining, isSubscriber }: BannerProps) {
  if (isSubscriber) return null;

  return (
    <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-gray-800 font-medium">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold mr-2">
            {remaining}
          </span>
          {remaining === 0 
            ? "You've reached your free article limit today" 
            : `free article${remaining !== 1 ? 's' : ''} remaining today`
          }
        </p>
        <Link 
          href="/membership" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Subscribe to get unlimited articles"
        >
          Subscribe for Unlimited
        </Link>
      </div>
    </div>
  );
}

