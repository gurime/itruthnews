"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../supabase/supabase';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

interface UserProfile {
id: string;
subscription_status: "free" | "monthly" | "yearly" | "premium" | "elite";
articles_read_today: number;
last_read_date: string;
}

interface ArticleAccessProps {
articleId: string;
isPremium?: boolean;
children: React.ReactNode;
}

export default function ArticleAccess({ articleId, isPremium = false, children }: ArticleAccessProps) {
const router = useRouter();
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [guestArticlesRead, setGuestArticlesRead] = useState(0);
const [isAuthChecked, setIsAuthChecked] = useState(false);
const [showPaywall, setShowPaywall] = useState(false);
const [hasAccess, setHasAccess] = useState(false);
const [isLoading, setIsLoading] = useState(true);

const premiumFeatures = [
'Unlimited articles across all sections',
'Ad-free reading on all devices',
'Full access to investigative journalism',
'Subscriber-only newsletters and briefings',
'Complete archive dating back 10+ years',
'Enhanced mobile and tablet app experience',
'Offline reading with save-for-later',
'Commenting privileges on articles'
];

const eliteFeatures = [
'Everything in Premium, plus:',
'Full access to iTruth Business & Markets',
'Real-time market data and analysis',
'Exclusive Business section reporting',
'Company profiles and earnings coverage',
'Interactive business news tools',
'Virtual events with journalists and experts',
'Gift up to 10 articles per month to non-subscribers',
'Discounted tickets to iTruth Live events',
'Early access to major investigations',
'Priority customer service'
];

// ========== HELPER FUNCTIONS ==========
function isUserSubscriber(profile: UserProfile | null): boolean {
return ['monthly', 'yearly', 'premium', 'elite'].includes(
profile?.subscription_status || ''
);
}

function isSubscriber(): boolean {
return isUserSubscriber(userProfile);
}

function getCurrentReadCount(): number {
return userProfile 
? userProfile.articles_read_today 
: guestArticlesRead;
}

function getRemainingArticles(): number {
return Math.max(0, 5 - getCurrentReadCount());
}

// ========== DATA FETCHING ==========
async function getUserProfile(userId: string): Promise<UserProfile | null> {
try {
const { data, error } = await supabase
.from("profiles")
.select("id, subscription_status, articles_read_today, last_read_date")
.eq("id", userId)
.single();

if (error) throw error;

const today = new Date().toLocaleDateString("en-CA");
if (data && data.last_read_date !== today) {
await supabase
.from("profiles")
.update({ 
articles_read_today: 0, 
last_read_date: today 
})
.eq("id", userId);

return {
...data,
articles_read_today: 0,
last_read_date: today
};
}

return data;
} catch (err) {
console.error('Error fetching user profile:', err);
return null;
}
}

async function fetchGuestArticleCount(): Promise<number> {
try {
const response = await fetch('/api/get-article-count');
const data = await response.json();
const count = data.count || 0;
setGuestArticlesRead(count);
return count;
} catch (error) {
console.error('Error fetching guest count:', error);
setGuestArticlesRead(0);
return 0;
}
}

// ========== ARTICLE TRACKING ==========
async function incrementUserArticleCount(userId: string, currentProfile: UserProfile | null) {
try {
const today = new Date().toLocaleDateString("en-CA");
const newCount = (currentProfile?.articles_read_today || 0) + 1;

const { error } = await supabase
.from("profiles")
.update({ 
articles_read_today: newCount,
last_read_date: today
})
.eq("id", userId);

if (error) throw error;

setUserProfile(prev => prev ? {
...prev,
articles_read_today: newCount,
last_read_date: today
} : null);
} catch (error) {
console.error('Failed to increment article count:', error);
}
}

async function trackGuestArticleRead(): Promise<boolean> {
try {
const response = await fetch('/api/track-article-read', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ articleId })
});

const data = await response.json();

if (data.count !== undefined) {
setGuestArticlesRead(data.count);
}

return data.allowed || false;
} catch (error) {
console.error('Error tracking guest read:', error);
return false;
}
}

// ========== INITIALIZATION ==========
useEffect(() => {
let mounted = true;

async function init() {
const { data: { user } } = await supabase.auth.getUser();

if (!mounted) return;

if (user) {
const profile = await getUserProfile(user.id);
if (mounted) {
setUserProfile(profile);
}
}

if (mounted) {
setIsAuthChecked(true);
}
}

init();

return () => {
mounted = false;
};
}, []);

// ========== AUTH STATE CHANGES ==========
useEffect(() => {
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
if (event === 'SIGNED_IN' && session?.user) {
const profile = await getUserProfile(session.user.id);
setUserProfile(profile);
setIsAuthChecked(true);
} else if (event === 'SIGNED_OUT') {
setUserProfile(null);
setIsAuthChecked(true);
}
});

return () => subscription.unsubscribe();
}, []);

// ========== ACCESS CHECK ==========
// ✅ FIX: Remove checkArticleAccess from dependencies to prevent infinite loop
useEffect(() => {
if (!isAuthChecked) return;

async function checkAccess() {
setIsLoading(true);
setShowPaywall(false);
setHasAccess(false);

// Logged-in user
if (userProfile) {
if (isUserSubscriber(userProfile)) {
setHasAccess(true);
setIsLoading(false);
return;
}

const count = userProfile.articles_read_today || 0;

if (isPremium || count >= 5) {
setShowPaywall(true);
setIsLoading(false);
return;
}

await incrementUserArticleCount(userProfile.id, userProfile);
setHasAccess(true);
setIsLoading(false);
return;
}

// Guest
const guestCount = await fetchGuestArticleCount();

if (isPremium || guestCount >= 5) {
setShowPaywall(true);
setIsLoading(false);
return;
}

const allowed = await trackGuestArticleRead();
setHasAccess(allowed);
setShowPaywall(!allowed);
setIsLoading(false);
}

checkAccess();
}, [articleId, isPremium, isAuthChecked]);

// ========== HELPER FUNCTIONS ==========

// ========== RENDER ==========
if (isLoading || !isAuthChecked) {
return (
<div className="min-h-screen bg-gray-50">
<article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
{/* Category + Go Back */}
<div className="flex justify-between items-center mb-6">
<div className="h-6 w-28 bg-gray-300 rounded-full" />
<div className="h-8 w-8 bg-gray-300 rounded-full" />
</div>

{/* Title */}
<div className="space-y-3 mb-8">
<div className="h-10 bg-gray-300 rounded w-3/4" />
<div className="h-10 bg-gray-300 rounded w-2/3" />
</div>

{/* Meta Info */}
<div className="flex flex-wrap gap-4 mb-8">
{[...Array(4)].map((_, i) => (
<div key={i} className="h-4 w-32 bg-gray-300 rounded" />
))}
</div>

{/* Disclaimer Bar */}
<div className="h-10 bg-gray-400 rounded mb-8" />

{/* Social + Bookmark */}
<div className="flex justify-between items-center border-y py-4 mb-8">
<div className="flex gap-4">
{[...Array(3)].map((_, i) => (
<div key={i} className="h-6 w-6 bg-gray-300 rounded" />
))}
</div>
<div className="h-8 w-24 bg-gray-300 rounded" />
</div>

{/* Hero Image */}
<div className="h-96 w-full bg-gray-300 rounded mb-10" />

{/* Excerpt */}
<div className="p-6 bg-gray-200 rounded mb-10 space-y-3">
<div className="h-4 bg-gray-300 rounded w-full" />
<div className="h-4 bg-gray-300 rounded w-5/6" />
</div>

{/* Body Content */}
<div className="max-w-3xl mx-auto space-y-6 mb-12">
{[...Array(8)].map((_, i) => (
<div key={i} className="space-y-2">
<div className="h-4 bg-gray-300 rounded w-full" />
<div className="h-4 bg-gray-300 rounded w-11/12" />
<div className="h-4 bg-gray-300 rounded w-10/12" />
</div>
))}
</div>
</article>
</div>
);
}

if (showPaywall && !hasAccess) {
return (
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative transform transition-all max-h-[90vh] overflow-y-auto">
<button
onClick={() => router.push('/')}
className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 z-10"
aria-label="Go back to homepage"
>
<X className="w-5 h-5" />
</button>

<div className="text-center mb-8 max-w-2xl mx-auto">
<div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
</div>

<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
{getCurrentReadCount() >= 5 ? "You've Hit Your Limit" : isPremium ? "Premium Content" : "Choose Your Plan"}
</h2>

<p className="text-gray-600 text-base sm:text-lg leading-relaxed">
{getCurrentReadCount() >= 5
? "You've read all 5 free articles today. Upgrade to continue reading unlimited premium content."
: isPremium 
? "This is premium content. Subscribe to access this article and our entire library."
: "Subscribe to unlock this article and access our entire library of premium content."}
</p>
</div>

<div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
{/* Premium Tier */}
<div className="group border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
<div className="mb-6">
<h3 className="text-xl font-bold text-gray-900 mb-3">Premium</h3>
<div className="flex items-baseline gap-1 mb-1">
<span className="text-5xl font-bold text-gray-900">$12</span>
<span className="text-lg text-gray-600">/month</span>
</div>
<p className="text-sm text-gray-500">Billed monthly • Cancel anytime</p>
</div>

<ul className="space-y-3 mb-8">
{premiumFeatures.map((feature, index) => (
<li key={index} className="flex items-start gap-3 text-sm text-gray-700">
<div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
<Check className="w-3.5 h-3.5 text-blue-600" strokeWidth={3} />
</div>
<span className="leading-tight">{feature}</span>
</li>
))}
</ul>

<Link
href="/membership?plan=premium"
className="block w-full bg-gray-900 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-[1.02]"
>
Choose Premium
</Link>
</div>

{/* Elite Tier */}
<div className="group relative border-2 border-blue-600 rounded-2xl p-6 bg-linear-to-br from-blue-50 via-white to-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
<div className="absolute -top-4 left-1/2 -translate-x-1/2">
<div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
⭐ Most Popular
</div>
</div>

<div className="mb-6 mt-2">
<h3 className="text-xl font-bold text-gray-900 mb-3">Elite</h3>
<div className="flex items-baseline gap-1 mb-1">
<span className="text-5xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">$25</span>
<span className="text-lg text-gray-600">/month</span>
</div>
<p className="text-sm text-gray-500">Billed monthly • Cancel anytime</p>
</div>

<ul className="space-y-3 mb-8">
{eliteFeatures.map((feature, index) => (
<li key={index} className="flex items-start gap-3 text-sm">
<div className="shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
<Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
</div>
<span className={`leading-tight ${index === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
{feature}
</span>
</li>
))}
</ul>

<Link
href="/membership?plan=elite"
className="block w-full bg-linear-to-r from-blue-600 to-blue-700 text-white text-center py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
>
Choose Elite
</Link>
</div>
</div>

<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
<div className="flex items-center gap-2">
<svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
</svg>
<span>Secure payment</span>
</div>
<div className="flex items-center gap-2">
<svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
</svg>
<span>Cancel anytime</span>
</div>
<div className="flex items-center gap-2">
<svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
<path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
</svg>
<span>Join 10,000+ readers</span>
</div>
</div>

<div className="text-center">
<button
onClick={() => router.push('/')}
className="text-gray-500 text-sm hover:text-gray-700 transition-colors font-medium cursor-pointer"
>
Go back to homepage
</button>
</div>
</div>
</div>
);
}

// Show article counter banner + content
return (
<>
{!isSubscriber() && (
<div className="mb-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
<div className="flex items-center justify-between gap-4 flex-wrap">
<p className="text-gray-800 font-medium">
<span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold mr-2">
{getRemainingArticles()}
</span>
{getRemainingArticles() === 0 
? "You've reached your free article limit today" 
: `free article${getRemainingArticles() !== 1 ? 's' : ''} remaining today`
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
)}

{children}
</>
);
}