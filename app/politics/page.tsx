"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import supabase from "@/app/supabase/supabase";
import { ArticleLimitBanner } from "@/app/components/ArticleLimitBanner";
import { PaywallModal } from "@/app/components/PaywallModal";
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
subscription_status: "free" | "monthly" | "yearly" | "premium" | "elite";
articles_read_today: number;
last_read_date: string;
}

export default function Dashboard() {
const router = useRouter();
const [isLoading, setIsLoading] = useState(true);
const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
const [articles, setArticles] = useState<Article[]>([]);
const [error, setError] = useState<string | null>(null);
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [guestArticlesRead, setGuestArticlesRead] = useState(0);
const [showPaywall, setShowPaywall] = useState(false);
const [isAuthChecked, setIsAuthChecked] = useState(false);

// ========== INITIALIZATION ==========
useEffect(() => {
initializeApp();
}, []);

async function initializeApp() {
try {
setIsLoading(true);

// 1. Fetch Articles (Catch errors here so Auth still runs)
await fetchArticles().catch(err => {
console.error("Failed to load politics articles:", err);
setError("Could not load articles");
});

// 2. Check Auth
const { data: { user } } = await supabase.auth.getUser();

if (user) {
await fetchUserProfile(user.id);
setupRealtimeSubscription(user.id);
} else {
await fetchGuestArticleCount();
}

} catch (err) {
console.error('Initialization critical error:', err);
setError("Failed to initialize application");
} finally {
// ✅ FIX: This guarantees the loading screen goes away
setIsAuthChecked(true);
setIsLoading(false);
}
}

// ========== AUTH STATE CHANGES ==========
useEffect(() => {
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
if (event === 'SIGNED_IN' && session?.user) {
await fetchUserProfile(session.user.id);
setupRealtimeSubscription(session.user.id);
} else if (event === 'SIGNED_OUT') {
setUserProfile(null);
await fetchGuestArticleCount();
}
});

return () => {
subscription.unsubscribe();
};
}, []);

// ========== REALTIME SUBSCRIPTION ==========
function setupRealtimeSubscription(userId: string) {
const channel = supabase
.channel('profile-changes')
.on('postgres_changes', { 
event: '*', 
schema: 'public', 
table: 'profiles', 
filter: `id=eq.${userId}` 
}, () => {
fetchUserProfile(userId);
})
.subscribe();

return () => {
supabase.removeChannel(channel);
};
}

// ========== DATA FETCHING ==========
async function fetchUserProfile(userId: string) {
try {
const { data, error } = await supabase
.from("profiles")
.select("subscription_status, articles_read_today, last_read_date")
.eq("id", userId)
.single();

if (error) throw error;

const today = new Date().toLocaleDateString("en-CA");
if (data && data.last_read_date !== today) {
await supabase
.from("profiles")
.update({ articles_read_today: 0, last_read_date: today })
.eq("id", userId);

setUserProfile({ ...data, articles_read_today: 0, last_read_date: today });
} else {
setUserProfile(data);
}
} catch (err) {
console.error('Error fetching user profile:', err);
}
}

async function fetchGuestArticleCount() {
try {
const response = await fetch('/api/get-article-count');
const data = await response.json();
setGuestArticlesRead(data.count || 0);
} catch (error) {
setGuestArticlesRead(0);
}
}

async function fetchArticles() {
// 1. Fetch Featured
// ✅ FIX: Use .maybeSingle() instead of .single() to avoid crashing if empty
const { data: featured, error: featuredError } = await supabase
.from("politics")
.select("*")
.eq("featured", true)
.maybeSingle();

if (featuredError) console.warn("Error fetching featured:", featuredError);
if (featured) setFeaturedArticle(featured);

// 2. Fetch List
const { data, error } = await supabase
.from("politics")
.select("*")
.eq("featured", false)
.order("created_at", { ascending: false })
.limit(6);

if (error) throw error;
setArticles(data || []);
}

// ========== PAYWALL LOGIC ==========
function isSubscriber(): boolean {
return ['monthly', 'yearly', 'premium', 'elite'].includes(
userProfile?.subscription_status || ''
);
}

function getCurrentReadCount(): number {
return userProfile ? userProfile.articles_read_today : guestArticlesRead;
}

function getRemainingArticles(): number {
return Math.max(0, 5 - getCurrentReadCount());
}

async function handleArticleClick(e: React.MouseEvent, article: Article) {
e.preventDefault();

if (isSubscriber()) {
router.push(`/Articles/${article.id}`);
return;
}

const currentCount = getCurrentReadCount();

if (article.premium || currentCount >= 5) {
setShowPaywall(true);
return;
}

router.push(`/Articles/${article.id}`);
}

const formatDate = (d: string) =>
new Date(d).toLocaleDateString("en-US", {
month: "short", day: "numeric", year: "numeric",
});

function isArticleLocked(article: Article): boolean {
if (isSubscriber()) return false;
return article.premium || getCurrentReadCount() >= 5;
}

// ========== SKELETON ==========
function FeaturedDashboardSkeleton() {
return (
<div className="container mx-auto p-6">
<div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{[...Array(6)].map((_, i) => (
<div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
))}
</div>
</div>
);
}

// ========== RENDER ==========
if (isLoading || !isAuthChecked) return <FeaturedDashboardSkeleton />;

// Show a retry button if there is a critical error (no articles)
if (error && articles.length === 0 && !featuredArticle) {
return (
<div className="min-h-screen flex flex-col">
<Navbar />
<div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
<h2 className="text-xl font-bold text-red-600 mb-2">Unable to load content</h2>
<p className="text-gray-600 mb-4">{error}</p>
<button 
onClick={() => window.location.reload()} 
className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
>
Retry
</button>
</div>
<Footer />
</div>
);
}

const featuredLocked = featuredArticle ? isArticleLocked(featuredArticle) : false;

return (
<>
<Navbar />
<div className="container mx-auto p-6 min-h-screen">

{/* REUSED BANNER COMPONENT */}
<ArticleLimitBanner 
remaining={getRemainingArticles()} 
isSubscriber={isSubscriber()} 
/>

{/* FEATURED ARTICLE */}
{featuredArticle && (
<Link
href={`/Articles/${featuredArticle.id}`}
onClick={(e) => handleArticleClick(e, featuredArticle)}
className="bg-white rounded-xl shadow mb-12 overflow-hidden hover:shadow-lg transition-shadow md:flex"
>
<div className="relative w-full md:w-5/12">
<Image
src={featuredArticle.image}
alt={featuredArticle.title}
priority
width={1000}
height={600}
className={`object-cover w-full h-full ${featuredLocked ? "opacity-60" : ""}`}
/>
{featuredLocked && (
<div className="absolute top-2 right-2 bg-amber-500 p-2 rounded-full text-white z-10">
<Lock size={16} />
</div>
)}
</div>
<div className="p-6 md:w-7/12 lg:w-1/2 md:flex md:flex-col md:justify-between">
<div>
<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">{featuredArticle.title}</h2>
<p className={`text-gray-600 text-sm sm:text-base mb-4 ${featuredLocked ? "blur-sm" : ""}`}>
{featuredArticle.excerpt}
</p>
</div>
<div className="flex sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 pt-4 border-t gap-2 mt-auto">
<time dateTime={featuredArticle.created_at}>📅 {formatDate(featuredArticle.created_at)}</time>
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
{featuredArticle.category}
</span>
</div>
</div>
</Link>
)}

<div className="pb-8 border-b border-gray-200 mb-8"></div>

{/* HEADLINES */}
<section className="mt-10">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Headlines</h2>
</div>

<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
{articles.map((article) => {
const locked = isArticleLocked(article);
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
<div className="relative w-full h-60">
<Image
src={article.image}
alt={article.title}
fill
sizes="(max-width: 640px) 100vw,
(max-width: 1024px) 50vw,
33vw"
className={`object-contain ${locked ? "opacity-60" : ""}`}
/>
</div>
<div className="p-4">
<h3 className="font-semibold mb-2">{article.title}</h3>
<p className={`text-sm text-gray-600 ${locked ? "blur-sm" : ""}`}>{article.excerpt}</p>
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
</div>

{/* REUSED PAYWALL MODAL */}
<PaywallModal 
isOpen={showPaywall} 
onClose={() => setShowPaywall(false)}
variant={getCurrentReadCount() >= 5 ? "limit-reached" : "premium-content"}
/>
<Footer />
</>
);
}