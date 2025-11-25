
"use client";

import { useEffect, useState } from "react";
import supabase from "../supabase/supabase";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  image: string;
  featured?: boolean;
}



export default function FeaturedDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true);
        
        // Fetch articles from Supabase
        const { data, error } = await supabase
          .from('article') // Replace with your table name
          .select('*')
          .order('created_at', { ascending: false })
          .limit(7); // Fetch 7 articles (1 featured + 6 regular)

        if (error) throw error;

        if (data) {
          // Mark the first article as featured
          const articlesWithFeatured = data.map((article, index) => ({
            ...article,
            featured: index === 0
          }));
          
          setArticles(articlesWithFeatured);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Format date helper
const formatDate = (dateString: string) => {
const date = new Date(dateString);
const now = new Date();
const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
if (diffInHours < 1) return 'Just now';
if (diffInHours < 24) return `${diffInHours} hours ago`;
if (diffInHours < 48) return '1 day ago';
if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    
return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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

if (articles.length === 0) {
return (
<div className="container mx-auto p-6">
<div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
<h3 className="text-gray-800 font-semibold mb-2">No Articles Found</h3>
<p className="text-gray-600">Check back soon for new content!</p>
</div>
</div>
);
}

const featuredArticle = articles.find(article => article.featured);
const regularArticles = articles.filter(article => !article.featured);

return (
<>
<div className="container mx-auto p-6 bg-gray-50 min-h-screen">
{/* Featured Article Section */}
{featuredArticle && (
<div className="mb-12">
<h2 className="text-3xl font-bold mb-6 text-red-800 font-[open-sans]">Featured Story</h2>
<div className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
<div className="md:flex">
{/* Featured Image */}
<div className="md:w-2/3">
<img 
src={featuredArticle.image} 
alt={featuredArticle.title}
className="w-full h-auto md:h-150 object-cover hover:scale-105 transition-transform duration-300"
/>
</div>
              
{/* Featured Content */}
<div className="md:w-1/3 p-6 flex flex-col justify-between">
<div>
<span className="inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
{featuredArticle.category}
</span>
<h3 className="text-2xl font-bold mb-4 text-gray-800 hover:text-sky-700 cursor-pointer transition-colors">
<Link href={`/Articles/${featuredArticle.id}`}>
{featuredArticle.title}
</Link>
</h3>
<p className="text-gray-600 mb-4 leading-relaxed">
{featuredArticle.excerpt}
</p>
</div>

<div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
<span>📅 {formatDate(featuredArticle.created_at)}</span>
<button className="text-red-500 font-semibold hover:text-sky-600 transition-colors">
<Link href={`/Articles/${featuredArticle.id}`}>
  Read More →
</Link>
</button>
</div>
</div>
</div>
</div>
</div>
)}
<div className="pb-8 border-b border-gray-200 mb-8"></div>

{/* Regular Articles Grid */}
{regularArticles.length > 0 && (
<div>
<h2 className="text-3xl font-bold mb-6 text-gray-800 font-[open-sans]">Latest Stories</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{regularArticles.map((article) => (
<div 
key={article.id} 
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
<img 
src={article.image} 
alt={article.title} 
className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
/>
<div className="p-4">
<span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
{article.category}
</span>
<h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-500 transition-colors">
<Link href={`/Articles/${article.id}`}>
{article.title}
</Link>
</h3>
<p className="text-gray-600 text-sm mb-4 line-clamp-2">
{article.excerpt}
</p>
<div className="flex justify-between items-center text-sm border-t pt-3">
<span className="text-gray-500">📅 {formatDate(article.created_at)}</span>
<button className="text-red-500 font-medium hover:text-blue-600 transition-colors">
<Link href={`/Articles/${article.id}`}>
Read →
</Link>
</button>
</div>
</div>
</div>
))}
</div>
</div>
)}
</div>
</>
);
}