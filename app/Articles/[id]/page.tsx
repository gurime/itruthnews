/* eslint-disable @typescript-eslint/no-unused-vars */
import Navbar from '@/app/components/Navbar';
import supabase from '../../supabase/supabase';
import { Clock, Share2, Bookmark, Facebook, Twitter, Linkedin, Mail, Calendar, User } from 'lucide-react';
import { JSX } from "react";
import Link from 'next/link';
import ArticleComment from '@/app/components/ArticleComment';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import RelatedArticles from '@/app/components/RelatedArticles';

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
  author_avatar?: string | null;
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

// Define all table names
const ARTICLE_TABLES = ['article', 'sports', 'technology', 'politics', 'business', 'entertainment', 'health'];

// Helper function to fetch article from multiple tables
async function fetchArticleFromTables(id: string): Promise<Article | null> {
  for (const table of ARTICLE_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id, title, image, content, bodycontent, endcontent, created_at, category, excerpt, author, author_bio, author_avatar, tags')
        .eq('id', id)
        .single();

      if (!error && data) {
        return { ...data, source: table };
      }
    } catch (err) {
      continue;
    }
  }
  return null;
}

// Helper function to fetch related articles from all tables
async function fetchRelatedArticles(category: string | null, excludeId: string, limit: number = 3): Promise<RelatedArticle[]> {
  if (!category) return [];
  
  const relatedArticles: RelatedArticle[] = [];

  for (const table of ARTICLE_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id, title, image, category')
        .eq('category', category)
        .neq('id', excludeId)
        .limit(limit);

      if (!error && data) {
        relatedArticles.push(...data);
      }
    } catch (err) {
      // Continue to next table if error
      continue;
    }

    // Stop if we have enough articles
    if (relatedArticles.length >= limit) break;
  }

  return relatedArticles.slice(0, limit);
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

  // Calculate read time (average reading speed: 200 words per minute)
  const wordCount = data.content ? data.content.split(' ').length : 0;
  const readTime = Math.ceil(wordCount / 200);
  
  // Process tags
  const tagsArray = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === "string"
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
          <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600 text-sm">
            {data.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="font-medium text-gray-700">By {data.author}</span>
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
            <div className="ml-auto">
              <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
                ← Back to Home
              </Link>
            </div>
        
          </div>

          {/* Social Sharing Bar */}
          <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Share2 size={18} className="text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">Share:</span>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Share on Facebook"
              >
                <Facebook size={18} className="text-blue-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Share on Twitter"
              >
                <Twitter size={18} className="text-sky-500" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={18} className="text-blue-700" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Share via Email"
              >
                <Mail size={18} className="text-gray-600" />
              </button>
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <Bookmark size={18} />
              <span className="text-sm font-medium">Save</span>
            </button>
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
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
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
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tags</h3>
              <div className="flex flex-wrap gap-3">
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

          <div className="pb-8 border-b border-gray-400 mb-8"></div>

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