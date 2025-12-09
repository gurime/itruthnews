/* eslint-disable @typescript-eslint/no-unused-vars */
import Navbar from '@/app/components/Navbar';
import supabase from '../../supabase/supabase';
import { Clock, Calendar, User, PenTool } from 'lucide-react';
import { JSX } from "react";
import Link from 'next/link';
import ArticleComment from '@/app/components/ArticleComment';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import RelatedArticles from '@/app/components/RelatedArticles';
import { ARTICLE_TABLES } from '../article_tables';

interface Article {
id: string;
title: string;
image?: string | null;
content?: string | null;
bodycontent?: string | null;
endcontent?: string | null;
created_at?: string | null;
category?: string | null;
author?: string | null;
author_bio?: string | null;
author_role?: string | null;
author_avatar?: string | null;
author_disclaimer?: string | null;
excerpt?: string | null;
tags?: string[] | string | null;
source?: string | null;
}

interface RelatedArticle {
id: string;
title: string;
image?: string | null;
category?: string | null;
}



// Helper function to fetch related articles from all tables concurrently
async function fetchRelatedArticles(
category: string | null,
excludeId: string,
limit: number = 3
): Promise<RelatedArticle[]> {
if (!category) return [];

// Concurrent queries
const fetchPromises = ARTICLE_TABLES.map(async (table) => {
try {
const { data, error } = await supabase
.from(table)
.select("id, title, image, category")
.eq("category", category)
.neq("id", excludeId)
.limit(limit);

if (error) {
console.error(`Error fetching from table ${table}:`, error);
return [];
}

return data || [];
} catch (err) {
console.error(`Network error on table ${table}`, err);
return [];
}
});

const results = await Promise.all(fetchPromises);

// Combine table results into one flat list
const relatedArticles = results.flat() as RelatedArticle[];

return relatedArticles.slice(0, limit);
}


async function fetchArticleFromTables(id: string): Promise<Article | null> {
for (const table of ARTICLE_TABLES) {
try {
const { data, error } = await supabase
.from(table)
.select('*')
.eq('id', id)
.single();

if (!error && data) {
return data as Article;
}
} catch (err) {
// Continue to next table if error
continue;
}
}

return null;
}


// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<{ title: string }> {
const { id } = await params;


try {
const article = await fetchArticleFromTables(id);

if (!article) {
return { title: 'iTruth News | Page Not Found' };
}

return { title: `iTruth News | ${article.title}` };
} catch (error) {
return { title: 'iTruth News | Page Not Found' };
}
}

export default async function DetailsPage({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
const { id } = await params;

// Fetch the article from all tables
const data = await fetchArticleFromTables(id);

if (!data) {
return (
<>
<Navbar />
<div className="container mx-auto p-6 text-center">
<h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
<p className="text-gray-600 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
<Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
</div>
</>
);
}

// Fetch related articles from ALL tables
const relatedArticles = await fetchRelatedArticles(data.category ?? null, id, 3);




const fullContent = (data.content || '') + ' ' + (data.bodycontent || '') + ' ' + (data.endcontent || '');

const words = fullContent.trim().split(/\s+/);
const wordCount = fullContent.trim() === '' ? 0 : words.length;

const readTime = Math.ceil(wordCount / 200);

// Process tags
const tagsArray = Array.isArray(data.tags) ? data.tags : typeof data.tags === "string" 
? data.tags.split(',').map(t => t.trim())
: [];

return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50">
{/* Main Content */}
<article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
{/* Category Badge */}
{data.category && (
<div className="mb-4">
<span className="inline-block bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
{data.category}
</span>
</div>
)}

{/* Article Title */}
<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
{data.title}
</h1>

{/* Article Meta Information */}
<div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-gray-600 text-sm">
{data.author && (
<div className="flex items-center gap-2">
<User size={16} />
<span className="font-medium text-gray-700">By {data.author}</span>
</div>
)}
{data.author_role && (
<div className="flex items-center gap-2">
<PenTool size={16} />
<span className="font-medium text-gray-700"> {data.author_role}</span>
</div>
)}
{data.created_at && (
<div className="flex items-center gap-2">
<Calendar size={16} />
<span>{new Date(data.created_at).toLocaleDateString('en-US', { 
year: 'numeric', 
month: 'long', 
day: 'numeric' 
})}</span>
</div>
)}
{readTime > 0 && (
<div className="flex items-center gap-2">
<Clock size={16} />
<span>{readTime} min read</span>
</div>
)}
{/* Back to Home Link */}


</div>

<div className='flex justify-center items-center bg-amber-950'>
{data.author_disclaimer && (
<p className="text-white text-center italic py-2 px-4">
{data.author_disclaimer}
</p>
)}
</div>

{/* Social Sharing Bar */}
<div className="flex items-center justify-between border-y border-gray-200 py-4 mb-8 flex-wrap gap-4">
<div className="flex items-center gap-2 flex-wrap space-x-4">

{/* Facebook icon */}
<Link href="#" className="text-blue-500 ">
<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
</Link>
{/* Facebook icon */}

{/* X Icon */}
<Link href="#" className="text-black ">
<svg
className="w-6 h-6"
fill="currentColor"
viewBox="0 0 24 24"
>
<path d="M18.146 2H21.5l-7.52 8.59L23.5 22h-7.09l-5.03-6.48L5.77 22H2.5l8.06-9.2L1.5 2h7.2l4.57 5.89L18.146 2z" />
</svg>
</Link>
{/* X Icon */}

{/* LinkedIn icon */}
<Link href="#" className="text-blue-700 ">
<svg
className="w-6 h-6"
fill="currentColor"
viewBox="0 0 24 24"
>
<path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8h4.5v14h-4.5V8zm7.5 0h4.31v1.95h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 2.96 5.39 6.81V22h-4.5v-6.78c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.61 1.77-2.61 3.58V22h-4.5V8z"/>
</svg>
</Link>
{/* LinkedIn icon */}


</div>
<div className="ml-auto">
<Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
← Back to Home
</Link>
</div>
</div>

{/* Featured Image */}
{data.image && (
<div className="h-96 w-full relative  overflow-hidden shadow-md">
<Image
src={data.image}
alt={data.title}
fill
className="object-cover object-center"
/>
</div>

)}

{/* Excerpt (if available) */}
{data.excerpt && (
<div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg shadow-sm">
<p className="text-lg text-gray-700 italic leading-relaxed">
{data.excerpt}
</p>
</div>
)}

{/* Article Content */}
<div className="max-w-3xl mx-auto mb-12">
<div className="font-serif text-gray-900 leading-[1.75] text-[19px] space-y-6">
{/* Body Content */}
{data.content &&
data.content.split('\n\n').map((paragraph: string, index: number) => {
const cleanParagraph = paragraph.replace(/###\s*/g, '').trim();

if (!cleanParagraph) return null;

// Add drop cap to first paragraph
if (index === 0) {
const firstLetter = cleanParagraph.charAt(0);
const restOfText = cleanParagraph.slice(1);
return (
<p key={`body-${index}`} className="text-justify">
<span className="float-left text-7xl font-bold leading-[0.85] pr-2 pt-1 text-blue-900">
{firstLetter}
</span>
{restOfText}
</p>
);
}

return (
<p key={`body-${index}`} className="text-justify first-letter:text-gray-900">
{cleanParagraph}
</p>
);
})}

{/* Original Content (if bodycontent doesn't exist) */}
{data.bodycontent &&
data.bodycontent.split('\n\n').map((paragraph: string, index: number) => {
const cleanParagraph = paragraph.replace(/###\s*/g, '').trim();

if (!cleanParagraph) return null;



return (
<p key={`content-${index}`} className="text-justify first-letter:text-gray-900">
{cleanParagraph}
</p>
);
})}

{/* End Content */}
{data.endcontent &&
data.endcontent.split('\n\n').map((paragraph: string, index: number) => {
const cleanParagraph = paragraph.replace(/###\s*/g, '').trim();

if (!cleanParagraph) return null;

return (
<p key={`end-${index}`} className="text-justify first-letter:text-gray-900">
{cleanParagraph}
</p>
);
})}
</div>
</div>

{/* Tags Section */}
{data.tags && (
<div className="mb-8">
<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">Tags</h3>
<div className="flex flex-wrap gap-3 items-center justify-center">
{tagsArray.map((tag, i) => {
const cleanTag = tag.replace(/^#/, '').trim();
return (
<span
key={i}
className="inline-block bg-sky-100 text-sky-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-sky-200 transition cursor-pointer"
>
#{cleanTag}
</span>
);
})}
</div>
</div>
)}

<div className="pb-8 border-b border-gray-200 mb-8"></div>

{/* Author Card */}
{data.author && (
<div className="bg-sky-50 rounded-xl p-6 mb-8">
<div className="flex items-center gap-4">
<div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center shrink-0">
{data.author_avatar ? (
<Image
src={data.author_avatar}
alt={data.author}
width={40}
height={40}
className="rounded-full object-cover"
/>

) : (
<User size={32} className="text-sky-600" />
)}
</div>
<div>
<h3 className="font-bold text-lg text-gray-900">About the Author</h3>
<p className="text-gray-700 font-medium">{data.author}</p>
<p className="text-gray-600 text-sm mt-1">
{data.author_bio || 'Author bio not available.'}.
</p>
</div>
</div>
</div>
)}


{/* Related Articles */}
{relatedArticles && relatedArticles.length > 0 && (
<RelatedArticles articles={relatedArticles} />
)}
</article>
<div className="pb-8 border-b border-gray-400 mb-8"></div>

{/* Comments Section */}
<ArticleComment articleId={id} />

<Footer/>
</div>
</>
);
}
