"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X,  Lock, Check  } from "lucide-react";
import supabase from "@/app/supabase/supabase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";



interface Article {
id: number;
title: string;
excerpt: string;
category: string;
created_at: string;
image: string;
featured?: boolean;
premium?: boolean;
}

interface UserProfile {
subscription_status: "free" | "monthly" | "yearly";
articles_read_this_month: number;
}

export default function Columnists() {
const router = useRouter();
const [isLoading, setIsLoading] = useState(true);
const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
const [articles, setArticles] = useState<Article[]>([]);
const [error, setError] = useState<string | null>(null);

const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [articlesRead, setArticlesRead] = useState(0);
const [showPaywall, setShowPaywall] = useState(false);


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


/* -------------------- FETCH USER -------------------- */
useEffect(() => {
const stored = localStorage.getItem("articlesReadToday");
const today = new Date().toLocaleDateString("en-CA");
const todayCount = getArticlesReadToday();
setArticlesRead(todayCount);
if (stored) {
const parsed = JSON.parse(stored);

if (parsed.date === today) {
setArticlesRead(parsed.count);
} else {
// New day → reset count
setArticlesRead(0);
localStorage.setItem(
"articlesReadToday",
JSON.stringify({ count: 0, date: today })
);
}
} else {
// First time today
localStorage.setItem(
"articlesReadToday",
JSON.stringify({ count: 0, date: today })
);
}

fetchUserProfile();
fetchArticles();

}, []);

async function fetchUserProfile() {
const {
data: { user },
} = await supabase.auth.getUser();
if (!user) return;

const { data } = await supabase
.from("profiles")
.select("subscription_status, articles_read_this_month")
.eq("id", user.id)
.single();

setUserProfile(data);
}

/* -------------------- FETCH ARTICLES -------------------- */
async function fetchArticles() {
try {
setIsLoading(true);

const { data: featured } = await supabase
.from("columnists")
.select("*")
.eq("featured", true)
.single();

setFeaturedArticle(featured);

const { data } = await supabase
.from("columnists")
.select("*")
.eq("featured", false)
.order("created_at", { ascending: false })
.limit(6);

setArticles(data || []);
} catch (err) {
setError("Failed to load articles");
} finally {
setIsLoading(false);
}
}

/* -------------------- PAYWALL LOGIC -------------------- */
function handleArticleClick(e: React.MouseEvent, article: Article) {
e.preventDefault(); // always prevent default, we'll manually navigate

// Default to free user if profile not loaded or status is "free"
const isSubscriber = userProfile?.subscription_status === "monthly" || 
userProfile?.subscription_status === "yearly";
const today = new Date().toLocaleDateString("en-CA");

// Get current count from localStorage for most up-to-date value
const stored = localStorage.getItem("articlesReadToday");
let currentCount = 0;

if (stored) {
const parsed = JSON.parse(stored);
if (parsed.date === today) {
currentCount = parsed.count;
}
}



// BLOCK: non-subscribers hitting limit
if (!isSubscriber) {
if (currentCount >= 5 || article.premium) {
setShowPaywall(true);
return;
}

const newCount = currentCount + 1;
localStorage.setItem(
"articlesReadToday",
JSON.stringify({ count: newCount, date: today })
);
setArticlesRead(newCount); // make UI reflect the new count
}
else {
}

// Navigate manually
router.push(`/Articles/${article.id}`);
}

/* -------------------- HELPERS -------------------- */
const formatDate = (d: string) =>
new Date(d).toLocaleDateString("en-US", {
month: "short",
day: "numeric",
year: "numeric",
});

function getArticlesReadToday() {
if (typeof window === "undefined") return 0;

const today = new Date().toLocaleDateString("en-CA");
const stored = localStorage.getItem("articlesReadToday");

if (!stored) return 0;

const parsed = JSON.parse(stored);
return parsed.date === today ? parsed.count : 0;
}





/* -------------------- UI -------------------- */
// Featured Dashboard Skeleton
function FeaturedDashboardSkeleton() {
return (
<div className="container mx-auto p-6">
{/* Featured Article Skeleton */}
<div className="mb-8">
<div className="w-48 h-8 bg-gray-300 animate-pulse rounded mb-4"></div>
<div className="bg-white rounded-lg shadow-lg overflow-hidden">
<div className="md:flex">
<div className="md:w-2/3 h-96 bg-gray-300 animate-pulse"></div>
<div className="md:w-1/3 p-6 space-y-4">
<div className="w-24 h-6 bg-gray-300 animate-pulse rounded"></div>
<div className="w-full h-8 bg-gray-300 animate-pulse rounded"></div>
<div className="space-y-2">
<div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
<div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
<div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
</div>
<div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
</div>
</div>
</div>
</div>

{/* Regular Articles Skeleton */}
<div className="w-48 h-8 bg-gray-300 animate-pulse rounded mb-4"></div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{[...Array(6)].map((_, i) => (
<div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
<div className="w-full h-48 bg-gray-300 animate-pulse"></div>
<div className="p-4 space-y-3">
<div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded"></div>
<div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
<div className="w-5/6 h-4 bg-gray-200 animate-pulse rounded"></div>
<div className="flex justify-between items-center mt-4">
<div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
<div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
</div>
</div>
</div>
))}
</div>
</div>
);
}

const featuredLocked =
!!featuredArticle &&
(!userProfile || userProfile.subscription_status === "free") &&
(featuredArticle.premium || articlesRead >= 5);


if (isLoading) {
return (
<>
<FeaturedDashboardSkeleton />
</>
);
}if (error) return <div className="p-12 text-red-600">{error}</div>;

return (
<>
<Navbar/>
<div className="container mx-auto p-6">
{/* FREE COUNTER - Show if not subscribed */}
{(!userProfile || userProfile?.subscription_status === "free") && (
<div 
className="mb-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm"
role="status"
aria-live="polite"
>
<div className="flex items-center justify-between gap-4 flex-wrap">
<p className="text-gray-800 font-medium">
<span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold mr-2">
{Math.max(0, 5 - articlesRead)}
</span>
{articlesRead >= 5 
? "You've reached your free article limit" 
: `free article${5 - articlesRead !== 1 ? 's' : ''} remaining today`
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

{/* FEATURED */}
{featuredArticle && (
<Link
href={`/Articles/${featuredArticle.id}`}
onClick={(e) => handleArticleClick(e, featuredArticle)}
// Remove block, add grid/flex classes for responsiveness
className="bg-white rounded-xl shadow mb-12 overflow-hidden hover:shadow-lg transition-shadow md:flex" 
>
{/* Left Column (Image) - 5/12 of the width on md screens and up */}
<div className="relative w-full md:w-5/12">
<Image
src={featuredArticle.image}
alt={featuredArticle.title}
priority
width={1000}
height={600} 
className={`object-cover w-full h-full ${featuredLocked ? "opacity-60" : ""}`}
/>
{/* If you wanted to show the premium lock here too */}
{featuredLocked && (

<div className="absolute top-2 right-2 bg-amber-500 p-2 rounded-full text-white z-10">
<Lock size={16} />
</div>
)}
</div>

{/* Right Column (Content) - 7/12 of the width on md screens and up */}
<div className="p-6 md:w-7/12 lg:w-1/2 md:flex md:flex-col md:justify-between">
<div>
<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
{featuredArticle.title}
</h2>
<p
className={`text-gray-600 text-sm sm:text-base mb-4 ${
featuredLocked ? "blur-sm" : ""
}`}
>
{featuredArticle.excerpt}
</p>
</div>

{/* Footer/Meta Info */}
<div className="flex  sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 pt-4 border-t gap-2 mt-auto">
<time dateTime={featuredArticle.created_at} className="flex items-center">
📅 {formatDate(featuredArticle.created_at)}
</time>
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
{featuredArticle.category}
</span>
</div>
</div>
</Link>
)}

<div className="pb-8 border-b border-gray-200 mb-8"></div>

{Array.isArray(articles) && articles.length > 0 && (
<section aria-labelledby="headlines-heading" className="mt-10">
<div className="flex items-center justify-between mb-6">
<h2
id="headlines-heading"
className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
>
Headlines
</h2>
<p className="text-sm text-gray-500">
Latest stories curated for you
</p>
</div>

<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
{articles.map((article) => {
const locked =
(!userProfile || userProfile.subscription_status === "free") &&
(article.premium || articlesRead >= 5);

return (
<Link
key={article.id}
href={`/Articles/${article.id}`}
onClick={(e) => handleArticleClick(e, article)}
className="relative bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
>
{locked && (
<div className="absolute top-2 right-2 bg-amber-500 p-2 rounded-full text-white z-10">
<Lock size={16} />
</div>
)}

<div className="relative w-full h-80">
<Image
src={article.image}
alt={article.title}
fill
priority
className={`object-cover ${locked ? "opacity-60" : ""}`}
/>
</div>

<div className="p-4">
<h3 className="font-semibold mb-2">{article.title}</h3>

<p className={`text-sm text-gray-600 ${locked ? "blur-sm" : ""}`}>
{article.excerpt}
</p>

<div className="text-xs mt-2 text-gray-500 flex justify-between items-center">
<span>{formatDate(article.created_at)}</span>
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
{article.category}
</span>
</div>
</div>
</Link>
);
})}
</div>
</section>
)}

</div>








{/* PAYWALL MODAL */}
{showPaywall && (
<div 
className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
onClick={() => setShowPaywall(false)}
>
<div 
className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative transform transition-all max-h-[90vh] overflow-y-auto animate-slideUp"
onClick={(e) => e.stopPropagation()}
>
{/* Close Button */}
<button
onClick={() => setShowPaywall(false)}
className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 z-10"
aria-label="Close modal"
>
<X className="w-5 h-5" />
</button>

{/* Header Section */}
<div className="text-center mb-8 max-w-2xl mx-auto">
<div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
</div>

<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
{articlesRead >= 5 ? "You've Hit Your Limit" : "Choose Your Plan"}
</h2>

<p className="text-gray-600 text-base sm:text-lg leading-relaxed">
{articlesRead >= 5
? "You've read all 5 free articles today. Upgrade to continue reading unlimited premium content."
: "Subscribe to unlock this article and access our entire library of premium content."}
</p>
</div>

{/* Pricing Cards */}
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

{/* Elite Tier - Recommended */}
<div className="group relative border-2 border-blue-600 rounded-2xl p-6 bg-linear-to-br from-blue-50 via-white to-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
{/* Badge */}
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

{/* Trust Elements */}
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

{/* Footer */}
<div className="text-center">
<button
onClick={() => setShowPaywall(false)}
className="text-gray-500 text-sm hover:text-gray-700 transition-colors font-medium cursor-pointer"
>
Maybe later
</button>
</div>
</div>
</div>
)}
<Footer/>
</>
);
}