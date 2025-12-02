"use client";
import { useEffect, useState } from "react";
import supabase from "./supabase/supabase";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  image: string;
  featured?: boolean;
}

export default function Dashboard() {
const [isLoading, setIsLoading] = useState<boolean>(true);
const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
const [articles, setArticles] = useState<Article[]>([]);
const [politicsArticles, setPoliticsArticles] = useState<Article[]>([]);
const [opinionArticles, setopinionArticles] = useState<Article[]>([]);
const [error, setError] = useState<string | null>(null);
const [loadingArticleId, setLoadingArticleId] = useState<number | null>(null);

useEffect(() => {
async function fetchArticles() {
try {
setIsLoading(true);
        
// Fetch THE featured article from article table
const { data: featuredData, error: featuredError } = await supabase
.from('article')
.select('*')
.eq('featured', true)
.limit(1)
.single();

if (featuredError && featuredError.code !== 'PGRST116') {
// PGRST116 is "no rows returned" - that's okay, just means no featured article
throw featuredError;
}

if (featuredData) {
setFeaturedArticle(featuredData);
}
// Fetch THE featured article from article table

// Fetch regular articles from the article table (excluding featured)
const { data, error } = await supabase
.from('article')
.select('*')
.eq('featured', false)
.order('created_at', { ascending: false })
.limit(6);

if (error) throw error;
if (data) {
setArticles(data);
}
// Fetch regular article articles (excluding featured)

// Fetch politics articles (excluding featured)
const { data: politicsData, error: politicsError } = await supabase
.from('politics')
.select('*')
.eq('featured', false)
.order('created_at', { ascending: false })
.limit(6);

if (politicsError) throw politicsError;
if (politicsData) {
setPoliticsArticles(politicsData);
}
// Fetch regular articles (excluding featured)

// Fetch opinion articles (excluding featured)       
const { data: opinionData, error: opinionError } = await supabase
.from('columnists')
.select('*')
.eq('featured', false)
.order('created_at', { ascending: false })
.limit(6);



if (opinionError) throw opinionError;
if (opinionData) {
setopinionArticles(opinionData);
}
// Fetch opinion articles (excluding featured)       

} catch (err) {
setError(err instanceof Error ? err.message : 'Failed to fetch articles');
} finally {
setIsLoading(false);
}
}

fetchArticles();
}, []);

const formatDate = (dateString: string) => {
const date = new Date(dateString);
const now = new Date();
const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
if (diffInHours < 1) return 'Just now';
if (diffInHours < 24) return `${diffInHours} hours ago`;
if (diffInHours < 48) return '1 day ago';
if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    
return date.toLocaleDateString('en-US', { 
month: 'short', 
day: 'numeric', 
year: 'numeric' 
});
};

function FeaturedDashboardSkeleton() {
return (
<div className="container mx-auto p-6">
<div className="mb-8">
{/* Featured Article Skeleton */}
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

if (isLoading) {
return <FeaturedDashboardSkeleton />;
}

if (error) {
return (
<div className="container mx-auto p-6">
<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
<h3 className="text-red-800 font-semibold mb-2">Error Loading Articles</h3>
<p className="text-red-600">{error}</p>
</div>
</div>
);
}

if (!featuredArticle && articles.length === 0 && politicsArticles.length === 0 && opinionArticles.length === 0) {
return (
<div className="container mx-auto p-6">
<div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
<h3 className="text-gray-800 font-semibold mb-2">No Articles Found</h3>
<p className="text-gray-600">Check back soon for new content!</p>
</div>
</div>
);
}

return (
<>
<div className="container mx-auto p-6 bg-gray-50 min-h-screen">
{/* Featured Article Section */}
{featuredArticle && (
<div className="mb-12">
<h2 className="text-3xl font-bold mb-6 text-red-800 font-[open-sans]">Featured Story</h2>
<Link 
href={`/Articles/${featuredArticle.id}`}
onClick={() => setLoadingArticleId(featuredArticle.id)}
className="block bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow relative">

{/* Loading overlay for featured article */}
{loadingArticleId === featuredArticle.id && (
<div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
</div>
)}
<div className="md:flex">
<div className="md:w-2/3">
<Image 
src={featuredArticle.image} 
alt={featuredArticle.title}
width={1000}
height={150}
className="w-full h-auto md:h-150 object-cover hover:scale-105 transition-transform duration-300"
                  />
</div>

<div className="md:w-1/3 p-6 flex flex-col justify-between">
<div>
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
{featuredArticle.category}
</span>
<h3 className="text-2xl font-bold mb-4 text-gray-800 hover:text-sky-700 cursor-pointer transition-colors">
{featuredArticle.title}
</h3>
<p className="text-gray-600 mb-4 leading-relaxed">
{featuredArticle.excerpt}
</p>
</div>

<div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
<span>📅 {formatDate(featuredArticle.created_at)}</span>
<span className="text-red-500 font-semibold hover:text-sky-600 transition-colors">
Read More →
</span>
</div>
</div>
</div>
</Link>
</div>
)}

{featuredArticle && (
<div className="pb-8 border-b border-gray-400 mb-8"></div>
)}

{/* Regular Articles Grid */}
{articles.length > 0 && (
<div>
<h2 className="text-3xl font-bold mb-6 text-blue-900 font-[open-sans]">Latest Headlines</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{articles.map((article) => (
<Link
key={article.id}
href={`/Articles/${article.id}`}
onClick={() => setLoadingArticleId(article.id)}
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer block relative">
{/* Loading overlay */}
{loadingArticleId === article.id && (
<div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
</div>
)}
<Image 
src={article.image} 
alt={article.title}
width={1000}
height={48}
className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
<div className="p-4">
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
{article.category}
</span>
<h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-500 transition-colors">
{article.title}
</h3>
<p className="text-gray-600 text-sm mb-4 line-clamp-2">
{article.excerpt}
</p>
<div className="flex justify-between items-center text-sm border-t pt-3">
<span className="text-gray-500">📅 {formatDate(article.created_at)}</span>
<span className="text-red-500 font-medium hover:text-blue-600 transition-colors">
Read →
</span>
</div>
</div>
</Link>
))}
</div>
</div>
)}

{articles.length > 0 && politicsArticles.length > 0 && (
<div className="pb-8 border-b border-gray-400 mb-8"></div>
)}

{/* Politics Section */}
{politicsArticles.length > 0 && (
<div>
<h2 className="text-3xl font-bold mb-6 text-red-800 font-[open-sans]">Politics</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{politicsArticles.map((article) => (
<Link
key={article.id}
href={`/Articles/${article.id}`}
onClick={() => setLoadingArticleId(article.id)}
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer block relative">
{/* Loading overlay */}
{loadingArticleId === article.id && (
<div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
</div>
)}
<Image 
src={article.image} 
alt={article.title}
width={1000}
height={48}
className="w-full h-48 object-cover hover:scale-105 transition-transformduration-300"/>
<div className="p-4">
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
{article.category}
</span>
<h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-500 transition-colors">
{article.title}
</h3>

<p className="text-gray-600 text-sm mb-4 line-clamp-2">
{article.excerpt}
</p>
<div className="flex justify-between items-center text-sm border-t pt-3">
<span className="text-gray-500">📅 {formatDate(article.created_at)}</span>
<span className="text-red-500 font-medium hover:text-blue-600 transition-colors">
Read →
</span>
</div>
</div>
</Link>
))}
</div>
</div>
)}

{articles.length > 0 && opinionArticles.length > 0 && (
<div className="pb-8 border-b border-gray-400 mb-8"></div>
)}

{/* Opinion Section */}
{opinionArticles.length > 0 && (
<div>
<h2 className="text-3xl font-bold mb-6 text-red-800 font-[open-sans]">Opinion</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{opinionArticles.map((article) => (
<Link
key={article.id}
href={`/Articles/${article.id}`}
onClick={() => setLoadingArticleId(article.id)}
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer block relative">

{/* Loading overlay */}
{loadingArticleId === article.id && (
<div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
</div>)}
<Image 
src={article.image} 
alt={article.title}
width={1000}
height={48}
className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"/>

<div className="p-4">
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
{article.category}
</span>

<h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-500 transition-colors">
{article.title}
</h3>

<p className="text-gray-600 text-sm mb-4 line-clamp-2">
{article.excerpt}
</p>

<div className="flex justify-between items-center text-sm border-t pt-3">
<span className="text-gray-500">📅 {formatDate(article.created_at)}</span>
<span className="text-red-500 font-medium hover:text-blue-600 transition-colors">
Read →
</span>
</div>
</div>
</Link>
))}
</div>
</div>
)}
</div>
</>
  );
}