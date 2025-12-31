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
<section className="mb-12">
<h2 className="text-2xl font-semibold text-gray-900 mb-6">
Related
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg shadow-sm p-4">
{articles.map((article) => {
const isLoading = loadingArticleId === article.id;

return (
<Link
key={article.id}
href={`/Articles/${article.id}`}
prefetch
aria-busy={isLoading}
onClick={() => setLoadingArticleId(article.id)}
className="group relative block bg-white rounded-lg overflow-hidden shadow-md transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
>
{/* Loading overlay */}
{isLoading && (
<div
className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 rounded-lg"
role="status"
aria-label="Loading article"
>
<div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
</div>
)}

{article.image && (
<Image
src={article.image}
alt={article.title}
width={400}
height={400}
sizes="(min-width: 768px) 33vw, 100vw"
loading="lazy"
className=" w-full object-contain transition-transform duration-300 group-hover:scale-105"
/>
)}

<div className="p-4">
{article.category && (
<span className="text-xs font-semibold uppercase text-sky-600">
{article.category}
</span>
)}

<h3 className="mt-2 font-bold text-gray-900 line-clamp-2">
{article.title}
</h3>
</div>
</Link>
);
})}
</div>
</section>

);
}