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

const specialCoverage = {
  1: [ // February (0-indexed, so 1 = February)
    { href: "/black-history", label: "Black History Month" },
    { href: "/valentines-day", label: "Valentine's Day" },
  ],
  3: [ // April
    { href: "/earth-day", label: "Earth Day" },
  ],
  5: [ // June
    { href: "/pride", label: "Pride Month" },
    { href: "/juneteenth", label: "Juneteenth" },
    { href: "/fathers-day", label: "Father's Day" },
  ],
  9: [ // October
    { href: "/hispanic-heritage", label: "Hispanic Heritage Month" },
    { href: "/halloween", label: "Halloween" },
  ],
10: [ // November
{ href: "/native-american-heritage", label: "Native American Heritage Month" },
{ href: "/thanksgiving", label: "Thanksgiving" },
],
11: [ // December
{ href: "/holidays", label: "Holiday Season" },
{ href: "/new-years-eve", label: "New Year's Eve" },
],
};

// Get current month's special coverage
const currentMonth = new Date().getMonth() + 1; // Adjust to 1-indexed
const currentSpecialCoverage = specialCoverage[currentMonth as keyof typeof specialCoverage] || [];
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
<div className="w-full bg-blue-600 text-white border-b-2 border-red-600  rounded-md">
<div className="container mx-auto px-4 py-4">
<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
      
{/* Left side - Main message */}
<div className="text-center lg:text-left flex-1">
<h2 className="text-lg font-bold mb-1">
Support independent journalism
</h2>
<p className="text-sm">
We&apos;re reader-funded. Join thousands who power iTruth News.
</p>
</div>

{/* Right side - Actions */}
<div className="flex flex-col sm:flex-row items-center gap-3">
        
{/* Newsletter Button */}
<div className="relative">
<button
onClick={() => setShowNewsletter(!showNewsletter)}
className="px-4 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer">
{isSubscribed ? '✓ Subscribed' : '📧 Newsletter'}
</button>
          
{showNewsletter && (
<div className="absolute top-full right-0 mt-2 bg-blue-900 text-white p-6 rounded-lg shadow-2xl z-50 w-80">
<div className="flex justify-between items-center mb-3">
<h4 className="text-xl font-bold">Newsletter</h4>
<button 
onClick={() => setShowNewsletter(false)}
className="text-white hover:text-gray-300 text-xl leading-none cursor-pointer"
aria-label="Close newsletter form">
✕
</button>
</div>

<p className="text-blue-100 text-sm mb-4">
{isSubscribed ? 'You are subscribed to our newsletter!' : 'Get our top stories delivered to your inbox.'}
</p>

{!isSubscribed ? (
<div className="space-y-3">
<label htmlFor="newsletter-email" className="text-white font-semibold text-sm block">
Email Address
</label>

<input
id="newsletter-email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
placeholder="your@email.com"
className="w-full px-4 py-2.5 rounded bg-blue-600/40 border border-blue-300/20 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white placeholder-blue-200"/>
<button
onClick={handleSubscribe}
disabled={subscribed}
className={`w-full px-4 py-2.5 rounded-full font-bold transition-all duration-200 
${subscribed ? 'bg-green-500 text-white cursor-default': 'bg-teal-400 text-blue-900 hover:bg-yellow-300'}`}>
{subscribed ? '✓ Subscribed!' : 'Subscribe'}
</button>
</div>
) : (
<div className="space-y-3">
<p className="text-sm text-blue-100">Subscribed as: <strong>{email}</strong></p>
<button
onClick={handleUnsubscribe}
className="w-full px-4 py-2.5 rounded-full font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
Unsubscribe
</button>
</div>
)}
</div>
)}
</div>

{/* Support CTA */}
<Link 
href="/membership" 
className="px-6 py-2 bg-blue-900 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-colors shadow-md whitespace-nowrap border-2 border-blue-900 hover:border-blue-700">
Support us
</Link>

{/* Login/Logout */}
{user ? (
<button
className="px-4 py-2 text-sm font-semibold text-white bg-red-600  rounded-full hover:bg-red-900 transition-colors whitespace-nowrap cursor-pointer"
type="button"
onClick={handleLogout}>
Log out
</button>
) : (
<button
className="px-4 py-2 text-sm font-semibold text-white bg-blue-900 border-2 border-blue-900 rounded-full hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
onClick={() => router.push('/login')}>Sign in
</button>
)}
</div>
</div>
</div>
</div>
{/* Top Support Bar Stops Here*/}

<div className="pb-8 border-b border-gray-400 mb-4"></div>

{/* Desktop Layout */}
<div className="hidden md:block">
<div className="flex items-center justify-center mb-10">
<Link href="/">
<Image src="/images/it_news.png" alt="Truth News Logo" width={200} height={200} />
</Link>
</div>
      
{/* Navigation Links */}
<div className="flex items-center justify-between space-x-8 text-sm font-medium">


{/* News Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('news')}
aria-expanded={activeDropdown === 'news'}>
Latest News
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'news' ? "rotate-180" : ""}`}/>
</button>

{activeDropdown === 'news' && (
<div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-96 rounded shadow-lg z-50 px-4">
<p className="block  py-1 font-semibold">U.S. News</p>
<Link href="/politics" className="block  py-1 hover:bg-blue-600 rounded">Politics</Link>
<Link href="/economy" className="block  py-1 hover:bg-blue-600 rounded">Economy</Link>
<Link href="/crime" className="block  py-1 hover:bg-blue-600 rounded">Crime</Link>
<Link href="/climate" className="block  py-1 hover:bg-blue-600 rounded">
Climate
</Link>

                    
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">World </p>
<Link href="/asia" className="block  py-1 hover:bg-blue-600 rounded">Asia</Link>
<Link href="/europe" className="block  py-1 hover:bg-blue-600 rounded">Europe</Link>
<Link href="/africa" className="block  py-1 hover:bg-blue-600 rounded">Africa</Link>
<Link href="/middle-east" className="block  py-1 hover:bg-blue-600 rounded">Middle East</Link>
<Link href="/americas" className="block  py-1 hover:bg-blue-600 rounded">Americas</Link>
<Link href="/south-america" className="block  py-1 hover:bg-blue-600 rounded">South America</Link>
</div>

<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block py-1  font-semibold uppercase tracking-wide mb-2">iTruth Business</p>
<Link href="/markets" className="block  py-1 hover:bg-blue-600 rounded">Markets</Link>
<Link href="/tech" className="block  py-1 hover:bg-blue-600 rounded">Tech</Link>
<Link href="/media" className="block  py-1 hover:bg-blue-600 rounded">Media</Link>
</div>

</div>
)}
</div>

{/* Opinion Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline decoration-2 font-bold  cursor-pointer whitespace-nowrap flex items-center"
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
<p  className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">
Editorials
</p>
<Link href="/opinion/columnist" className="block  py-1 hover:bg-blue-600 rounded">
Columnists
</Link>
<Link href="/opinion/" className="block  py-1 hover:bg-blue-600 rounded">
Guest Voices
</Link>
<Link href="/opinion/editorials" className="block  py-1 hover:bg-blue-600 rounded">
Editorials
</Link>
<Link href="/opinion/letters" className="block  py-1 hover:bg-blue-600 rounded">
Letters to the Editor
</Link>
<Link href="/opinion/editorial-board" className="block  py-1 hover:bg-blue-600 rounded">
The Editorial Board
</Link>

{/* Sections Section */}
<div className="mt-4 border-t border-blue-700 pt-3">
<p className="block  py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Sections</p>

<Link href="/opinion/sections/politics" className="block  py-1 hover:bg-blue-600 rounded">
Politics
</Link>
<Link href="/opinion/sections/world" className="block  py-1 hover:bg-blue-600 rounded">
World
</Link>
<Link href="/opinion/sections/culture" className="block  py-1 hover:bg-blue-600 rounded">
Culture
</Link>
<Link href="/opinion/sections/economy" className="block  py-1 hover:bg-blue-600 rounded">
Economy
</Link>
<Link href="/opinion/sections/technology" className="block  py-1 hover:bg-blue-600 rounded">
Technology
</Link>
<Link href="/opinion/sections/climate" className="block  py-1 hover:bg-blue-600 rounded">
Climate
</Link>
</div>

{/* Editor’s Picks */}
<div className="mt-4 border-t border-blue-700 pt-3">
<p className="block  py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Editor`s Picks</p>
<Link href="/opinion/editors-picks" className="block  py-1 hover:bg-blue-600 rounded">
Trending Voices
</Link>
<Link href="/opinion/weekend-reads" className="block  py-1 hover:bg-blue-600 rounded">
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
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('lifestyle')}
aria-expanded={activeDropdown === 'lifestyle'}>
Lifestyle
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'lifestyle' ? "rotate-180" : ""}`}/>
</button>
{activeDropdown === 'lifestyle' && (
<div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">
{/* Living */}
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Well (Health & Wellness)</p>
<Link href="/fitness" className="block  py-1 hover:bg-blue-600 rounded">Fitness</Link>
<Link href="/nutrition" className="block  py-1 hover:bg-blue-600 rounded">Nutrition</Link>
<Link href="/mental-health" className="block  py-1 hover:bg-blue-600 rounded">Mental Health</Link>
<Link href="/family" className="block  py-1 hover:bg-blue-600 rounded">Family</Link>

{/* Health & Wellness */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Fashion</p>
<Link href="/beauty" className="block  py-1 hover:bg-blue-600 rounded">Beauty</Link>
<Link href="/style" className="block  py-1 hover:bg-blue-600 rounded">Style</Link>
<Link href="/models" className="block  py-1 hover:bg-blue-600 rounded">Models</Link>
<Link href="/runway" className="block  py-1 hover:bg-blue-600 rounded">Runway</Link>
<Link href="/designers" className="block  py-1 hover:bg-blue-600 rounded">Designers</Link>
<Link href="/weddings" className="block  py-1 hover:bg-blue-600 rounded">Weddings</Link>
</div>

{/* food */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Food</p>
<Link href="/recipes" className="block  py-1 hover:bg-blue-600 rounded">Recipes</Link>
<Link href="/restaurants" className="block  py-1 hover:bg-blue-600 rounded">Restaurants</Link>
<Link href="/cooking-tips" className="block  py-1 hover:bg-blue-600 rounded">Cooking Tips</Link>
</div>

{/* Travel */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Travel</p>
<Link href="/real-estate" className="block  py-1 hover:bg-blue-600 rounded">Real Estate</Link>
<Link href="/destinations" className="block  py-1 hover:bg-blue-600 rounded">Destinations</Link>
<Link href="/travel-tips" className="block  py-1 hover:bg-blue-600 rounded">Travel Tips</Link>
</div>






{/* Special Features */}
{currentSpecialCoverage.length > 0 && (
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">
Special Coverage
</p>
{currentSpecialCoverage.map((item) => (
<Link 
key={item.href}
href={item.href} 
className="block  py-1 hover:bg-blue-600 rounded">
{item.label}
</Link>
))}
</div>
)}
</div>
)}
</div>



{/* Technology Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('technology')}
aria-expanded={activeDropdown === 'technology'}>
Technology
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'technology' ? "rotate-180" : ""}`}/>
</button>
{activeDropdown === 'technology' && (
<div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">
<div className="mb-4">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Personal Tech</p>
<Link href="/tech/smartphones" className="block  py-1 hover:bg-blue-600 rounded">Smartphones</Link>
<Link href="/tech/laptops" className="block  py-1 hover:bg-blue-600 rounded">Laptops & Computers</Link>
<Link href="/tech/wearables" className="block  py-1 hover:bg-blue-600 rounded">Wearables</Link>
<Link href="/tech/smart-home" className="block  py-1 hover:bg-blue-600 rounded">Smart Home</Link>
<Link href="/tech/audio" className="block  py-1 hover:bg-blue-600 rounded">Audio & Headphones</Link>
</div>
                    
<div className="mb-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Business & Innovation</p>
<Link href="/tech/artificial-intelligence" className="block  py-1 hover:bg-blue-600 rounded">Artificial Intelligence</Link>
<Link href="/tech/startups" className="block  py-1 hover:bg-blue-600 rounded">Startups</Link>
<Link href="/tech/cybersecurity" className="block  py-1 hover:bg-blue-600 rounded">Cybersecurity</Link>
<Link href="/tech/internet" className="block  py-1 hover:bg-blue-600 rounded">Internet & Social Media</Link>
<Link href="/tech/silicon-valley" className="block  py-1 hover:bg-blue-600 rounded">Silicon Valley</Link>
</div>

<div className="mb-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Reviews & Guides</p>
<Link href="/tech/reviews" className="block  py-1 hover:bg-blue-600 rounded">Product Reviews</Link>
<Link href="/tech/buying-guides" className="block  py-1 hover:bg-blue-600 rounded">Buying Guides</Link>
<Link href="/tech/how-to" className="block  py-1 hover:bg-blue-600 rounded">How-To & Tips</Link>
</div>

<div className="pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Gaming</p>
<Link href="/tech/gaming" className="block  py-1 hover:bg-blue-600 rounded">Video Games</Link>
<Link href="/tech/gaming/pc" className="block  py-1 hover:bg-blue-600 rounded">PC Gaming</Link>
<Link href="/tech/gaming/consoles" className="block  py-1 hover:bg-blue-600 rounded">Consoles</Link>
<Link href="/tech/gaming/esports" className="block  py-1 hover:bg-blue-600 rounded">Esports</Link>
</div>
</div>
)}
</div>
              


{/* Sports Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('sports')}
aria-expanded={activeDropdown === 'sports'}>
Sports
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'sports' ? "rotate-180" : ""}`}/>
</button>

{activeDropdown === 'sports' && (
<div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">

{/* Professional Sports */}
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Professional</p>
<Link href="/sports/football" className="block  py-1 hover:bg-blue-600 rounded">Pro Football</Link>
<Link href="/sports/basketball" className="block  py-1 hover:bg-blue-600 rounded">Pro Basketball</Link>
<Link href="/sports/baseball" className="block  py-1 hover:bg-blue-600 rounded">Baseball</Link>
<Link href="/sports/hockey" className="block  py-1 hover:bg-blue-600 rounded">Hockey</Link>
<Link href="/sports/soccer" className="block  py-1 hover:bg-blue-600 rounded">Soccer</Link>
<Link href="/sports/golf" className="block  py-1 hover:bg-blue-600 rounded">Golf</Link>
<Link href="/sports/tennis" className="block  py-1 hover:bg-blue-600 rounded">Tennis</Link>

{/* College Sports */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">College Sports</p>
<Link href="/sports/college-football" className="block  py-1 hover:bg-blue-600 rounded">College Football</Link>
<Link href="/sports/college-basketball" className="block  py-1 hover:bg-blue-600 rounded">College Basketball</Link>
</div>

{/* International */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">International</p>
<Link href="/sports/world-cup" className="block  py-1 hover:bg-blue-600 rounded">World Cup</Link>
<Link href="/sports/olympics" className="block  py-1 hover:bg-blue-600 rounded">Olympics</Link>
<Link href="/sports/premier-league" className="block  py-1 hover:bg-blue-600 rounded">Premier League</Link>
</div>

{/* Other Sports */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Other Sports</p>
<Link href="/sports/boxing" className="block  py-1 hover:bg-blue-600 rounded">Boxing & MMA</Link>
<Link href="/sports/auto-racing" className="block  py-1 hover:bg-blue-600 rounded">Auto Racing</Link>
<Link href="/sports/track-and-field" className="block  py-1 hover:bg-blue-600 rounded">Track & Field</Link>
<Link href="/sports/ufc" className="block  py-1 hover:bg-blue-600 rounded">UFC</Link>
<Link href="/sports/boxing" className="block  py-1 hover:bg-blue-600 rounded">Boxing</Link>
<Link href="/sports/wwe" className="block  py-1 hover:bg-blue-600 rounded">WWE</Link>
</div>

{/* Features */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Features</p>
<Link href="/sports/columns" className="block  py-1 hover:bg-blue-600 rounded">Columns</Link>
<Link href="/sports/podcasts" className="block  py-1 hover:bg-blue-600 rounded">Podcasts</Link>
<Link href="/sports/photos" className="block  py-1 hover:bg-blue-600 rounded">Photos</Link>
</div>
</div>
)}
</div>


{/* Arts Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('arts')}
aria-expanded={activeDropdown === 'arts'}>
Arts
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'arts' ? "rotate-180" : ""}`}
/>
</button>

{activeDropdown === 'arts' && (
<div className="absolute left-0 dark:bg-blue-900 text-white mt-2 py-6 w-80 rounded shadow-lg z-50 px-4">

{/* Visual & Performing Arts */}
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Arts & Culture</p>
<Link href="/arts/theater" className="block  py-1 hover:bg-blue-600 rounded">Theater</Link>
<Link href="/arts/art-design" className="block  py-1 hover:bg-blue-600 rounded">Art & Design</Link>
<Link href="/arts/dance" className="block  py-1 hover:bg-blue-600 rounded">Dance</Link>
<Link href="/arts/books" className="block  py-1 hover:bg-blue-600 rounded">Books</Link>
<Link href="/arts/music" className="block  py-1 hover:bg-blue-600 rounded">Music</Link>

{/* Screen */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Screen</p>
<Link href="/arts/movies" className="block  py-1 hover:bg-blue-600 rounded">Movies</Link>
<Link href="/arts/television" className="block  py-1 hover:bg-blue-600 rounded">Television</Link>
<Link href="/arts/streaming" className="block  py-1 hover:bg-blue-600 rounded">Streaming</Link>
</div>

{/* Pop Culture */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Pop Culture</p>
<Link href="/arts/pop-music" className="block  py-1 hover:bg-blue-600 rounded">Pop Music</Link>
<Link href="/arts/comedy" className="block  py-1 hover:bg-blue-600 rounded">Comedy</Link>
<Link href="/arts/podcasts" className="block  py-1 hover:bg-blue-600 rounded">Podcasts</Link>
<Link href="/arts/best-of" className="block  py-1 hover:bg-blue-600 rounded">Best of Culture</Link>
</div>

{/* Features */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Features</p>
<Link href="/arts/critics-picks" className="block  py-1 hover:bg-blue-600 rounded">Critics&apos; Picks</Link>
<Link href="/arts/reviews" className="block  py-1 hover:bg-blue-600 rounded">Reviews</Link>
<Link href="/arts/what-to-watch" className="block  py-1 hover:bg-blue-600 rounded">What to Watch</Link>
<Link href="/arts/what-to-read" className="block  py-1 hover:bg-blue-600 rounded">What to Read</Link>
</div>
</div>
)}
</div>
</div>
</div>
{/* Desktop Layout Stops Here*/}

{/* Mobile Layout */}
<div className="md:hidden">
<div className="flex items-center justify-between">
<div className="shrink-0">
<Image src="/images/it_news.png" alt="Truth News Logo" width={200} height={200} />
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
<div className="mb-4">
<button
type="button"
className="w-full font-bold text-left hover:underline cursor-pointer flex items-center justify-between "
onClick={() => toggleDropdown('mobile-news')}>
Latest News
<ChevronDown
height={20}
className={`transition-transform ${activeDropdown === 'mobile-news' ? "rotate-180" : ""}`} 
/>
</button>
{activeDropdown === 'mobile-news' && (
<div className=" mt-2 space-y-2">
<p className="block  py-1 font-semibold">U.S. News</p>
<Link href="/politics" className="block  py-1 hover:bg-blue-600 rounded">Politics</Link>
<Link href="/economy" className="block  py-1 hover:bg-blue-600 rounded">Economy</Link>
<Link href="/crime" className="block  py-1 hover:bg-blue-600 rounded">Crime</Link>
<Link href="/climate" className="block  py-1 hover:bg-blue-600 rounded">
Climate
</Link>
<div className="pt-2 border-t border-blue-700 mt-2">
<p className="block  py-1 font-bold">World</p>
<Link href="/asia" className="block  py-1 hover:bg-blue-600 rounded">Asia</Link>
<Link href="/europe" className="block  py-1 hover:bg-blue-600 rounded">Europe</Link>
<Link href="/africa" className="block  py-1 hover:bg-blue-600 rounded">Africa</Link>
<Link href="/middle-east" className="block  py-1 hover:bg-blue-600 rounded">Middle East</Link>
<Link href="/americas" className="block  py-1 hover:bg-blue-600 rounded">Americas</Link>
<Link href="/south-america" className="block  py-1 hover:bg-blue-600 rounded">South America</Link>
</div>
<div className="pt-2 border-t border-blue-700 mt-2">
<p className="block  py-1 font-semibold">iTruth Business</p>
<Link href="/markets" className="block  py-1 hover:bg-blue-600 rounded">Markets</Link>
<Link href="/tech" className="block  py-1 hover:bg-blue-600 rounded">Tech</Link>
<Link href="/energy" className="block  py-1 hover:bg-blue-600 rounded">Energy</Link>
<Link href="/media" className="block  py-1 hover:bg-blue-600 rounded">Media</Link>
</div>


</div>
)}
</div>

{/* Opinion Section */}
<div className="mb-4">
<button
type="button" 
className="w-full font-bold text-left hover:underline cursor-pointer flex items-center justify-between"
onClick={() => toggleDropdown('mobile-opinion')}>
Opinion
<ChevronDown
height={20}
className={`transition-transform ${activeDropdown === 'mobile-opinion' ? "rotate-180" : ""}`}/>
</button>
{activeDropdown === 'mobile-opinion' && (
<div className=" mt-2 space-y-2">


{/* Core Opinion Formats */}
<p  className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">
Editorials
</p>
<Link href="/opinion/columnist" className="block  py-1 hover:bg-blue-600 rounded">
Columnists
</Link>
<Link href="/opinion/" className="block  py-1 hover:bg-blue-600 rounded">
Guest Voices
</Link>
<Link href="/opinion/editorials" className="block  py-1 hover:bg-blue-600 rounded">
Editorials
</Link>
<Link href="/opinion/letters" className="block  py-1 hover:bg-blue-600 rounded">
Letters to the Editor
</Link>
<Link href="/opinion/editorial-board" className="block  py-1 hover:bg-blue-600 rounded">
The Editorial Board
</Link>


{/* Sections Section */}
<div className="mt-4 border-t border-blue-700 pt-3">
<p className="block  py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Sections</p>


<Link href="/opinion/sections/politics" className="block  py-1 hover:bg-blue-600 rounded">
Politics
</Link>
<Link href="/opinion/sections/world" className="block  py-1 hover:bg-blue-600 rounded">
World
</Link>
<Link href="/opinion/sections/culture" className="block  py-1 hover:bg-blue-600 rounded">
Culture
</Link>
<Link href="/opinion/sections/economy" className="block  py-1 hover:bg-blue-600 rounded">
Economy
</Link>
<Link href="/opinion/sections/technology" className="block  py-1 hover:bg-blue-600 rounded">
Technology
</Link>
<Link href="/opinion/sections/climate" className="block  py-1 hover:bg-blue-600 rounded">
Climate
</Link>
</div>

{/* Editor’s Picks */}
<div className=" border-t border-blue-700 pt-3">
<p className="block  py-1  rounded text-sm font-semibold uppercase tracking-wide mb-2">Editor`s Picks</p>
<Link href="/opinion/editors-picks" className="block  py-1 hover:bg-blue-600 rounded">
Trending Voices
</Link>
<Link href="/opinion/weekend-reads" className="block  py-1 hover:bg-blue-600 rounded">
Weekend Reads
</Link>
</div>
</div>
)}
</div>

{/* Lifestyle Dropdown */}
<div className=" mb-4 ">
<button
type="button"
className="w-full font-bold text-left hover:underline cursor-pointer flex items-center justify-between"
onClick={() => toggleDropdown('lifestyle')}
aria-expanded={activeDropdown === 'lifestyle'}>
Lifestyle
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'lifestyle' ? "rotate-180" : ""}`}/>
</button>
{activeDropdown === 'lifestyle' && (
<div className=" mt-2 space-y-2">



{/* Health */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Well (Health & Wellness)</p>
<Link href="/fitness" className="block  py-1 hover:bg-blue-600 rounded">Fitness</Link>
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Food</p>
<Link href="/recipes" className="block  py-1 hover:bg-blue-600 rounded">Recipes</Link>
<Link href="/restaurants" className="block  py-1 hover:bg-blue-600 rounded">Restaurants</Link>
<Link href="/cooking-tips" className="block  py-1 hover:bg-blue-600 rounded">Cooking Tips</Link>
</div>

<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Fashion</p>
<Link href="/beauty" className="block  py-1 hover:bg-blue-600 rounded">Beauty</Link>
<Link href="/style" className="block py-1 hover:bg-blue-600 rounded">Style</Link>
<Link href="/models" className="block py-1 hover:bg-blue-600 rounded">Models</Link>
<Link href="/runway" className="block  py-1 hover:bg-blue-600 rounded">Runway</Link>
<Link href="/designers" className="block  py-1 hover:bg-blue-600 rounded">Designers</Link>
<Link href="/weddings" className="block  py-1 hover:bg-blue-600 rounded">Weddings</Link>
</div>
{/* Fashion*/}
<div className=" pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Travel</p>
<Link href="/real-estate" className="block  py-1 hover:bg-blue-600 rounded">Real Estate</Link>
<Link href="/destinations" className="block  py-1 hover:bg-blue-600 rounded">Destinations</Link>
<Link href="/travel-tips" className="block  py-1 hover:bg-blue-600 rounded">Travel Tips</Link>
</div>



{/* Special Features */}
{currentSpecialCoverage.length > 0 && (
<div className=" pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">
Special Coverage
</p>
{currentSpecialCoverage.map((item) => (
<Link 
key={item.href}
href={item.href} 
className="block  py-1 hover:bg-blue-600 rounded">
{item.label}
</Link>
))}
</div>
)}
</div>
)}
</div>

{/* Technology Section */}
<div className="mb-4">
<button
type="button"
className="w-full font-bold text-left hover:underline cursor-pointer flex items-center justify-between"
onClick={() => toggleDropdown('mobile-technology')}>
Technology
<ChevronDown
height={20}
className={`transition-transform ${activeDropdown === 'mobile-technology' ? "rotate-180" : ""}`}
/>
</button>
{activeDropdown === 'mobile-technology' && (
<div className=" mt-2 space-y-2">
<div className="mb-4">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Personal Tech</p>
<Link href="/tech/smartphones" className="block  py-1 hover:bg-blue-600 rounded">Smartphones</Link>
<Link href="/tech/laptops" className="block  py-1 hover:bg-blue-600 rounded">Laptops & Computers</Link>
<Link href="/tech/wearables" className="block  py-1 hover:bg-blue-600 rounded">Wearables</Link>
<Link href="/tech/smart-home" className="block  py-1 hover:bg-blue-600 rounded">Smart Home</Link>
<Link href="/tech/audio" className="block  py-1 hover:bg-blue-600 rounded">Audio & Headphones</Link>
</div>
                    
<div className="mb-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Business & Innovation</p>
<Link href="/tech/artificial-intelligence" className="block  py-1 hover:bg-blue-600 rounded">Artificial Intelligence</Link>
<Link href="/tech/startups" className="block  py-1 hover:bg-blue-600 rounded">Startups</Link>
<Link href="/tech/cybersecurity" className="block  py-1 hover:bg-blue-600 rounded">Cybersecurity</Link>
<Link href="/tech/internet" className="block  py-1 hover:bg-blue-600 rounded">Internet & Social Media</Link>
<Link href="/tech/silicon-valley" className="block  py-1 hover:bg-blue-600 rounded">Silicon Valley</Link>
</div>

<div className="mb-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Reviews & Guides</p>
<Link href="/tech/reviews" className="block  py-1 hover:bg-blue-600 rounded">Product Reviews</Link>
<Link href="/tech/buying-guides" className="block  py-1 hover:bg-blue-600 rounded">Buying Guides</Link>
<Link href="/tech/how-to" className="block  py-1 hover:bg-blue-600 rounded">How-To & Tips</Link>
</div>

<div className="pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Gaming</p>
<Link href="/tech/gaming" className="block  py-1 hover:bg-blue-600 rounded">Video Games</Link>
<Link href="/tech/gaming/pc" className="block  py-1 hover:bg-blue-600 rounded">PC Gaming</Link>
<Link href="/tech/gaming/consoles" className="block  py-1 hover:bg-blue-600 rounded">Consoles</Link>
<Link href="/tech/gaming/esports" className="block  py-1 hover:bg-blue-600 rounded">Esports</Link>
</div>
</div>
)}
</div>

{/* Sports Dropdown */}
<div className="mb-4">
<button
type="button"
className="w-full font-bold text-left hover:underline cursor-pointer flex items-center justify-between"
onClick={() => toggleDropdown('sports')}
aria-expanded={activeDropdown === 'sports'}>
Sports
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'sports' ? "rotate-180" : ""}`}
/>
</button>

{activeDropdown === 'sports' && (
<div className=" mt-2 space-y-2">

{/* Major Leagues */}
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Professional</p>
<Link href="/sports/football" className="block  py-1 hover:bg-blue-600 rounded">Pro Football</Link>
<Link href="/sports/basketball" className="block  py-1 hover:bg-blue-600 rounded">Pro Basketball</Link>
<Link href="/sports/baseball" className="block  py-1 hover:bg-blue-600 rounded">Baseball</Link>
<Link href="/sports/hockey" className="block  py-1 hover:bg-blue-600 rounded">Hockey</Link>
<Link href="/sports/soccer" className="block  py-1 hover:bg-blue-600 rounded">Soccer</Link>
<Link href="/sports/golf" className="block  py-1 hover:bg-blue-600 rounded">Golf</Link>
<Link href="/sports/tennis" className="block  py-1 hover:bg-blue-600 rounded">Tennis</Link>

{/* College Sports */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 font-bold">College Sports</p>
<Link href="/sports/ncaa-football" className="block  py-1 hover:bg-blue-600 rounded">NCAA Football</Link>
<Link href="/sports/ncaa-basketball" className="block  py-1 hover:bg-blue-600 rounded">NCAA Basketball</Link>
</div>

{/* International */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 font-bold">International</p>
<Link href="/sports/world-cup" className="block  py-1 hover:bg-blue-600 rounded">World Cup</Link>
<Link href="/sports/olympics" className="block  py-1 hover:bg-blue-600 rounded">Olympics</Link>
<Link href="/sports/premier-league" className="block  py-1 hover:bg-blue-600 rounded">Premier League</Link>
</div>




{/* More Sports */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 font-bold">Other Sports</p>
<Link href="/sports/boxing" className="block  py-1 hover:bg-blue-600 rounded">Boxing & MMA</Link>
<Link href="/sports/auto-racing" className="block  py-1 hover:bg-blue-600 rounded">Auto Racing</Link>
<Link href="/sports/track-and-field" className="block  py-1 hover:bg-blue-600 rounded">Track & Field</Link>
<Link href="/sports/ufc" className="block  py-1 hover:bg-blue-600 rounded">UFC</Link>
<Link href="/sports/boxing" className="block  py-1 hover:bg-blue-600 rounded">Boxing</Link>
<Link href="/sports/wwe" className="block  py-1 hover:bg-blue-600 rounded">WWE</Link>
</div>

{/* Features */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Features</p>
<Link href="/sports/columns" className="block  py-1 hover:bg-blue-600 rounded">Columns</Link>
<Link href="/sports/podcasts" className="block  py-1 hover:bg-blue-600 rounded">Podcasts</Link>
<Link href="/sports/photos" className="block  py-1 hover:bg-blue-600 rounded">Photos</Link>
</div>

</div>
)}
</div>


{/* Arts Section */}
<div >
<button
type="button"
className="w-full font-bold text-left hover:underline cursor-pointer flex items-center justify-between"
onClick={() => toggleDropdown('entertainment')}
aria-expanded={activeDropdown === 'entertainment'}>
Arts
<ChevronDown
height={20}
className={`ml-1 transition-transform ${activeDropdown === 'entertainment' ? "rotate-180" : ""}`}
/>
</button>

{activeDropdown === 'entertainment' && (
<div className=" mt-2 space-y-2">
  <div className="pt-2">

{/* Visual & Performing Arts */}
<p className="block  py-1 rounded text-sm font-semibold uppercase tracking-wide mb-2">Arts & Culture</p>
<Link href="/arts/theater" className="block  py-1 hover:bg-blue-600 rounded">Theater</Link>
<Link href="/arts/art-design" className="block  py-1 hover:bg-blue-600 rounded">Art & Design</Link>
<Link href="/arts/dance" className="block  py-1 hover:bg-blue-600 rounded">Dance</Link>
<Link href="/arts/books" className="block  py-1 hover:bg-blue-600 rounded">Books</Link>
<Link href="/arts/music" className="block  py-1 hover:bg-blue-600 rounded">Music</Link>

{/* Genres */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 font-bold">Screen</p>
<Link href="/arts/movies" className="block  py-1 hover:bg-blue-600 rounded">Movies</Link>
<Link href="/arts/television" className="block  py-1 hover:bg-blue-600 rounded">Television</Link>
<Link href="/arts/streaming" className="block  py-1 hover:bg-blue-600 rounded">Streaming</Link>
</div>

{/* Creators */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 font-bold">Pop Culture</p>
<Link href="/arts/pop-music" className="block  py-1 hover:bg-blue-600 rounded">Pop Music</Link>
<Link href="/arts/comedy" className="block  py-1 hover:bg-blue-600 rounded">Comedy</Link>
<Link href="/arts/podcasts" className="block  py-1 hover:bg-blue-600 rounded">Podcasts</Link>
<Link href="/arts/best-of" className="block  py-1 hover:bg-blue-600 rounded">Best of Culture</Link>
</div>

{/*Features */}
<div className="mt-4 pt-4 border-t border-blue-700">
<p className="block  py-1 font-bold">Features</p>
<Link href="/arts/critics-picks" className="block  py-1 hover:bg-blue-600 rounded">Critics&apos; Picks</Link>
<Link href="/arts/reviews" className="block  py-1 hover:bg-blue-600 rounded">Reviews</Link>
<Link href="/arts/what-to-watch" className="block  py-1 hover:bg-blue-600 rounded">What to Watch</Link>
<Link href="/arts/what-to-read" className="block  py-1 hover:bg-blue-600 rounded">What to Read</Link>
</div>
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