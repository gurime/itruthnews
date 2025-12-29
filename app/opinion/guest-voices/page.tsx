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

export default function GuestVoices() {
const router = useRouter();
const [isLoading, setIsLoading] = useState(true);
const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
const [articles, setArticles] = useState<Article[]>([]);
const [error, setError] = useState<string | null>(null);
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [guestArticlesRead, setGuestArticlesRead] = useState(0);
const [showPaywall, setShowPaywall] = useState(false);
const [profileChannelCleanup, setProfileChannelCleanup] = useState<null | (() => void)>(null);

// ========== INITIALIZATION ==========
useEffect(() => {
let mounted = true;

const init = async () => {
try {
const { data: { session } } = await supabase.auth.getSession();

if (!mounted) return;

if (session?.user) {
await fetchUserProfile(session.user.id);
setupRealtimeSubscription(session.user.id);
} else {
await fetchGuestArticleCount();
}

await fetchArticles();
} catch (err) {
console.error("Dashboard init error:", err);
if (mounted) setError("Failed to load dashboard");
} finally {
if (mounted) setIsLoading(false);
}
};

init();

return () => {
mounted = false;
};
}, []);




// ========== REALTIME SUBSCRIPTION ==========
function setupRealtimeSubscription(userId: string) {
profileChannelCleanup?.();

const channel = supabase
.channel("profile-changes")
.on(
"postgres_changes",
{ event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
() => fetchUserProfile(userId)
)
.subscribe();

setProfileChannelCleanup(() => () => {
supabase.removeChannel(channel);
});
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
// Fire and forget the update
supabase
.from("profiles")
.update({ articles_read_today: 0, last_read_date: today })
.eq("id", userId);

setUserProfile({ ...data, articles_read_today: 0, last_read_date: today });
} else {
setUserProfile(data);
}
} catch (err) {
console.error("Error fetching profile:", err);
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
try {
const { data, error } = await supabase
.from("guest_voices")
.select("*")
.order("created_at", { ascending: false })
.limit(20);

if (error) throw error;

const featured = data?.find(a => a.featured);
const regular = data?.filter(a => !a.featured).slice(0, 6) ?? [];

setFeaturedArticle(featured || null);
setArticles(regular);
} catch (err) {
console.error("Articles fetch error:", err);
setError("Failed to load articles");
}
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
if (isLoading) return <FeaturedDashboardSkeleton />;

if (error && articles.length === 0 && !featuredArticle) {
return (
<div className="p-12 text-center">
<h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
<p className="text-gray-600">{error}</p>
<button 
onClick={() => window.location.reload()} 
className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
Retry
</button>
</div>
);
}

const featuredLocked = featuredArticle ? isArticleLocked(featuredArticle) : false;

return (
<>
<Navbar/>
<div className="container mx-auto p-6">
<ArticleLimitBanner 
remaining={getRemainingArticles()} 
isSubscriber={isSubscriber()} 
/>

{/* FEATURED ARTICLE */}
{featuredArticle ? (
<Link
href={`/Articles/${featuredArticle.id}`}
onClick={(e) => handleArticleClick(e, featuredArticle)}
className="bg-white h-auto rounded-xl shadow mb-12 overflow-hidden hover:shadow-lg transition-shadow md:flex"
>
<div className="relative w-full aspect-video md:w-5/12 h-64 md:h-auto">
<Image
src={featuredArticle.image}
alt={featuredArticle.title}
fill
loading="eager"
priority
sizes="(max-width: 768px) 100vw, 40vw"
className={`object-cover  ${featuredLocked ? "opacity-60" : ""}`}
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
) : null}

<div className="pb-8 border-b border-gray-200 mb-8"></div>

{/* HEADLINES */}
<section className="mt-10">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Headlines</h2>
</div>

<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
{articles.map((article, index) => {
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
<div className="relative w-full aspect-video">
<Image
src={article.image}
alt={article.title}
fill
loading={index < 3 ? "eager" : "lazy"}
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
className={`object-cover ${locked ? "opacity-60" : ""}`}
/>
</div>

<div className="p-4">
<h3 className="line-clamp-2 font-semibold mb-2">{article.title}</h3>
<p className={`text-sm text-gray-600 line-clamp-2 ${locked ? "blur-sm" : ""}`}>{article.excerpt}</p>
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

<PaywallModal 
isOpen={showPaywall} 
onClose={() => setShowPaywall(false)}
variant={getCurrentReadCount() >= 5 ? "limit-reached" : "premium-content"}
/>
<Footer/>
</>
);
}