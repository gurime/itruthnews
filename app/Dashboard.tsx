"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "./supabase/supabase";
import Link from "next/link";
import Image from "next/image";
import { X, Lock } from "lucide-react";

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

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [articlesRead, setArticlesRead] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  /* -------------------- FETCH USER -------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("articlesReadToday");
    const today = new Date().toLocaleDateString("en-CA");

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
        .from("dashboard")
        .select("*")
        .eq("featured", true)
        .single();

      setFeaturedArticle(featured);

      const { data } = await supabase
        .from("dashboard")
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
/* -------------------- PAYWALL LOGIC -------------------- */
function handleArticleClick(e: React.MouseEvent, article: Article) {
  e.preventDefault(); // always prevent default, we'll manually navigate

  const isSubscriber = userProfile?.subscription_status !== "free";

  // BLOCK: non-subscribers hitting limit
  if (!isSubscriber) {
    if (articlesRead >= 5 || article.premium) {
      setShowPaywall(true);
      return; // Stop execution
    }

    // Increment counter for allowed free articles
    const newCount = articlesRead + 1;
    const today = new Date().toLocaleDateString("en-CA");
    localStorage.setItem(
      "articlesReadToday",
      JSON.stringify({ count: newCount, date: today })
    );
    setArticlesRead(newCount);
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

  /* -------------------- UI -------------------- */
  if (isLoading) return <div className="p-12">Loading…</div>;
  if (error) return <div className="p-12 text-red-600">{error}</div>;

  return (
    <>
      <div className="container mx-auto p-6">
        {/* FREE COUNTER */}
        {userProfile?.subscription_status === "free" && (
          <div className="mb-6 bg-blue-50 border p-4 rounded text-center">
            {5 - articlesRead} free articles remaining today
            <Link href="/membership" className="ml-2 underline font-semibold">
              Subscribe
            </Link>
          </div>
        )}

        {/* FEATURED */}
  {/* FEATURED - Revised */}
{featuredArticle && (
  <Link
    href={`/Articles/${featuredArticle.id}`}
    onClick={(e) => handleArticleClick(e, featuredArticle)}
    // Remove block, add grid/flex classes for responsiveness
    className="bg-white rounded-xl shadow mb-12 overflow-hidden hover:shadow-lg transition-shadow md:flex" 
  >
    {/* Left Column (Image) - 5/12 of the width on md screens and up */}
    <div className="relative w-full h-64 md:h-auto md:w-5/12 lg:w-1/2 mb-4">
      <Image
        src={featuredArticle.image}
        alt={featuredArticle.title}
        priority
        width={800}
        height={80}
        className="object-cover mb-4"
      />
      {/* If you wanted to show the premium lock here too */}
      {featuredArticle.premium && userProfile?.subscription_status === "free" && (
          <div className="absolute top-4 left-4 bg-amber-500 p-3 rounded-full text-white z-10">
              <Lock size={20} />
          </div>
      )}
    </div>

    {/* Right Column (Content) - 7/12 of the width on md screens and up */}
    <div className="p-6 md:w-7/12 lg:w-1/2 md:flex md:flex-col md:justify-between">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
          {featuredArticle.title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          {featuredArticle.excerpt}
        </p>
      </div>
      
      {/* Footer/Meta Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 pt-4 border-t gap-2 mt-auto">
        <span>📅 {formatDate(featuredArticle.created_at)}</span>
        <span className="inline-block bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
          {featuredArticle.category}
        </span>
      </div>
    </div>
  </Link>
)}

        {/* ARTICLES */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article) => {
            const locked =
              article.premium && userProfile?.subscription_status === "free";

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

                <div className="relative w-full h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
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
      </div>

      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 hover:bg-gray-100 p-2 rounded"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4">Subscription Required</h2>

            <p className="mb-6">
              {articlesRead >= 5
                ? "You've reached your free article limit for today."
                : "This is a premium article. Subscribe to access all premium content."}
            </p>

            <Link
              href="/membership"
              className="block bg-blue-600 text-white text-center py-3 rounded font-bold hover:bg-blue-700 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}
    </>
  );
}