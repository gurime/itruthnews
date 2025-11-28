'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedArticle {
id: string;
title: string;
image?: string | null;
category?: string | null;
}

interface RelatedArticlesProps {
articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
const [loadingArticleId, setLoadingArticleId] = useState<string | null>(null);

return (
<div className="mb-12">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{articles.map((article) => (
<Link 
key={article.id}
href={`/Articles/${article.id}`}
onClick={() => setLoadingArticleId(article.id)}
className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer block relative"
>
{/* Loading overlay */}
{loadingArticleId === article.id && (
<div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
</div>
)}
            
{article.image && (
<Image 
src={article.image} 
alt={article.title}
height={400}
width={400}
className="w-full h-40 object-cover"/>
)}

<div className="p-4">
{article.category && (
<span className="text-xs font-semibold text-sky-600 uppercase">
{article.category}
</span>
)}
<h3 className="font-bold text-gray-900 mt-2 line-clamp-2">
{article.title}
</h3>
</div>
</Link>
))}
</div>
</div>
);
}