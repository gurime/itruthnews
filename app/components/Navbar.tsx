"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user?.email) {
        const { data } = await supabase
          .from('newsletter_subscribers')
          .select('email, subscribed')
          .eq('email', session.user.email)
          .single();
        
        if (data && data.subscribed) {
          setIsSubscribed(true);
          setEmail(session.user.email);
        }
      }
      setIsLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast('Please enter a valid email.');
      return;
    }

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('email, subscribed')
      .eq('email', email)
      .single();

    if (existing && existing.subscribed) {
      toast('This email is already subscribed!');
      return;
    }

    if (existing && !existing.subscribed) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ subscribed: true, unsubscribed_at: null })
        .eq('email', email);
      if (error) {
        toast(`Subscription failed: ${error.message}`);
        return;
      }
    } else {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
      if (error) {
        toast(`Subscription failed: ${error.message}`);
        return;
      }
    }
    setIsSubscribed(true);
    setSubscribed(true);
    toast('Successfully subscribed to newsletter!');
    setTimeout(() => setSubscribed(false), 3500);
  };

  const handleUnsubscribe = async () => {
    if (!email) return;

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ 
        subscribed: false, 
        unsubscribed_at: new Date().toISOString() 
      })
      .eq('email', email);

    if (error) {
      toast('Unsubscribe failed');
      return;
    }

    setIsSubscribed(false);
    toast('Successfully unsubscribed from newsletter');
    setEmail('');
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  if (isLoading) {
    return (
      <nav className="w-full dark:bg-blue-900 text-white shadow-md">
        <div className="container mx-auto p-4">
          <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
            <div className="w-48 h-12 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex space-x-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <nav className="w-full dark:bg-blue-900 text-white shadow-md">
        <div className="container mx-auto p-4">
          {/* Top Support Bar */}
          <div className="w-full bg-blue-400 text-black text-sm">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3 sm:gap-4">
              <span className="text-center sm:text-left">
                Support independent journalism. <strong className="text-blue-900">Join iTruth News.</strong>
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowNewsletter(!showNewsletter)}
                    className="text-blue-900 font-medium hover:underline underline-offset-2 transition-all whitespace-nowrap cursor-pointer">
                    {isSubscribed ? '📧 Newsletter ✓' : '📧 Newsletter'}
                  </button>
                  
                  {showNewsletter && (
                    <div className="absolute top-full left-0 mt-2 bg-blue-900 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">Newsletter</h4>
                        <button 
                          onClick={() => setShowNewsletter(false)}
                          className="text-white hover:text-gray-300"
                          aria-label="Close newsletter form">
                          ✕
                        </button>
                      </div>

                      <p className="text-blue-100 text-sm mb-3">
                        {isSubscribed ? 'You are subscribed to our newsletter!' : 'Stay updated with our latest stories.'}
                      </p>

                      {!isSubscribed ? (
                        <div className="space-y-2">
                          <label htmlFor="newsletter-email" className="text-white font-medium text-sm">
                            Email Address
                          </label>
                          <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2 rounded bg-blue-600/40 border border-blue-300/20 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white placeholder-blue-200"/>
                          <button
                            onClick={handleSubscribe}
                            disabled={subscribed}
                            className={`w-full px-4 py-2 rounded font-semibold transition-all duration-200 
                              ${subscribed ? 'bg-green-500 text-white cursor-default': 'bg-white text-blue-900 hover:bg-blue-50'}`}>
                            {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-blue-100">Subscribed as: <strong>{email}</strong></p>
                          <button
                            onClick={handleUnsubscribe}
                            className="w-full px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                            Unsubscribe
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href="/subscribe" 
                    className="text-blue-900 font-medium hover:underline underline-offset-2 transition-all whitespace-nowrap">
                    Subscribe
                  </Link>
                  <Link 
                    href="/support" 
                    className="bg-blue-900 text-white px-4 py-1.5 rounded font-medium hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm">
                    Support Us
                  </Link>
                  {user ? (
                    <button
                      className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                      type="button"
                      onClick={handleLogout}>
                      Log out
                    </button>
                  ) : (
                    <button
                      className="px-4 py-1.5 text-sm font-medium text-white bg-blue-900 border border-blue-900 rounded hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                      onClick={() => router.push('/login')}>
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pb-8 border-b border-gray-400 mb-4"></div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
       
            {/* Navigation Links */}
            <div className="flex items-center justify-between space-x-8 text-sm font-medium">
                   <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <Image src="/images/it_back.png" alt="Truth News Logo" width={200} height={200} />
              </Link>
            </div>

              {/* News Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
                  onClick={() => toggleDropdown('news')}
                  aria-expanded={activeDropdown === 'news'}>
                  Latest News
                  <ChevronDown
                    height={20}
                    className={`ml-1 transition-transform ${activeDropdown === 'news' ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === 'news' && (
                  <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-96 rounded shadow-lg z-50 px-4">
                    <p  className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Top Stories</p>
                    <Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">Politics</Link>
                    <Link href="/finance" className="block px-2 py-1 hover:bg-blue-600 rounded">Finance</Link>
                    <Link href="/technology" className="block px-2 py-1 hover:bg-blue-600 rounded">Technology</Link>
                    
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">World News</p>
                      <Link href="/world" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Headlines</Link>
                      <Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">International Politics</Link>
                      <Link href="/conflict" className="block px-2 py-1 hover:bg-blue-600 rounded">Conflict & Security</Link>
                      <Link href="/economy" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Economy</Link>
                      <Link href="/climate" className="block px-2 py-1 hover:bg-blue-600 rounded">Climate & Environment</Link>
                      <Link href="/health" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Health</Link>
                      <Link href="/science" className="block px-2 py-1 hover:bg-blue-600 rounded">Science & Innovation</Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Regional Coverage</p>
                      <Link href="/africa" className="block px-2 py-1 hover:bg-blue-600 rounded">Africa</Link>
                      <Link href="/asia" className="block px-2 py-1 hover:bg-blue-600 rounded">Asia</Link>
                      <Link href="/europe" className="block px-2 py-1 hover:bg-blue-600 rounded">Europe</Link>
                      <Link href="/middle-east" className="block px-2 py-1 hover:bg-blue-600 rounded">Middle East</Link>
                      <Link href="/americas" className="block px-2 py-1 hover:bg-blue-600 rounded">Americas</Link>
                      <Link href="/south-america" className="block px-2 py-1 hover:bg-blue-600 rounded">South America</Link>
                    </div>
                  </div>
                )}
              </div>

{/* Opinion Dropdown */}
<div className="relative">
  <button
    type="button"
    className="hover:underline decoration-2  whitespace-nowrap flex items-center"
    onClick={() => toggleDropdown('opinion')}
    aria-expanded={activeDropdown === 'opinion'}>
    Opinion
    <ChevronDown
      height={20}
      className={`ml-1 transition-transform ${activeDropdown === 'opinion' ? "rotate-180" : ""}`}
    />
  </button>

  {activeDropdown === 'opinion' && (
    <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-64 rounded shadow-lg z-50 px-4">

      {/* Core Opinion Formats */}
      <p  className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">
        Editorials
      </p>
      <Link href="/opinion/columns" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Columns
      </Link>
      <Link href="/opinion/op-eds" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Op-Eds
      </Link>
      <Link href="/opinion/guest-voices" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Guest Voices
      </Link>
      <Link href="/opinion/analysis" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Analysis
      </Link>
      <Link href="/opinion/letters" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Letters to the Editor
      </Link>
      <Link href="/opinion/debates" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Debates
      </Link>

      {/* Substacks Section */}
      <div className="mt-4 border-t border-blue-700 pt-3">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Substacks</p>

        <Link href="/opinion/substacks/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Politics
        </Link>
        <Link href="/opinion/substacks/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Culture
        </Link>
        <Link href="/opinion/substacks/economy" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Economy
        </Link>
        <Link href="/opinion/substacks/technology" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Technology
        </Link>
        <Link href="/opinion/substacks/climate" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Climate
        </Link>
      </div>

      {/* Editor’s Picks */}
      <div className="mt-4 border-t border-blue-700 pt-3">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Editor’s Picks</p>
        <Link href="/opinion/editors-picks" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Trending Voices
        </Link>
        <Link href="/opinion/weekend-reads" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Weekend Reads
        </Link>
      </div>

    </div>
  )}
</div>

{/* Lifestyle Dropdown */}
                  <div className="relative ">
                <button
                  type="button"
                  className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
                  onClick={() => toggleDropdown('lifestyle')}
                  aria-expanded={activeDropdown === 'lifestyle'}>
                  Lifestyle
                  <ChevronDown
                    height={20}
                    className={`ml-1 transition-transform ${activeDropdown === 'lifestyle' ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === 'lifestyle' && (
                  <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">
                    {/* Living */}
                    <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Daily Life</p>
                    <Link href="/home" className="block px-2 py-1 hover:bg-blue-600 rounded">Home & Living</Link>
                    <Link href="/food" className="block px-2 py-1 hover:bg-blue-600 rounded">Food & Dining</Link>
                    <Link href="/fashion" className="block px-2 py-1 hover:bg-blue-600 rounded">Fashion & Style</Link>
                    <Link href="/beauty" className="block px-2 py-1 hover:bg-blue-600 rounded">Beauty & Wellness</Link>
                    <Link href="/relationships" className="block px-2 py-1 hover:bg-blue-600 rounded">Relationships</Link>
                    <Link href="/parenting" className="block px-2 py-1 hover:bg-blue-600 rounded">Parenting & Family</Link>

                    {/* Health & Wellness */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Health & Wellness</p>
                      <Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness & Exercise</Link>
                      <Link href="/nutrition" className="block px-2 py-1 hover:bg-blue-600 rounded">Nutrition & Diet</Link>
                      <Link href="/mental-health" className="block px-2 py-1 hover:bg-blue-600 rounded">Mental Health</Link>
                      <Link href="/sleep" className="block px-2 py-1 hover:bg-blue-600 rounded">Sleep & Recovery</Link>
                    </div>

                    {/* Culture & Interests */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Culture & Interests</p>
                      <Link href="/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">Arts & Culture</Link>
                      <Link href="/books" className="block px-2 py-1 hover:bg-blue-600 rounded">Books & Literature</Link>
                      <Link href="/faith" className="block px-2 py-1 hover:bg-blue-600 rounded">Faith & Spirituality</Link>
                      <Link href="/hobbies" className="block px-2 py-1 hover:bg-blue-600 rounded">Hobbies & Crafts</Link>
                      <Link href="/pets" className="block px-2 py-1 hover:bg-blue-600 rounded">Pets & Animals</Link>
                    </div>

                    {/* Travel & Experiences */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Travel & Adventure</p>
                      <Link href="/travel" className="block px-2 py-1 hover:bg-blue-600 rounded">Travel Destinations</Link>
                      <Link href="/cars" className="block px-2 py-1 hover:bg-blue-600 rounded">Automotive</Link>
                      <Link href="/outdoors" className="block px-2 py-1 hover:bg-blue-600 rounded">Outdoors & Nature</Link>
                    </div>

                    {/* Special Features */}
                    {new Date().getMonth() === 5 && (
                      <div className="mt-4 pt-4 border-t border-blue-700">
                        <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Special Coverage</p>
                        <Link href="/pride" className="block px-2 py-1 hover:bg-blue-600 rounded">Pride Month</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Technology Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
                  onClick={() => toggleDropdown('technology')}
                  aria-expanded={activeDropdown === 'technology'}>
                  Technology
                  <ChevronDown
                    height={20}
                    className={`ml-1 transition-transform ${activeDropdown === 'technology' ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === 'technology' && (
                  <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">
                    <div className="mb-4">
                      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Hardware</p>
                      <Link href="/tech/gpu" className="block px-2 py-1 hover:bg-blue-600 rounded">GPU</Link>
                      <Link href="/tech/cpu" className="block px-2 py-1 hover:bg-blue-600 rounded">CPU</Link>
                      <Link href="/tech/ram" className="block px-2 py-1 hover:bg-blue-600 rounded">RAM</Link>
                      <Link href="/tech/storage" className="block px-2 py-1 hover:bg-blue-600 rounded">Storage</Link>
                      <Link href="/tech/motherboards" className="block px-2 py-1 hover:bg-blue-600 rounded">Motherboards</Link>
                    </div>
                    
                    <div className="mb-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Brands</p>
                      <Link href="/tech/nvidia" className="block px-2 py-1 hover:bg-blue-600 rounded">Nvidia</Link>
                      <Link href="/tech/amd" className="block px-2 py-1 hover:bg-blue-600 rounded">AMD</Link>
                      <Link href="/tech/intel" className="block px-2 py-1 hover:bg-blue-600 rounded">Intel</Link>
                      <Link href="/tech/apple-silicon" className="block px-2 py-1 hover:bg-blue-600 rounded">Apple Silicon</Link>
                    </div>

                    <div className="pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Consumer Tech</p>
                      <Link href="/tech/smartphones" className="block px-2 py-1 hover:bg-blue-600 rounded">Smartphones</Link>
                      <Link href="/tech/laptops" className="block px-2 py-1 hover:bg-blue-600 rounded">Laptops</Link>
                      <Link href="/tech/wearables" className="block px-2 py-1 hover:bg-blue-600 rounded">Wearables</Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Games Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
                  onClick={() => toggleDropdown('videogames')}
                  aria-expanded={activeDropdown === 'videogames'}>
                  Video Games
                  <ChevronDown
                    height={20}
                    className={`ml-1 transition-transform ${activeDropdown === 'videogames' ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === 'videogames' && (
                  <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">
                 <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Platforms</p>
<Link href="/videogames/psgames" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation Games</Link>
<Link href="/videogames/xboxgames" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox Games</Link>
<Link href="/videogames/nintendogames" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo Games</Link>
<Link href="/videogames/pcgames" className="block px-2 py-1 hover:bg-blue-600 rounded">PC Games</Link>
<Link href="/videogames/mobilegames" className="block px-2 py-1 hover:bg-blue-600 rounded">Mobile Games</Link>
<Link href="/videogames/cloudgames" className="block px-2 py-1 hover:bg-blue-600 rounded">Cloud Games</Link>

                    
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Services</p>
<Link href="/videogames/playstation-plus" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation Plus</Link>
<Link href="/videogames/xbox-game-pass" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox Game Pass</Link>
<Link href="/videogames/nintendo-switch-online" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo Switch Online</Link>
<Link href="/videogames/steam" className="block px-2 py-1 hover:bg-blue-600 rounded">Steam</Link>
<Link href="/videogames/epic-games" className="block px-2 py-1 hover:bg-blue-600 rounded">Epic Games Store</Link>
<Link href="/videogames/battlenet" className="block px-2 py-1 hover:bg-blue-600 rounded">Battle.net</Link>
</div>

                    <div className="mt-4 pt-4 border-t border-blue-700">
                     <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Genres</p>
<Link href="/videogames/action" className="block px-2 py-1 hover:bg-blue-600 rounded">Action</Link>
<Link href="/videogames/adventure" className="block px-2 py-1 hover:bg-blue-600 rounded">Adventure</Link>
<Link href="/videogames/rpg" className="block px-2 py-1 hover:bg-blue-600 rounded">RPG</Link>
<Link href="/videogames/fps" className="block px-2 py-1 hover:bg-blue-600 rounded">Shooter</Link>
<Link href="/videogames/sports" className="block px-2 py-1 hover:bg-blue-600 rounded">Sports</Link>
<Link href="/videogames/racing" className="block px-2 py-1 hover:bg-blue-600 rounded">Racing</Link>
<Link href="/videogames/puzzle" className="block px-2 py-1 hover:bg-blue-600 rounded">Puzzle</Link>
<Link href="/videogames/simulation" className="block px-2 py-1 hover:bg-blue-600 rounded">Simulation</Link>
<Link href="/videogames/strategy" className="block px-2 py-1 hover:bg-blue-600 rounded">Strategy</Link>

                    </div>
                  </div>
                )}
              </div>

    {/* Sports Dropdown */}
<div className="relative">
  <button
    type="button"
    className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
    onClick={() => toggleDropdown('sports')}
    aria-expanded={activeDropdown === 'sports'}>
    Sports
    <ChevronDown
      height={20}
      className={`ml-1 transition-transform ${activeDropdown === 'sports' ? "rotate-180" : ""}`}
    />
  </button>

  {activeDropdown === 'sports' && (
    <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">

      {/* Major Leagues */}
      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Major Leagues</p>
      <Link href="/sports/nfl" className="block px-2 py-1 hover:bg-blue-600 rounded">NFL</Link>
      <Link href="/sports/mlb" className="block px-2 py-1 hover:bg-blue-600 rounded">MLB</Link>
      <Link href="/sports/nba" className="block px-2 py-1 hover:bg-blue-600 rounded">NBA</Link>
      <Link href="/sports/nhl" className="block px-2 py-1 hover:bg-blue-600 rounded">NHL</Link>
      <Link href="/sports/soccer" className="block px-2 py-1 hover:bg-blue-600 rounded">Soccer</Link>

      {/* College Sports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">College Sports</p>
        <Link href="/sports/ncaa-football" className="block px-2 py-1 hover:bg-blue-600 rounded">NCAA Football</Link>
        <Link href="/sports/ncaa-basketball" className="block px-2 py-1 hover:bg-blue-600 rounded">NCAA Basketball</Link>
      </div>

      {/* Combat Sports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Combat Sports</p>
        <Link href="/sports/ufc" className="block px-2 py-1 hover:bg-blue-600 rounded">UFC</Link>
        <Link href="/sports/boxing" className="block px-2 py-1 hover:bg-blue-600 rounded">Boxing</Link>
        <Link href="/sports/wwe" className="block px-2 py-1 hover:bg-blue-600 rounded">WWE</Link>
      </div>

      {/* Motorsports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Motorsports</p>
        <Link href="/sports/f1" className="block px-2 py-1 hover:bg-blue-600 rounded">Formula 1</Link>
        <Link href="/sports/nascar" className="block px-2 py-1 hover:bg-blue-600 rounded">NASCAR</Link>
        <Link href="/sports/motogp" className="block px-2 py-1 hover:bg-blue-600 rounded">MotoGP</Link>
      </div>

      {/* More Sports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">More Sports</p>
        <Link href="/sports/golf" className="block px-2 py-1 hover:bg-blue-600 rounded">Golf</Link>
        <Link href="/sports/tennis" className="block px-2 py-1 hover:bg-blue-600 rounded">Tennis</Link>
        <Link href="/sports/esports" className="block px-2 py-1 hover:bg-blue-600 rounded">Esports</Link>
      </div>

      {/* News & Analysis */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">News & Analysis</p>
        <Link href="/sports" className="block px-2 py-1 hover:bg-blue-600 rounded">Headlines</Link>
        <Link href="/sports/analysis" className="block px-2 py-1 hover:bg-blue-600 rounded">Analysis</Link>
        <Link href="/sports/interviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Interviews</Link>
      </div>

    </div>
  )}
</div>


              {/* Entertainment Dropdown */}
         <div className="relative">
  <button
    type="button"
    className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
    onClick={() => toggleDropdown('entertainment')}
    aria-expanded={activeDropdown === 'entertainment'}>
    Entertainment
    <ChevronDown
      height={20}
      className={`ml-1 transition-transform ${activeDropdown === 'entertainment' ? "rotate-180" : ""}`}
    />
  </button>

  {activeDropdown === 'entertainment' && (
    <div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">

      {/* Media */}
      <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Media</p>
      <Link href="/entertainment/movies" className="block px-2 py-1 hover:bg-blue-600 rounded">Movies</Link>
      <Link href="/entertainment/tv" className="block px-2 py-1 hover:bg-blue-600 rounded">TV</Link>
      <Link href="/entertainment/music" className="block px-2 py-1 hover:bg-blue-600 rounded">Music</Link>
      <Link href="/entertainment/anime" className="block px-2 py-1 hover:bg-blue-600 rounded">Anime</Link>
      <Link href="/entertainment/comics" className="block px-2 py-1 hover:bg-blue-600 rounded">Comics</Link>
      <Link href="/entertainment/podcasts" className="block px-2 py-1 hover:bg-blue-600 rounded">Podcasts</Link>

      {/* Genres */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Genres</p>
        <Link href="/entertainment/action" className="block px-2 py-1 hover:bg-blue-600 rounded">Action</Link>
        <Link href="/entertainment/drama" className="block px-2 py-1 hover:bg-blue-600 rounded">Drama</Link>
        <Link href="/entertainment/comedy" className="block px-2 py-1 hover:bg-blue-600 rounded">Comedy</Link>
        <Link href="/entertainment/horror" className="block px-2 py-1 hover:bg-blue-600 rounded">Horror</Link>
        <Link href="/entertainment/scifi" className="block px-2 py-1 hover:bg-blue-600 rounded">Sci-Fi</Link>
        <Link href="/entertainment/fantasy" className="block px-2 py-1 hover:bg-blue-600 rounded">Fantasy</Link>
      </div>

      {/* Creators */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Creators</p>
        <Link href="/entertainment/celebrities" className="block px-2 py-1 hover:bg-blue-600 rounded">Celebrities</Link>
        <Link href="/entertainment/influencers" className="block px-2 py-1 hover:bg-blue-600 rounded">Influencers</Link>
        <Link href="/entertainment/directors" className="block px-2 py-1 hover:bg-blue-600 rounded">Directors</Link>
        <Link href="/entertainment/producers" className="block px-2 py-1 hover:bg-blue-600 rounded">Producers</Link>
      </div>

      {/* News & Reviews */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">News & Reviews</p>
        <Link href="/entertainment/news" className="block px-2 py-1 hover:bg-blue-600 rounded">Entertainment News</Link>
        <Link href="/entertainment/reviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Reviews</Link>
        <Link href="/entertainment/interviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Interviews</Link>
        <Link href="/entertainment/trailers" className="block px-2 py-1 hover:bg-blue-600 rounded">Trailers</Link>
      </div>

    </div>
  )}
</div>

        
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div className="shrink-0">
                <Image src="/images/it.png" alt="Truth News Logo" width={200} height={200} />
              </div>
              <button 
                className="text-white focus:outline-none text-2xl cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu">☰</button>
            </div>

            {menuOpen && (
              <div className="mt-4 space-y-4">
                {/* Mobile Navigation - All Sections */}
                <div >
                  {/* News Section */}
                  <div>
                    <button
                      type="button"
                      className="w-full text-left hover:underline cursor-pointer flex items-center justify-between "
                      onClick={() => toggleDropdown('mobile-news')}>
                      Latest News
                      <ChevronDown
                        height={20}
                        className={`transition-transform ${activeDropdown === 'mobile-news' ? "rotate-180" : ""}`} 
                      />
                    </button>
                    {activeDropdown === 'mobile-news' && (
                      <div className="ml-4 mt-2 space-y-2">
                        <p className="block px-2 py-1 font-bold">Top Stories</p>
                        <Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">Politics</Link>
                        <Link href="/finance" className="block px-2 py-1 hover:bg-blue-600 rounded">Finance</Link>
                        <Link href="/technology" className="block px-2 py-1 hover:bg-blue-600 rounded">Technology</Link>
                        <Link href="/crime" className="block px-2 py-1 hover:bg-blue-600 rounded">Crime</Link>
                        <div className="pt-2 border-t border-blue-700 mt-2">
                          <p className="block py-1 px-2 font-bold">World News</p>
                          <Link href="/globalheadlines" className="block py-1 px-2">Global Headlines</Link>
                          <Link href="/conflict" className="block px-2 py-1 hover:bg-blue-600 rounded">Conflict & Security</Link>
                          <Link href="/economy" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Economy</Link>
                          <Link href="/climate" className="block px-2 py-1 hover:bg-blue-600 rounded">Climate & Environment</Link>
                        </div>
                        <div className="pt-2 border-t border-blue-700 mt-2">
                          <p className="block py-1 px-2 font-bold">Regional</p>
                          <Link href="/africa" className="block px-2 py-1 hover:bg-blue-600 rounded">Africa</Link>
                          <Link href="/asia" className="block px-2 py-1 hover:bg-blue-600 rounded">Asia</Link>
                          <Link href="/europe" className="block px-2 py-1 hover:bg-blue-600 rounded">Europe</Link>
                          <Link href="/middle-east" className="block px-2 py-1 hover:bg-blue-600 rounded">Middle East</Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Opinion Section */}
                  <div>
                    <button
                      type="button"
                      className="w-full text-left hover:underline cursor-pointer flex items-center justify-between"
                      onClick={() => toggleDropdown('mobile-opinion')}>
                      Opinion
                      <ChevronDown
                        height={20}
                        className={`transition-transform ${activeDropdown === 'mobile-opinion' ? "rotate-180" : ""}`}
                      />
                    </button>
                    {activeDropdown === 'mobile-opinion' && (
                              <div className="ml-4 mt-2 space-y-2">


      {/* Core Opinion Formats */}
      <p  className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">
        Editorials
      </p>
      <Link href="/opinion/columns" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Columns
      </Link>
      <Link href="/opinion/op-eds" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Op-Eds
      </Link>
      <Link href="/opinion/guest-voices" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Guest Voices
      </Link>
      <Link href="/opinion/analysis" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Analysis
      </Link>
      <Link href="/opinion/letters" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Letters to the Editor
      </Link>
      <Link href="/opinion/debates" className="block px-2 py-1 hover:bg-blue-600 rounded">
        Debates
      </Link>

      {/* Substacks Section */}
      <div className="mt-4 border-t border-blue-700 pt-3">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Substacks</p>

        <Link href="/opinion/substacks/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Politics
        </Link>
        <Link href="/opinion/substacks/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Culture
        </Link>
        <Link href="/opinion/substacks/economy" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Economy
        </Link>
        <Link href="/opinion/substacks/technology" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Technology
        </Link>
        <Link href="/opinion/substacks/climate" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Climate
        </Link>
      </div>

      {/* Editor’s Picks */}
      <div className="mt-4 border-t border-blue-700 pt-3">
        <p className="block px-2 py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Editor’s Picks</p>
        <Link href="/opinion/editors-picks" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Trending Voices
        </Link>
        <Link href="/opinion/weekend-reads" className="block px-2 py-1 hover:bg-blue-600 rounded">
          Weekend Reads
        </Link>
      </div>
    </div>
                    )}
                  </div>
{/* Lifestyle Dropdown */}
                  <div className="relative ">
                <button
                  type="button"
          className="w-full text-left hover:underline cursor-pointer flex items-center justify-between"
                  onClick={() => toggleDropdown('lifestyle')}
                  aria-expanded={activeDropdown === 'lifestyle'}>
                  Lifestyle
                  <ChevronDown
                    height={20}
                    className={`ml-1 transition-transform ${activeDropdown === 'lifestyle' ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === 'lifestyle' && (
                                 <div className="ml-4 mt-2 space-y-2">

                    {/* Living */}
                    <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Daily Life</p>
                    <Link href="/home" className="block px-2 py-1 hover:bg-blue-600 rounded">Home & Living</Link>
                    <Link href="/food" className="block px-2 py-1 hover:bg-blue-600 rounded">Food & Dining</Link>
                    <Link href="/fashion" className="block px-2 py-1 hover:bg-blue-600 rounded">Fashion & Style</Link>
                    <Link href="/beauty" className="block px-2 py-1 hover:bg-blue-600 rounded">Beauty & Wellness</Link>
                    <Link href="/relationships" className="block px-2 py-1 hover:bg-blue-600 rounded">Relationships</Link>
                    <Link href="/parenting" className="block px-2 py-1 hover:bg-blue-600 rounded">Parenting & Family</Link>

                    {/* Health & Wellness */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Health & Wellness</p>
                      <Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness & Exercise</Link>
                      <Link href="/nutrition" className="block px-2 py-1 hover:bg-blue-600 rounded">Nutrition & Diet</Link>
                      <Link href="/mental-health" className="block px-2 py-1 hover:bg-blue-600 rounded">Mental Health</Link>
                      <Link href="/sleep" className="block px-2 py-1 hover:bg-blue-600 rounded">Sleep & Recovery</Link>
                    </div>

                    {/* Culture & Interests */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Culture & Interests</p>
                      <Link href="/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">Arts & Culture</Link>
                      <Link href="/books" className="block px-2 py-1 hover:bg-blue-600 rounded">Books & Literature</Link>
                      <Link href="/faith" className="block px-2 py-1 hover:bg-blue-600 rounded">Faith & Spirituality</Link>
                      <Link href="/hobbies" className="block px-2 py-1 hover:bg-blue-600 rounded">Hobbies & Crafts</Link>
                      <Link href="/pets" className="block px-2 py-1 hover:bg-blue-600 rounded">Pets & Animals</Link>
                    </div>

                    {/* Travel & Experiences */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Travel & Adventure</p>
                      <Link href="/travel" className="block px-2 py-1 hover:bg-blue-600 rounded">Travel Destinations</Link>
                      <Link href="/cars" className="block px-2 py-1 hover:bg-blue-600 rounded">Automotive</Link>
                      <Link href="/outdoors" className="block px-2 py-1 hover:bg-blue-600 rounded">Outdoors & Nature</Link>
                    </div>

                    {/* Special Features */}
                    {new Date().getMonth() === 5 && (
                      <div className="mt-4 pt-4 border-t border-blue-700">
                        <p className="block px-2 py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Special Coverage</p>
                        <Link href="/pride" className="block px-2 py-1 hover:bg-blue-600 rounded">Pride Month</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

       {/* Sports Dropdown */}
<div >
  <button
    type="button"
                      className="w-full text-left hover:underline cursor-pointer flex items-center justify-between"
    onClick={() => toggleDropdown('sports')}
    aria-expanded={activeDropdown === 'sports'}>
    Sports
    <ChevronDown
      height={20}
      className={`ml-1 transition-transform ${activeDropdown === 'sports' ? "rotate-180" : ""}`}
    />
  </button>

  {activeDropdown === 'sports' && (
                      <div className="ml-4 mt-2 space-y-2">

      {/* Major Leagues */}
      <p className="block px-2 py-1 font-bold">Major Leagues</p>
      <Link href="/sports/nfl" className="block px-2 py-1 hover:bg-blue-600 rounded">NFL</Link>
      <Link href="/sports/mlb" className="block px-2 py-1 hover:bg-blue-600 rounded">MLB</Link>
      <Link href="/sports/nba" className="block px-2 py-1 hover:bg-blue-600 rounded">NBA</Link>
      <Link href="/sports/nhl" className="block px-2 py-1 hover:bg-blue-600 rounded">NHL</Link>
      <Link href="/sports/soccer" className="block px-2 py-1 hover:bg-blue-600 rounded">Soccer</Link>

      {/* College Sports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">College Sports</p>
        <Link href="/sports/ncaa-football" className="block px-2 py-1 hover:bg-blue-600 rounded">NCAA Football</Link>
        <Link href="/sports/ncaa-basketball" className="block px-2 py-1 hover:bg-blue-600 rounded">NCAA Basketball</Link>
      </div>

      {/* Combat Sports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">Combat Sports</p>
        <Link href="/sports/ufc" className="block px-2 py-1 hover:bg-blue-600 rounded">UFC</Link>
        <Link href="/sports/boxing" className="block px-2 py-1 hover:bg-blue-600 rounded">Boxing</Link>
        <Link href="/sports/wwe" className="block px-2 py-1 hover:bg-blue-600 rounded">WWE</Link>
      </div>

      {/* Motorsports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">Motorsports</p>
        <Link href="/sports/f1" className="block px-2 py-1 hover:bg-blue-600 rounded">Formula 1</Link>
        <Link href="/sports/nascar" className="block px-2 py-1 hover:bg-blue-600 rounded">NASCAR</Link>
        <Link href="/sports/motogp" className="block px-2 py-1 hover:bg-blue-600 rounded">MotoGP</Link>
      </div>

      {/* More Sports */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">More Sports</p>
        <Link href="/sports/golf" className="block px-2 py-1 hover:bg-blue-600 rounded">Golf</Link>
        <Link href="/sports/tennis" className="block px-2 py-1 hover:bg-blue-600 rounded">Tennis</Link>
        <Link href="/sports/esports" className="block px-2 py-1 hover:bg-blue-600 rounded">Esports</Link>
      </div>

      {/* News & Analysis */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">News & Analysis</p>
        <Link href="/sports" className="block px-2 py-1 hover:bg-blue-600 rounded">Headlines</Link>
        <Link href="/sports/analysis" className="block px-2 py-1 hover:bg-blue-600 rounded">Analysis</Link>
        <Link href="/sports/interviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Interviews</Link>
      </div>

    </div>
  )}
</div>


                  {/* Video Games Dropdown */}
              <div>
                <button
                  type="button"
                      className="w-full text-left hover:underline cursor-pointer flex items-center justify-between"
                  onClick={() => toggleDropdown('videogames')}
                  aria-expanded={activeDropdown === 'videogames'}>
                  Video Games
                  <ChevronDown
                    height={20}
                    className={`ml-1 transition-transform ${activeDropdown === 'videogames' ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === 'videogames' && (
                      <div className="ml-4 mt-2 space-y-2">
                 <p className="block px-2 py-1 font-bold">Platforms</p>
<Link href="/videogames/psgames" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation Games</Link>
<Link href="/videogames/xboxgames" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox Games</Link>
<Link href="/videogames/nintendogames" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo Games</Link>
<Link href="/videogames/pcgames" className="block px-2 py-1 hover:bg-blue-600 rounded">PC Games</Link>
<Link href="/videogames/mobilegames" className="block px-2 py-1 hover:bg-blue-600 rounded">Mobile Games</Link>
<Link href="/videogames/cloudgames" className="block px-2 py-1 hover:bg-blue-600 rounded">Cloud Games</Link>

                    
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block px-2 py-1 font-bold">Services</p>
<Link href="/videogames/playstation-plus" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation Plus</Link>
<Link href="/videogames/xbox-game-pass" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox Game Pass</Link>
<Link href="/videogames/nintendo-switch-online" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo Switch Online</Link>
<Link href="/videogames/steam" className="block px-2 py-1 hover:bg-blue-600 rounded">Steam</Link>
<Link href="/videogames/epic-games" className="block px-2 py-1 hover:bg-blue-600 rounded">Epic Games Store</Link>
<Link href="/videogames/battlenet" className="block px-2 py-1 hover:bg-blue-600 rounded">Battle.net</Link>
</div>

                    <div className="mt-4 pt-4 border-t border-blue-700">
                     <p className="block px-2 py-1 font-bold">Genres</p>
<Link href="/videogames/action" className="block px-2 py-1 hover:bg-blue-600 rounded">Action</Link>
<Link href="/videogames/adventure" className="block px-2 py-1 hover:bg-blue-600 rounded">Adventure</Link>
<Link href="/videogames/rpg" className="block px-2 py-1 hover:bg-blue-600 rounded">RPG</Link>
<Link href="/videogames/fps" className="block px-2 py-1 hover:bg-blue-600 rounded">Shooter</Link>
<Link href="/videogames/sports" className="block px-2 py-1 hover:bg-blue-600 rounded">Sports</Link>
<Link href="/videogames/racing" className="block px-2 py-1 hover:bg-blue-600 rounded">Racing</Link>
<Link href="/videogames/puzzle" className="block px-2 py-1 hover:bg-blue-600 rounded">Puzzle</Link>
<Link href="/videogames/simulation" className="block px-2 py-1 hover:bg-blue-600 rounded">Simulation</Link>
<Link href="/videogames/strategy" className="block px-2 py-1 hover:bg-blue-600 rounded">Strategy</Link>

                    </div>
                  </div>
                )}
              </div>

                  {/* Technology Section */}
                  <div>
                    <button
                      type="button"
                      className="w-full text-left hover:underline cursor-pointer flex items-center justify-between"
                      onClick={() => toggleDropdown('mobile-technology')}>
                      Technology
                      <ChevronDown
                        height={20}
                        className={`transition-transform ${activeDropdown === 'mobile-technology' ? "rotate-180" : ""}`}
                      />
                    </button>
                    {activeDropdown === 'mobile-technology' && (
                      <div className="ml-4 mt-2 space-y-2">
                        <div className="pt-2">
                          <p className="block px-2 py-1 font-bold">Hardware</p>
                          <Link href="/tech/gpu"className="block px-2 py-1 hover:bg-blue-600 rounded">GPU</Link>
                          <Link href="/tech/cpu" className="block px-2 py-1 hover:bg-blue-600 rounded">CPU</Link>
                          <Link href="/tech/ram" className="block px-2 py-1 hover:bg-blue-600 rounded">RAM</Link>
                          <Link href="/tech/storage" className="block px-2 py-1 hover:bg-blue-600 rounded">Storage</Link>
                          <Link href="/tech/motherboards" className="block px-2 py-1 hover:bg-blue-600 rounded">Motherboards</Link>
                        </div>
                        <div className="pt-2 border-t border-blue-700 mt-2">
                          <p className="block px-2 py-1 font-bold">Brands</p>
                          <Link href="/tech/nvidia" className="block px-2 py-1 hover:bg-blue-600 rounded">Nvidia</Link>
                          <Link href="/tech/amd" className="block px-2 py-1 hover:bg-blue-600 rounded">AMD</Link>
                          <Link href="/tech/intel" className="block px-2 py-1 hover:bg-blue-600 rounded">Intel</Link>
                          <Link href="/tech/apple-silicon" className="block px-2 py-1 hover:bg-blue-600 rounded">Apple Silicon</Link>
                        </div>
                        <div className="pt-2 border-t border-blue-700 mt-2">
                          <p className="block px-2 py-1 font-bold">Consumer Tech</p>
                          <Link href="/tech/smartphones" className="block px-2 py-1 hover:bg-blue-600 rounded">Smartphones</Link>
                          <Link href="/tech/laptops" className="block px-2 py-1 hover:bg-blue-600 rounded">Laptops</Link>
                          <Link href="/tech/wearables" className="block px-2 py-1 hover:bg-blue-600 rounded">Wearables</Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Entertainment Section */}
         <div >
  <button
    type="button"
className="w-full text-left hover:underline cursor-pointer flex items-center justify-between"
    onClick={() => toggleDropdown('entertainment')}
    aria-expanded={activeDropdown === 'entertainment'}>
    Entertainment
    <ChevronDown
      height={20}
      className={`ml-1 transition-transform ${activeDropdown === 'entertainment' ? "rotate-180" : ""}`}
    />
  </button>

  {activeDropdown === 'entertainment' && (
                      <div className="ml-4 mt-2 space-y-2">

      {/* Media */}
      <p className="block px-2 py-1 font-bold">Media</p>
      <Link href="/entertainment/movies" className="block px-2 py-1 hover:bg-blue-600 rounded">Movies</Link>
      <Link href="/entertainment/tv" className="block px-2 py-1 hover:bg-blue-600 rounded">TV</Link>
      <Link href="/entertainment/music" className="block px-2 py-1 hover:bg-blue-600 rounded">Music</Link>
      <Link href="/entertainment/anime" className="block px-2 py-1 hover:bg-blue-600 rounded">Anime</Link>
      <Link href="/entertainment/comics" className="block px-2 py-1 hover:bg-blue-600 rounded">Comics</Link>
      <Link href="/entertainment/podcasts" className="block px-2 py-1 hover:bg-blue-600 rounded">Podcasts</Link>

      {/* Genres */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">Genres</p>
        <Link href="/entertainment/action" className="block px-2 py-1 hover:bg-blue-600 rounded">Action</Link>
        <Link href="/entertainment/drama" className="block px-2 py-1 hover:bg-blue-600 rounded">Drama</Link>
        <Link href="/entertainment/comedy" className="block px-2 py-1 hover:bg-blue-600 rounded">Comedy</Link>
        <Link href="/entertainment/horror" className="block px-2 py-1 hover:bg-blue-600 rounded">Horror</Link>
        <Link href="/entertainment/scifi" className="block px-2 py-1 hover:bg-blue-600 rounded">Sci-Fi</Link>
        <Link href="/entertainment/fantasy" className="block px-2 py-1 hover:bg-blue-600 rounded">Fantasy</Link>
      </div>

      {/* Creators */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">Creators</p>
        <Link href="/entertainment/celebrities" className="block px-2 py-1 hover:bg-blue-600 rounded">Celebrities</Link>
        <Link href="/entertainment/influencers" className="block px-2 py-1 hover:bg-blue-600 rounded">Influencers</Link>
        <Link href="/entertainment/directors" className="block px-2 py-1 hover:bg-blue-600 rounded">Directors</Link>
        <Link href="/entertainment/producers" className="block px-2 py-1 hover:bg-blue-600 rounded">Producers</Link>
      </div>

      {/* News & Reviews */}
      <div className="mt-4 pt-4 border-t border-blue-700">
        <p className="block px-2 py-1 font-bold">News & Reviews</p>
        <Link href="/entertainment/news" className="block px-2 py-1 hover:bg-blue-600 rounded">Entertainment News</Link>
        <Link href="/entertainment/reviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Reviews</Link>
        <Link href="/entertainment/interviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Interviews</Link>
        <Link href="/entertainment/trailers" className="block px-2 py-1 hover:bg-blue-600 rounded">Trailers</Link>
      </div>

    </div>
  )}
</div>


                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}