import Navbar from '@/app/components/nabar';
import supabase from '../../supabase/supabase';
import { Clock, Share2, Bookmark, Facebook, Twitter, Linkedin, Mail, Calendar, User } from 'lucide-react';
import { JSX } from "react";
import Link from 'next/link';
import ArticleComment from '@/app/components/ArticleComment';

interface Article {
  id: string;
  title: string;
  image?: string | null;
  content?: string | null;
  created_at?: string | null;
  category?: string | null;
  author?: string | null;
  author_avatar?: string | null;
  excerpt?: string | null;
tags?: string[] | string | null;
}

interface RelatedArticle {
  id: string;
  title: string;
  image?: string | null;
  category?: string | null;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<{ title: string }> {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('article')
      .select('title')
      .eq('id', id)
      .single();

    if (error || !data) {
      return { title: 'iTruth News | Page Not Found' };
    }

    return { title: `iTruth News | ${data.title}` };
  } catch (error) {
    return { title: 'iTruth News | Page Not Found' };
  }
}

export default async function DetailsPage({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const { id } = await params;

  // Fetch the article details from Supabase
  const { data, error } = await supabase
    .from('article')
    .select('title, image, content, created_at, category, excerpt, author, author_avatar, tags')
    .eq('id', id)
    .single();

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading article</h1>
          <p className="text-gray-600 mb-6">We couldn't load this article. Please try again later.</p>
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </>
    );
  }

  // Fetch related articles (same category, different id)
  const { data: relatedArticles } = await supabase
    .from('article')
    .select('id, title, image, category')
    .eq('category', data.category)
    .neq('id', id)
    .limit(3);

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
              <span className="inline-block bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
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
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={data.image} 
                alt={data.title}
                className="w-full h-auto object-cover"
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
          <div className="prose prose-lg max-w-none mb-12">
            {data.content &&
              data.content.split('###').map((section: string, index: number) => {
                const [heading, ...rest] = section.trim().split('\n');
                const body = rest.join('\n');
                
                // Skip if section is empty
                if (!heading && !body) return null;
                
                return (
                  <div key={index} className="mb-8">
                    {heading && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{heading}</h2>
                    )}
                    {body && (
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{body}</p>
                    )}
                  </div>
                );
              })}
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
                    <img 
                      src={data.author_avatar} 
                      alt={data.author}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-sky-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">About the Author</h3>
                  <p className="text-gray-700 font-medium">{data.author}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Senior correspondent covering political developments and national affairs.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pb-8 border-b border-gray-200 mb-8"></div>

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((article: RelatedArticle) => (
                  <Link 
                    key={article.id}
                    href={`/Articles/${article.id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer block"
                  >
                    {article.image && (
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
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
          )}
        </article>

        {/* Comments Section */}
        <ArticleComment />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">iTruth News</h3>
                <p className="text-gray-400 text-sm">
                  Delivering accurate, unbiased news coverage from around the world.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Sections</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white cursor-pointer">World</li>
                  <li className="hover:text-white cursor-pointer">Politics</li>
                  <li className="hover:text-white cursor-pointer">Business</li>
                  <li className="hover:text-white cursor-pointer">Technology</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white cursor-pointer">About Us</li>
                  <li className="hover:text-white cursor-pointer">Contact</li>
                  <li className="hover:text-white cursor-pointer">Careers</li>
                  <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  <Facebook size={20} className="cursor-pointer hover:text-blue-400" />
                  <Twitter size={20} className="cursor-pointer hover:text-sky-400" />
                  <Linkedin size={20} className="cursor-pointer hover:text-blue-500" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>© 2024 iTruth News. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}