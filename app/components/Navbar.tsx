"use client";
import { ChevronDown } from "lucide-react";

import { useEffect, useState } from "react";
import supabase from "../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import toast, { Toaster } from 'react-hot-toast';
import { specialCoverage } from "../admin/category_tables";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NewsletterSubscriber {
email: string;
subscribed: boolean;
daily_newsletter: boolean;
weekly_newsletter: boolean;
breaking_news: boolean;
politics_newsletter: boolean;
tech_newsletter: boolean;
}



export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const [user, setUser] = useState<User | null>(null);
const [email, setEmail] = useState('');
const [firstname, setFirstName] = useState('');
const [isSubscribed, setIsSubscribed] = useState(false);
const [isEliteMember, setIsEliteMember] = useState(false);

const router = useRouter();
useEffect(() => {
let mounted = true;

const loadProfile = async () => {
const { data: { session } } = await supabase.auth.getSession();
if (!mounted) return;

setUser(session?.user ?? null);

if (session?.user) {
const { data: profileData } = await supabase
.from("profiles")
.select("full_name, email, subscription_status, role")
.eq("id", session.user.id)
.maybeSingle();

if (profileData) {
setFirstName(profileData.full_name);
setEmail(profileData.email);

// Check if user is admin or elite member
// Admin gets all access, elite gets iTruth Business
const isElite = profileData.subscription_status === "elite" || 
profileData.subscription_status === "elite_yearly" ||
profileData.subscription_status === "elite_monthly" ||
profileData.role === "admin";

if (isElite) {
setIsEliteMember(true);
setIsSubscribed(true);
} else if (profileData.subscription_status && 
profileData.subscription_status !== "free" &&
profileData.subscription_status !== "") {
setIsSubscribed(true);
}
}
}

setIsLoading(false);
};

loadProfile();
return () => {
mounted = false;
};
}, []);

// Get current month's special coverage

const currentMonth = new Date().getMonth(); 
const currentSpecialCoverage = specialCoverage[currentMonth as keyof typeof specialCoverage] || [];

useEffect(() => {
setTimeout(() => setIsLoading(false), 1000);
}, []);
const handleLogout = async () => {
try {
const { error } = await supabase.auth.signOut();
if (error) throw error;

// Reset all user-related state
setUser(null);
setIsEliteMember(false);
setIsSubscribed(false);
setFirstName('');
setEmail('');

router.push('/');
} catch (error) {
console.error(error);
}
};

// Add this useEffect to listen for newsletter preference changes
useEffect(() => {
if (!user?.email) return;

const channel = supabase
.channel('newsletter-changes')
.on<NewsletterSubscriber>(
'postgres_changes',
{
event: 'UPDATE',
schema: 'public',
table: 'newsletter_subscribers',
filter: `email=eq.${user.email}`
},
(payload) => {
const newData = payload.new as NewsletterSubscriber;
// Check if any newsletter is enabled
const hasAnyNewsletter =
newData.daily_newsletter ||
newData.weekly_newsletter ||
newData.breaking_news ||
newData.politics_newsletter ||
newData.tech_newsletter;

setIsSubscribed(newData.subscribed && hasAnyNewsletter);
}
)
.subscribe();

return () => {
supabase.removeChannel(channel);
};
}, [user?.email]);

useEffect(() => {
let mounted = true;

const init = async () => {
// Get initial session
const { data: { session } } = await supabase.auth.getSession();
if (!mounted) return;

setUser(session?.user ?? null);

// Check subscription status if logged in
if (session?.user?.email) {
const { data: subData } = await supabase
.from("newsletter_subscribers")
.select("email, subscribed")
.eq("email", session.user.email)
.maybeSingle();

if (subData?.subscribed) {
setIsSubscribed(true);
setEmail(session.user.email);
}
}

setIsLoading(false);
};

init();

// Auth listener
const {
data: { subscription }
} = supabase.auth.onAuthStateChange((_event, session) => {
if (!mounted) return;

setUser(session?.user ?? null);
});

return () => {
mounted = false;
subscription?.unsubscribe();
};
}, []);




const toggleDropdown = (dropdown: string) => {
setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
};



const toggleAccordion = (section: string) => {
setActiveAccordion(activeAccordion === section ? null : section);
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
<div className="container mx-auto">
{/* Top Support Bar */}
<div className="w-full bg-blue-600 text-white border-b-2 border-red-600 p-4 rounded-md">
<div className="container mx-auto ">
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
{user && (
<Link 
href={`/profile/${user.id}?tab=account`}
className="relative flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600 rounded-full transition-all duration-200 shadow-md hover:shadow-lg group">
<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
<span className="font-semibold text-white group-hover:scale-105 transition-transform">{firstname}</span>
</Link>
)}



{/* Support CTA */}
<Link 
href="/membership" 
className="px-6 py-2 bg-blue-900 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-colors shadow-md whitespace-nowrap border-2 border-blue-900 hover:border-blue-700">
Support us
</Link>

{/* Login/Logout */}
{user ? (
<button
className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-900 transition-colors whitespace-nowrap cursor-pointer"
type="button"
onClick={handleLogout}>
Log out
</button>
) : (
<div className="flex gap-2 border-2 border-white rounded-full p-3">
<button
className="px-4 py-2 text-sm font-semibold text-white bg-blue-900 border-2 border-blue-900 rounded-full hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
onClick={() => router.push('/login?tab=signin')}>
Sign in
</button>
<button
className="px-4 py-2 text-sm font-semibold text-white bg-green-600 border-2 border-green-600 rounded-full hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
onClick={() => router.push('/login?tab=signup')}>
Sign up
</button>
</div>
)}





</div>
</div>
</div>
</div>
{/* Top Support Bar Stops Here*/}

<div className="pb-8 border-b border-gray-400 mb-4"></div>

{/* Desktop Layout */}
<div className="hidden md:block">
{/* Desktop Layout - Logo Section */}
<div className="flex items-center justify-center mb-10">
{isEliteMember ? (
<Link href="/">
<Image src="/images/itruth_elite.png" 
loading="eager"
priority alt="Truth News Logo"   
width={200} height={200} 
style={{ width: 'auto', height: 'auto' }}
/>
</Link>
) : isSubscribed ? (
<Link href="/">
<Image src="/images/itruth_premium.png" 
loading="eager"
priority alt="Truth News Premium Logo"   
width={200} height={200} 
style={{ width: 'auto', height: 'auto' }}

/>
</Link>
) : (
<Link href="/">
<Image src="/images/it_news.png" 
loading="eager"
priority alt="Truth News Logo"   
width={200} height={200} 
style={{ width: 'auto', height: 'auto' }}

/>
</Link>   
)}
</div>

{/* Navigation Links */}
<div className="flex items-center justify-between space-x-8 text-sm font-medium">


{/* News Dropdown */}
<div className=" p-6 ">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('news')}
aria-expanded={activeDropdown === 'news'}>
Latest News
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'news' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'news' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-96 rounded shadow-lg z-50">

{/* U.S. News Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('us-news')}
>
<span>U.S. News</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'us-news' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'us-news' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/politics" className="block py-2 px-2 hover:bg-blue-600 rounded">
Politics
</Link>
<Link  href="/economy" className="block py-2 px-2 hover:bg-blue-600 rounded">
Economy
</Link>
<Link href="/crime" className="block py-2 px-2 hover:bg-blue-600 rounded">
Crime
</Link>
<Link  href="/climate" className="block py-2 px-2 hover:bg-blue-600 rounded">
Climate
</Link>
</div>
</div>
</div>
{/* World Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('world')}
>
<span>World</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'world' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'world' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/asia" className="block py-2 px-2 hover:bg-blue-600 rounded">
Asia
</Link>
<Link href="/europe" className="block py-2 px-2 hover:bg-blue-600 rounded">
Europe
</Link>
<Link href="/africa" className="block py-2 px-2 hover:bg-blue-600 rounded">
Africa
</Link>
<Link href="/middle-east" className="block py-2 px-2 hover:bg-blue-600 rounded">
Middle East
</Link>
<Link href="/americas" className="block py-2 px-2 hover:bg-blue-600 rounded">
Americas
</Link>
<Link href="/south-america" className="block py-2 px-2 hover:bg-blue-600 rounded">
South America
</Link>
</div>
</div>
</div>
</div>
)}
</div>
</div>




<div>
{isEliteMember ? (

<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('itruth business')}
aria-expanded={activeDropdown === 'itruth business'}>
iTruth Business
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'itruth business' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'itruth business' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-96 rounded shadow-lg z-50">

{/* Markets Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('markets')}
>
<span>Markets</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'markets' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'markets' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/markets/stocks" className="block py-2 px-2 hover:bg-blue-600 rounded">
Stocks
</Link>
<Link href="/markets/us" className="block py-2 px-2 hover:bg-blue-600 rounded">
U.S. Markets
</Link>
<Link href="/markets/pre" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pre-Markets
</Link>
<Link href="/markets/crypto" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cryptocurrency
</Link>
<Link href="/markets/futures" className="block py-2 px-2 hover:bg-blue-600 rounded">
Futures & Commodities
</Link>
<Link href="/markets/bonds" className="block py-2 px-2 hover:bg-blue-600 rounded">
Bonds
</Link>
<Link href="/markets/etfs" className="block py-2 px-2 hover:bg-blue-600 rounded">
ETFs
</Link>
<Link href="/markets/mutual-funds" className="block py-2 px-2 hover:bg-blue-600 rounded">
Mutual Funds
</Link>
</div>
</div>
</div>



</div>
)}
</div>
) : (
<Link 
href="/membership"
className="text-white/60  font-bold whitespace-nowrap flex items-center transition-colors group"
title="Upgrade to iTruth Elite to access iTruth Business"
>
<span>iTruth Business</span>
<svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
</svg>
</Link>
)}
</div>
{/* Opinion Dropdown */}
<div >
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('opinion')}
aria-expanded={activeDropdown === 'opinion'}>
Opinion
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'opinion' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'opinion' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-64 rounded shadow-lg z-50">

{/* Editorials Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('editorials')}
>
<span>Editorials</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'editorials' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'editorials' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/opinion/columnist" className="block py-2 px-2 hover:bg-blue-600 rounded">
Columnists
</Link>
<Link href="/opinion/guest-voices" className="block py-2 px-2 hover:bg-blue-600 rounded">
Guest Voices
</Link>
<Link href="/opinion/editorials" className="block py-2 px-2 hover:bg-blue-600 rounded">
Editorials
</Link>
<Link href="/opinion/letters" className="block py-2 px-2 hover:bg-blue-600 rounded">
Letters to the Editor
</Link>
<Link href="/opinion/editorial-board" className="block py-2 px-2 hover:bg-blue-600 rounded">
The Editorial Board
</Link>
</div>
</div>
</div>

{/* Sections Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('sections')}
>
<span>Sections</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'sections' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'sections' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/opinion/sections/politics" className="block py-2 px-2 hover:bg-blue-600 rounded">
Politics
</Link>
<Link href="/opinion/sections/world" className="block py-2 px-2 hover:bg-blue-600 rounded">
World
</Link>
<Link href="/opinion/sections/culture" className="block py-2 px-2 hover:bg-blue-600 rounded">
Culture
</Link>
<Link href="/opinion/sections/economy" className="block py-2 px-2 hover:bg-blue-600 rounded">
Economy
</Link>
<Link href="/opinion/sections/technology" className="block py-2 px-2 hover:bg-blue-600 rounded">
Technology
</Link>
<a href="/opinion/sections/climate" className="block py-2 px-2 hover:bg-blue-600 rounded">
Climate
</a>
</div>
</div>
</div>

{/* Editor's Picks Accordion */}
<div>
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('editors-picks')}
>
<span>Editor&apos;s Picks</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'editors-picks' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'editors-picks' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/opinion/editors-picks" className="block py-2 px-2 hover:bg-blue-600 rounded">
Trending Voices
</Link>
<Link href="/opinion/weekend-reads" className="block py-2 px-2 hover:bg-blue-600 rounded">
Weekend Reads
</Link>
</div>
</div>
</div>

</div>
)}
</div>
</div>


{/* Lifestyle Dropdown */}
<div >
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('lifestyle')}
aria-expanded={activeDropdown === 'lifestyle'}>
Lifestyle
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'lifestyle' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'lifestyle' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50 max-h-[600px] overflow-y-auto">

{/* Well (Health & Wellness) Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('wellness')}
>
<span>Health & Wellness</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'wellness' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'wellness' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/fitness" className="block py-2 px-2 hover:bg-blue-600 rounded">
Fitness
</Link>
<Link href="/nutrition" className="block py-2 px-2 hover:bg-blue-600 rounded">
Nutrition
</Link>
<Link href="/mental-health" className="block py-2 px-2 hover:bg-blue-600 rounded">
Mental Health
</Link>
<Link href="/yoga-Meditation" className="block py-2 px-2 hover:bg-blue-600 rounded">
Yoga & Meditation
</Link>
<a href="/sleep" className="block py-2 px-2 hover:bg-blue-600 rounded">
Sleep
</a>
</div>
</div>
</div>

{/* Fashion Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('fashion')}
>
<span>Fashion</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'fashion' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'fashion' 
? "max-h-[500px] opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/beauty" className="block py-2 px-2 hover:bg-blue-600 rounded">
Beauty
</Link>
<Link href="/style" className="block py-2 px-2 hover:bg-blue-600 rounded">
Style
</Link>
<Link href="/models" className="block py-2 px-2 hover:bg-blue-600 rounded">
Models
</Link>
<Link href="/runway" className="block py-2 px-2 hover:bg-blue-600 rounded">
Runway
</Link>
<Link href="/designers" className="block py-2 px-2 hover:bg-blue-600 rounded">
Designers
</Link>
<Link href="/makeup" className="block py-2 px-2 hover:bg-blue-600 rounded">
Makeup
</Link>
<Link href="/accessories" className="block py-2 px-2 hover:bg-blue-600 rounded">
Accessories
</Link>
<Link href="/skincare" className="block py-2 px-2 hover:bg-blue-600 rounded">
Skincare
</Link>
<Link href="/hair" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hair
</Link>
</div>
</div>
</div>

{/* Food Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('food')}
>
<span>Food</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'food' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'food' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/recipes" className="block py-2 px-2 hover:bg-blue-600 rounded">
Recipes
</a>
<a href="/restaurants" className="block py-2 px-2 hover:bg-blue-600 rounded">
Restaurants
</a>
<a href="/cooking-tips" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cooking Tips
</a>
<a href="/wine-spirits" className="block py-2 px-2 hover:bg-blue-600 rounded">
Wine & Spirits
</a>
<a href="/food-news" className="block py-2 px-2 hover:bg-blue-600 rounded">
Food News
</a>
<a href="/chefs" className="block py-2 px-2 hover:bg-blue-600 rounded">
Chefs
</a>
</div>
</div>
</div>

{/* Family & Relationships Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('family')}
>
<span>Family & Relationships</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'family' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'family' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/family" className="block py-2 px-2 hover:bg-blue-600 rounded">
Family
</a>
<a href="/parenting" className="block py-2 px-2 hover:bg-blue-600 rounded">
Parenting
</a>
<a href="/relationships" className="block py-2 px-2 hover:bg-blue-600 rounded">
Relationships
</a>
<a href="/weddings" className="block py-2 px-2 hover:bg-blue-600 rounded">
Weddings
</a>
<a href="/pregnancy" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pregnancy & Baby
</a>
<a href="/pets" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pets
</a>
</div>
</div>
</div>

{/* Home & Garden Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('home')}
>
<span>Home & Garden</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'home' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'home' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/real-estate" className="block py-2 px-2 hover:bg-blue-600 rounded">
Real Estate
</a>
<a href="/home-design" className="block py-2 px-2 hover:bg-blue-600 rounded">
Home Design
</a>
<a href="/interior-design" className="block py-2 px-2 hover:bg-blue-600 rounded">
Interior Design
</a>
<a href="/gardening" className="block py-2 px-2 hover:bg-blue-600 rounded">
Gardening
</a>
<a href="/diy" className="block py-2 px-2 hover:bg-blue-600 rounded">
DIY & Home Improvement
</a>
<a href="/architecture" className="block py-2 px-2 hover:bg-blue-600 rounded">
Architecture
</a>
</div>
</div>
</div>

{/* Travel Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('travel')}
>
<span>Travel</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'travel' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'travel' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/destinations" className="block py-2 px-2 hover:bg-blue-600 rounded">
Destinations
</a>
<a href="/travel-tips" className="block py-2 px-2 hover:bg-blue-600 rounded">
Travel Tips
</a>
<a href="/luxury-travel" className="block py-2 px-2 hover:bg-blue-600 rounded">
Luxury Travel
</a>
<a href="/budget-travel" className="block py-2 px-2 hover:bg-blue-600 rounded">
Budget Travel
</a>
<a href="/hotels" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hotels & Resorts
</a>
</div>
</div>
</div>

{/* Other Accordion */}
<div className={currentSpecialCoverage.length > 0 ? "border-b border-blue-700" : ""}>
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('other')}
>
<span>Other</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'other' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'other' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/cars" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cars
</a>
<a href="/luxury" className="block py-2 px-2 hover:bg-blue-600 rounded">
Luxury Living
</a>
<a href="/shopping" className="block py-2 px-2 hover:bg-blue-600 rounded">
Shopping
</a>
<a href="/hobbies" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hobbies
</a>
</div>
</div>
</div>

{/* Special Coverage (Conditional) */}
{currentSpecialCoverage.length > 0 && (
<div>
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('special')}
>
<span>Special Coverage</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'special' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'special' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
{currentSpecialCoverage.map((item) => (
<a 
key={item.href}
href={item.href} 
className="block py-2 px-2 hover:bg-blue-600 rounded">
{item.label}
</a>
))}
</div>
</div>
</div>
)}

</div>
)}
</div>
</div>



{/* Technology Dropdown */}
<div>
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('technology')}
aria-expanded={activeDropdown === 'technology'}>
Technology
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'technology' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'technology' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50">

{/* Personal Tech Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('personal-tech')}
>
<span>Personal Tech</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'personal-tech' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'personal-tech' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/tech/smartphones" className="block py-2 px-2 hover:bg-blue-600 rounded">
Smartphones
</a>
<a href="/tech/laptops" className="block py-2 px-2 hover:bg-blue-600 rounded">
Laptops & Computers
</a>
<a href="/tech/wearables" className="block py-2 px-2 hover:bg-blue-600 rounded">
Wearables
</a>
<a href="/tech/smart-home" className="block py-2 px-2 hover:bg-blue-600 rounded">
Smart Home
</a>
<a href="/tech/audio" className="block py-2 px-2 hover:bg-blue-600 rounded">
Audio & Headphones
</a>
</div>
</div>
</div>

{/* Business & Innovation Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('business-innovation')}
>
<span>Business & Innovation</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'business-innovation' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'business-innovation' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/tech/artificial-intelligence" className="block py-2 px-2 hover:bg-blue-600 rounded">
Artificial Intelligence
</a>
<a href="/tech/startups" className="block py-2 px-2 hover:bg-blue-600 rounded">
Startups
</a>
<a href="/tech/cybersecurity" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cybersecurity
</a>
<a href="/tech/internet" className="block py-2 px-2 hover:bg-blue-600 rounded">
Internet & Social Media
</a>
<a href="/tech/silicon-valley" className="block py-2 px-2 hover:bg-blue-600 rounded">
Silicon Valley
</a>
</div>
</div>
</div>

{/* Reviews & Guides Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('reviews-guides')}
>
<span>Reviews & Guides</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'reviews-guides' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'reviews-guides' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/tech/reviews" className="block py-2 px-2 hover:bg-blue-600 rounded">
Product Reviews
</a>
<a href="/tech/buying-guides" className="block py-2 px-2 hover:bg-blue-600 rounded">
Buying Guides
</a>
<a href="/tech/how-to" className="block py-2 px-2 hover:bg-blue-600 rounded">
How-To & Tips
</a>
</div>
</div>
</div>

{/* Gaming Accordion */}
<div>
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('gaming')}
>
<span>Gaming</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'gaming' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'gaming' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/tech/gaming" className="block py-2 px-2 hover:bg-blue-600 rounded">
Video Games
</a>
<a href="/tech/gaming/pc" className="block py-2 px-2 hover:bg-blue-600 rounded">
PC Gaming
</a>
<a href="/tech/gaming/consoles" className="block py-2 px-2 hover:bg-blue-600 rounded">
Consoles
</a>
<a href="/tech/gaming/esports" className="block py-2 px-2 hover:bg-blue-600 rounded">
Esports
</a>
</div>
</div>
</div>

</div>
)}
</div>
</div>



{/* Sports Dropdown */}
<div >
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('sports')}
aria-expanded={activeDropdown === 'sports'}>
Sports
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'sports' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'sports' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50">

{/* Professional Sports Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('professional')}
>
<span>Professional</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'professional' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'professional' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/sports/football" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pro Football
</a>
<a href="/sports/basketball" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pro Basketball
</a>
<a href="/sports/baseball" className="block py-2 px-2 hover:bg-blue-600 rounded">
Baseball
</a>
<a href="/sports/hockey" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hockey
</a>
<a href="/sports/soccer" className="block py-2 px-2 hover:bg-blue-600 rounded">
Soccer
</a>
<a href="/sports/golf" className="block py-2 px-2 hover:bg-blue-600 rounded">
Golf
</a>
<a href="/sports/tennis" className="block py-2 px-2 hover:bg-blue-600 rounded">
Tennis
</a>
</div>
</div>
</div>

{/* College Sports Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('college')}
>
<span>College Sports</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'college' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'college' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/sports/college-football" className="block py-2 px-2 hover:bg-blue-600 rounded">
College Football
</a>
<a href="/sports/college-basketball" className="block py-2 px-2 hover:bg-blue-600 rounded">
College Basketball
</a>
</div>
</div>
</div>

{/* International Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('international')}
>
<span>International</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'international' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'international' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/sports/world-cup" className="block py-2 px-2 hover:bg-blue-600 rounded">
World Cup
</a>
<a href="/sports/olympics" className="block py-2 px-2 hover:bg-blue-600 rounded">
Olympics
</a>
<a href="/sports/premier-league" className="block py-2 px-2 hover:bg-blue-600 rounded">
Premier League
</a>
</div>
</div>
</div>

{/* Other Sports Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('other-sports')}
>
<span>Other Sports</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'other-sports' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'other-sports' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/sports/boxing" className="block py-2 px-2 hover:bg-blue-600 rounded">
Boxing & MMA
</a>
<a href="/sports/auto-racing" className="block py-2 px-2 hover:bg-blue-600 rounded">
Auto Racing
</a>
<a href="/sports/track-and-field" className="block py-2 px-2 hover:bg-blue-600 rounded">
Track & Field
</a>
<a href="/sports/ufc" className="block py-2 px-2 hover:bg-blue-600 rounded">
UFC
</a>
<a href="/sports/wrestling" className="block py-2 px-2 hover:bg-blue-600 rounded">
Boxing
</a>
<a href="/sports/wwe" className="block py-2 px-2 hover:bg-blue-600 rounded">
WWE
</a>
</div>
</div>
</div>

{/* Features Accordion */}
<div>
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('features')}
>
<span>Features</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'features' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'features' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<a href="/sports/columns" className="block py-2 px-2 hover:bg-blue-600 rounded">
Columns
</a>
<a href="/sports/podcasts" className="block py-2 px-2 hover:bg-blue-600 rounded">
Podcasts
</a>
<a href="/sports/photos" className="block py-2 px-2 hover:bg-blue-600 rounded">
Photos
</a>
</div>
</div>
</div>

</div>
)}
</div>
</div>


{/* Arts Dropdown */}
<div >
<div className="relative inline-block">
<button
type="button"
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('arts')}
aria-expanded={activeDropdown === 'arts'}
>
Arts
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'arts' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'arts' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50">

{/* Arts & Culture Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('arts-culture')}
>
<span>Arts & Culture</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'arts-culture' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'arts-culture'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/arts/theater" className="block py-2 px-2 hover:bg-blue-600 rounded">Theater</Link>
<Link href="/arts/art-design" className="block py-2 px-2 hover:bg-blue-600 rounded">Art & Design</Link>
<Link href="/arts/dance" className="block py-2 px-2 hover:bg-blue-600 rounded">Dance</Link>
<Link href="/arts/books" className="block py-2 px-2 hover:bg-blue-600 rounded">Books</Link>
<Link href="/arts/music" className="block py-2 px-2 hover:bg-blue-600 rounded">Music</Link>
</div>
</div>
</div>

{/* Screen Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('screen')}
>
<span>Screen</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'screen' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'screen'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/arts/movies" className="block py-2 px-2 hover:bg-blue-600 rounded">Movies</Link>
<Link href="/arts/television" className="block py-2 px-2 hover:bg-blue-600 rounded">Television</Link>
<Link href="/arts/streaming" className="block py-2 px-2 hover:bg-blue-600 rounded">Streaming</Link>
</div>
</div>
</div>

{/* Pop Culture Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('pop-culture')}
>
<span>Pop Culture</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'pop-culture' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'pop-culture'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/arts/pop-music" className="block py-2 px-2 hover:bg-blue-600 rounded">Pop Music</Link>
<Link href="/arts/comedy" className="block py-2 px-2 hover:bg-blue-600 rounded">Comedy</Link>
<Link href="/arts/podcasts" className="block py-2 px-2 hover:bg-blue-600 rounded">Podcasts</Link>
<Link href="/arts/best-of" className="block py-2 px-2 hover:bg-blue-600 rounded">Best of Culture</Link>
</div>
</div>
</div>

{/* Features Accordion */}
<div>
<button
type="button"
className="w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('arts-features')}
>
<span>Features</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'arts-features' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'arts-features'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className="px-2 pb-3 space-y-1">
<Link href="/arts/critics-picks" className="block py-2 px-2 hover:bg-blue-600 rounded">Critics&apos; Picks</Link>
<Link href="/arts/reviews" className="block py-2 px-2 hover:bg-blue-600 rounded">Reviews</Link>
<Link href="/arts/what-to-watch" className="block py-2 px-2 hover:bg-blue-600 rounded">What to Watch</Link>
<Link href="/arts/what-to-read" className="block py-2 px-2 hover:bg-blue-600 rounded">What to Read</Link>
</div>
</div>
</div>

</div>
)}
</div>
</div>
</div>
</div>
{/* Desktop Layout Stops Here*/}

{/* Mobile Layout */}
<div className="md:hidden">
<div className="flex items-center justify-between p-6">
{/* Mobile Layout - Logo Section */}
<div className="shrink-0">
{isEliteMember ? (
<Link href="/">
<Image 
loading="eager"
priority 
src="/images/itruth_elite.png" 
alt="Truth News Elite Logo" 
width={200} 
height={200} 
style={{ width: 'auto', height: 'auto' }}

/>
</Link>
) : isSubscribed ? (
<Link href="/">
<Image 
loading="eager"
priority 
src="/images/itruth_premium.png" 
alt="Truth News Premium Logo" 
width={200} 
height={200} 
style={{ width: 'auto', height: 'auto' }}

/>
</Link>
) : (
<Link href="/">
<Image 
loading="eager"
priority 
src="/images/it_news.png" 
alt="Truth News Logo" 
width={200} 
height={200} 
style={{ width: 'auto', height: 'auto' }}

/>
</Link>
)}
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
<div className="bg-blue-800 pb-5 pt-5 mb-4 rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('news')}
aria-expanded={activeDropdown === 'news'}>
Latest News
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'news' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'news' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-96 rounded shadow-lg z-50">

{/* U.S. News Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('us-news')}
>
<span>U.S. News</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'us-news' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'us-news' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="pb-3 space-y-1">
<Link href="/politics" className="block py-2 px-2 hover:bg-blue-600 rounded">
Politics
</Link>
<Link  href="/economy" className="block py-2 px-2 hover:bg-blue-600 rounded">
Economy
</Link>
<Link href="/crime" className="block py-2 px-2 hover:bg-blue-600 rounded">
Crime
</Link>
<Link  href="/climate" className="block py-2 px-2 hover:bg-blue-600 rounded">
Climate
</Link>
</div>
</div>
</div>
{/* World Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('world')}
>
<span>World</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'world' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'world' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className="pb-3 space-y-1">
<Link href="/asia" className="block py-2 px-2 hover:bg-blue-600 rounded">
Asia
</Link>
<Link href="/europe" className="block py-2 px-2 hover:bg-blue-600 rounded">
Europe
</Link>
<Link href="/africa" className="block py-2 px-2 hover:bg-blue-600 rounded">
Africa
</Link>
<Link href="/middle-east" className="block py-2 px-2 hover:bg-blue-600 rounded">
Middle East
</Link>
<Link href="/americas" className="block py-2 px-2 hover:bg-blue-600 rounded">
Americas
</Link>
<Link href="/south-america" className="block py-2 px-2 hover:bg-blue-600 rounded">
South America
</Link>
</div>
</div>
</div>
</div>
)}
</div>
</div>





{isEliteMember ? (
<div className="bg-blue-800 pb-5 pt-5 mb-4  rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('itruth business')}
aria-expanded={activeDropdown === 'itruth business'}>
iTruth Business
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'itruth business' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'itruth business' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-96 rounded shadow-lg z-50">

{/* Markets Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('markets')}
>
<span>Markets</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'markets' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'markets' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/markets/stocks" className="block py-2 px-2 hover:bg-blue-600 rounded">
Stocks
</Link>
<Link href="/markets/us" className="block py-2 px-2 hover:bg-blue-600 rounded">
U.S. Markets
</Link>
<Link href="/markets/pre" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pre-Markets
</Link>
<Link href="/markets/crypto" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cryptocurrency
</Link>
<Link href="/markets/futures" className="block py-2 px-2 hover:bg-blue-600 rounded">
Futures & Commodities
</Link>
<Link href="/markets/bonds" className="block py-2 px-2 hover:bg-blue-600 rounded">
Bonds
</Link>
<Link href="/markets/etfs" className="block py-2 px-2 hover:bg-blue-600 rounded">
ETFs
</Link>
<Link href="/markets/mutual-funds" className="block py-2 px-2 hover:bg-blue-600 rounded">
Mutual Funds
</Link>
</div>
</div>
</div>


</div>
)}
</div>
</div>    
):(
<Link 
href="/membership"
className="text-white/60 mb-5 font-bold whitespace-nowrap flex items-center transition-colors group"
title="Upgrade to Elite to access iTruth Business"
>
<span>iTruth Business</span>
<svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
</svg>
</Link>
)}

{/* Opinion Dropdown */}
<div className="bg-blue-800 pt-4 pb-4 mb-4 rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('opinion')}
aria-expanded={activeDropdown === 'opinion'}>
Opinion
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'opinion' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'opinion' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-64 rounded shadow-lg z-50">

{/* Editorials Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('editorials')}
>
<span>Editorials</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'editorials' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'editorials' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/opinion/columnist" className="block py-2 px-2 hover:bg-blue-600 rounded">
Columnists
</Link>
<Link href="/opinion/guest-voices" className="block py-2 px-2 hover:bg-blue-600 rounded">
Guest Voices
</Link>
<Link href="/opinion/editorials" className="block py-2 px-2 hover:bg-blue-600 rounded">
Editorials
</Link>
<Link href="/opinion/letters" className="block py-2 px-2 hover:bg-blue-600 rounded">
Letters to the Editor
</Link>
<Link href="/opinion/editorial-board" className="block py-2 px-2 hover:bg-blue-600 rounded">
The Editorial Board
</Link>
</div>
</div>
</div>

{/* Sections Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('sections')}
>
<span>Sections</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'sections' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'sections' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/opinion/sections/politics" className="block py-2 px-2 hover:bg-blue-600 rounded">
Politics
</Link>
<Link href="/opinion/sections/world" className="block py-2 px-2 hover:bg-blue-600 rounded">
World
</Link>
<Link href="/opinion/sections/culture" className="block py-2 px-2 hover:bg-blue-600 rounded">
Culture
</Link>
<Link href="/opinion/sections/economy" className="block py-2 px-2 hover:bg-blue-600 rounded">
Economy
</Link>
<Link href="/opinion/sections/technology" className="block py-2 px-2 hover:bg-blue-600 rounded">
Technology
</Link>
<Link href="/opinion/sections/climate" className="block py-2 px-2 hover:bg-blue-600 rounded">
Climate
</Link>
</div>
</div>
</div>

{/* Editor's Picks Accordion */}
<div>
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('editors-picks')}
>
<span>Editor&apos;s Picks</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'editors-picks' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'editors-picks' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/opinion/editors-picks" className="block py-2 px-2 hover:bg-blue-600 rounded">
Trending Voices
</Link>
<Link href="/opinion/weekend-reads" className="block py-2 px-2 hover:bg-blue-600 rounded">
Weekend Reads
</Link>
</div>
</div>
</div>

</div>
)}
</div>
</div>


{/* Lifestyle Dropdown */}
<div className="bg-blue-800 pb-4 pt-4 mb-4 rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('lifestyle')}
aria-expanded={activeDropdown === 'lifestyle'}>
Lifestyle
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'lifestyle' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'lifestyle' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50 max-h-[600px] overflow-y-auto">

{/* Well (Health & Wellness) Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('wellness')}
>
<span>Health & Wellness</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'wellness' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'wellness' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/fitness" className="block py-2 px-2 hover:bg-blue-600 rounded">
Fitness
</Link>
<Link href="/nutrition" className="block py-2 px-2 hover:bg-blue-600 rounded">
Nutrition
</Link>
<Link href="/mental-health" className="block py-2 px-2 hover:bg-blue-600 rounded">
Mental Health
</Link>
<Link href="/yoga-Meditation" className="block py-2 px-2 hover:bg-blue-600 rounded">
Yoga & Meditation
</Link>
<Link href="/sleep" className="block py-2 px-2 hover:bg-blue-600 rounded">
Sleep
</Link>
</div>
</div>
</div>

{/* Fashion Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('fashion')}
>
<span>Fashion</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'fashion' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'fashion' 
? "max-h-[500px] opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/beauty" className="block py-2 px-2 hover:bg-blue-600 rounded">
Beauty
</Link>
<Link href="/style" className="block py-2 px-2 hover:bg-blue-600 rounded">
Style
</Link>
<Link href="/models" className="block py-2 px-2 hover:bg-blue-600 rounded">
Models
</Link>
<Link href="/runway" className="block py-2 px-2 hover:bg-blue-600 rounded">
Runway
</Link>
<Link href="/designers" className="block py-2 px-2 hover:bg-blue-600 rounded">
Designers
</Link>
<Link href="/makeup" className="block py-2 px-2 hover:bg-blue-600 rounded">
Makeup
</Link>
<Link href="/accessories" className="block py-2 px-2 hover:bg-blue-600 rounded">
Accessories
</Link>
<Link href="/skincare" className="block py-2 px-2 hover:bg-blue-600 rounded">
Skincare
</Link>
<Link href="/hair" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hair
</Link>
</div>
</div>
</div>

{/* Food Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('food')}
>
<span>Food</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'food' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'food' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/recipes" className="block py-2 px-2 hover:bg-blue-600 rounded">
Recipes
</Link>
<Link href="/restaurants" className="block py-2 px-2 hover:bg-blue-600 rounded">
Restaurants
</Link>
<Link href="/cooking-tips" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cooking Tips
</Link>
<Link href="/wine-spirits" className="block py-2 px-2 hover:bg-blue-600 rounded">
Wine & Spirits
</Link>
<Link href="/food-news" className="block py-2 px-2 hover:bg-blue-600 rounded">
Food News
</Link>
<Link href="/chefs" className="block py-2 px-2 hover:bg-blue-600 rounded">
Chefs
</Link>
</div>
</div>
</div>

{/* Family & Relationships Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('family')}
>
<span>Family & Relationships</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'family' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'family' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/family" className="block py-2 px-2 hover:bg-blue-600 rounded">
Family
</Link>
<Link href="/parenting" className="block py-2 px-2 hover:bg-blue-600 rounded">
Parenting
</Link>
<Link href="/relationships" className="block py-2 px-2 hover:bg-blue-600 rounded">
Relationships
</Link>
<Link href="/weddings" className="block py-2 px-2 hover:bg-blue-600 rounded">
Weddings
</Link>
<Link href="/pregnancy" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pregnancy & Baby
</Link>
<Link href="/pets" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pets
</Link>
</div>
</div>
</div>

{/* Home & Garden Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('home')}
>
<span>Home & Garden</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'home' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'home' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/real-estate" className="block py-2 px-2 hover:bg-blue-600 rounded">
Real Estate
</Link>
<Link href="/home-design" className="block py-2 px-2 hover:bg-blue-600 rounded">
Home Design
</Link>
<Link href="/interior-design" className="block py-2 px-2 hover:bg-blue-600 rounded">
Interior Design
</Link>
<Link href="/gardening" className="block py-2 px-2 hover:bg-blue-600 rounded">
Gardening
</Link>
<Link href="/diy" className="block py-2 px-2 hover:bg-blue-600 rounded">
DIY & Home Improvement
</Link>
<Link href="/architecture" className="block py-2 px-2 hover:bg-blue-600 rounded">
Architecture
</Link>
</div>
</div>
</div>

{/* Travel Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('travel')}
>
<span>Travel</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'travel' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'travel' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/destinations" className="block py-2 px-2 hover:bg-blue-600 rounded">
Destinations
</Link>
<Link href="/travel-tips" className="block py-2 px-2 hover:bg-blue-600 rounded">
Travel Tips
</Link>
<Link href="/luxury-travel" className="block py-2 px-2 hover:bg-blue-600 rounded">
Luxury Travel
</Link>
<Link href="/budget-travel" className="block py-2 px-2 hover:bg-blue-600 rounded">
Budget Travel
</Link>
<Link href="/hotels" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hotels & Resorts
</Link>
</div>
</div>
</div>

{/* Other Accordion */}
<div className={currentSpecialCoverage.length > 0 ? "border-b border-blue-700" : ""}>
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('other')}
>
<span>Other</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'other' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'other' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/cars" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cars
</Link>
<Link href="/luxury" className="block py-2 px-2 hover:bg-blue-600 rounded">
Luxury Living
</Link>
<Link href="/shopping" className="block py-2 px-2 hover:bg-blue-600 rounded">
Shopping
</Link>
<Link href="/hobbies" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hobbies
</Link>
</div>
</div>
</div>

{/* Special Coverage (Conditional) */}
{currentSpecialCoverage.length > 0 && (
<div>
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('special')}
>
<span>Special Coverage</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'special' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'special' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
{currentSpecialCoverage.map((item) => (
<Link 
key={item.href}
href={item.href} 
className="block py-2 px-2 hover:bg-blue-600 rounded">
{item.label}
</Link>
))}
</div>
</div>
</div>
)}

</div>
)}
</div>
</div>

{/* Technology Dropdown */}
<div className="bg-blue-800 pb-4 mb-4 pt-4 rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('technology')}
aria-expanded={activeDropdown === 'technology'}>
Technology
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'technology' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'technology' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50">

{/* Personal Tech Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('personal-tech')}
>
<span>Personal Tech</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'personal-tech' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'personal-tech' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/tech/smartphones" className="block py-2 px-2 hover:bg-blue-600 rounded">
Smartphones
</Link>
<Link href="/tech/laptops" className="block py-2 px-2 hover:bg-blue-600 rounded">
Laptops & Computers
</Link>
<Link href="/tech/wearables" className="block py-2 px-2 hover:bg-blue-600 rounded">
Wearables
</Link>
<Link href="/tech/smart-home" className="block py-2 px-2 hover:bg-blue-600 rounded">
Smart Home
</Link>
<Link href="/tech/audio" className="block py-2 px-2 hover:bg-blue-600 rounded">
Audio & Headphones
</Link>
</div>
</div>
</div>

{/* Business & Innovation Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('business-innovation')}
>
<span>Business & Innovation</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'business-innovation' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'business-innovation' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/tech/artificial-intelligence" className="block py-2 px-2 hover:bg-blue-600 rounded">
Artificial Intelligence
</Link>
<Link href="/tech/startups" className="block py-2 px-2 hover:bg-blue-600 rounded">
Startups
</Link>
<Link href="/tech/cybersecurity" className="block py-2 px-2 hover:bg-blue-600 rounded">
Cybersecurity
</Link>
<Link href="/tech/internet" className="block py-2 px-2 hover:bg-blue-600 rounded">
Internet & Social Media
</Link>
<Link href="/tech/silicon-valley" className="block py-2 px-2 hover:bg-blue-600 rounded">
Silicon Valley
</Link>
</div>
</div>
</div>

{/* Reviews & Guides Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('reviews-guides')}
>
<span>Reviews & Guides</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'reviews-guides' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'reviews-guides' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/tech/reviews" className="block py-2 px-2 hover:bg-blue-600 rounded">
Product Reviews
</Link>
<Link href="/tech/buying-guides" className="block py-2 px-2 hover:bg-blue-600 rounded">
Buying Guides
</Link>
<Link href="/tech/how-to" className="block py-2 px-2 hover:bg-blue-600 rounded">
How-To & Tips
</Link>
</div>
</div>
</div>

{/* Gaming Accordion */}
<div>
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('gaming')}
>
<span>Gaming</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'gaming' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'gaming' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/tech/gaming" className="block py-2 px-2 hover:bg-blue-600 rounded">
Video Games
</Link>
<Link href="/tech/gaming/pc" className="block py-2 px-2 hover:bg-blue-600 rounded">
PC Gaming
</Link>
<Link href="/tech/gaming/consoles" className="block py-2 px-2 hover:bg-blue-600 rounded">
Consoles
</Link>
<Link href="/tech/gaming/esports" className="block py-2 px-2 hover:bg-blue-600 rounded">
Esports
</Link>
</div>
</div>
</div>

</div>
)}
</div>
</div>

{/* Sports Dropdown */}
<div className="bg-blue-800 pb-4 pt-4 mb-4 rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="text-white hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('sports')}
aria-expanded={activeDropdown === 'sports'}>
Sports
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'sports' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'sports' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50">

{/* Professional Sports Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('professional')}
>
<span>Professional</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'professional' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'professional' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/sports/football" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pro Football
</Link>
<Link href="/sports/basketball" className="block py-2 px-2 hover:bg-blue-600 rounded">
Pro Basketball
</Link>
<Link href="/sports/baseball" className="block py-2 px-2 hover:bg-blue-600 rounded">
Baseball
</Link>
<Link href="/sports/hockey" className="block py-2 px-2 hover:bg-blue-600 rounded">
Hockey
</Link>
<Link href="/sports/soccer" className="block py-2 px-2 hover:bg-blue-600 rounded">
Soccer
</Link>
<Link href="/sports/golf" className="block py-2 px-2 hover:bg-blue-600 rounded">
Golf
</Link>
<Link href="/sports/tennis" className="block py-2 px-2 hover:bg-blue-600 rounded">
Tennis
</Link>
</div>
</div>
</div>

{/* College Sports Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('college')}
>
<span>College Sports</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'college' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'college' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/sports/college-football" className="block py-2 px-2 hover:bg-blue-600 rounded">
College Football
</Link>
<Link href="/sports/college-basketball" className="block py-2 px-2 hover:bg-blue-600 rounded">
College Basketball
</Link>
</div>
</div>
</div>

{/* International Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('international')}
>
<span>International</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'international' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'international' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/sports/world-cup" className="block py-2 px-2 hover:bg-blue-600 rounded">
World Cup
</Link>
<Link href="/sports/olympics" className="block py-2 px-2 hover:bg-blue-600 rounded">
Olympics
</Link>
<Link href="/sports/premier-league" className="block py-2 px-2 hover:bg-blue-600 rounded">
Premier League
</Link>
</div>
</div>
</div>

{/* Other Sports Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('other-sports')}
>
<span>Other Sports</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'other-sports' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'other-sports' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/sports/boxing" className="block py-2 px-2 hover:bg-blue-600 rounded">
Boxing & MMA
</Link>
<Link href="/sports/auto-racing" className="block py-2 px-2 hover:bg-blue-600 rounded">
Auto Racing
</Link>
<Link href="/sports/track-and-field" className="block py-2 px-2 hover:bg-blue-600 rounded">
Track & Field
</Link>
<Link href="/sports/ufc" className="block py-2 px-2 hover:bg-blue-600 rounded">
UFC
</Link>
<Link href="/sports/wrestling" className="block py-2 px-2 hover:bg-blue-600 rounded">
Boxing
</Link>
<Link href="/sports/wwe" className="block py-2 px-2 hover:bg-blue-600 rounded">
WWE
</Link>
</div>
</div>
</div>

{/* Features Accordion */}
<div>
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('features')}
>
<span>Features</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'features' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'features' 
? "max-h-96 opacity-100" 
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/sports/columns" className="block py-2 px-2 hover:bg-blue-600 rounded">
Columns
</Link>
<Link href="/sports/podcasts" className="block py-2 px-2 hover:bg-blue-600 rounded">
Podcasts
</Link>
<Link href="/sports/photos" className="block py-2 px-2 hover:bg-blue-600 rounded">
Photos
</Link>
</div>
</div>
</div>

</div>
)}
</div>
</div>

{/* Arts Dropdown */}
<div className="bg-blue-800 pb-4 mb-4 pt-4 rounded-lg">
<div className="relative inline-block">
<button
type="button"
className="hover:underline decoration-2 font-bold cursor-pointer whitespace-nowrap flex items-center"
onClick={() => toggleDropdown('arts')}
aria-expanded={activeDropdown === 'arts'}
>
Arts
<ChevronDown
height={20}
className={`ml-1 transition-transform duration-300 ${
activeDropdown === 'arts' ? "rotate-180" : ""
}`}
/>
</button>

{activeDropdown === 'arts' && (
<div className="absolute left-0 bg-blue-900 text-white mt-2 py-4 w-80 rounded shadow-lg z-50">

{/* Arts & Culture Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('arts-culture')}
>
<span>Arts & Culture</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'arts-culture' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'arts-culture'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/arts/theater" className="block py-2 px-2 hover:bg-blue-600 rounded">Theater</Link>
<Link href="/arts/art-design" className="block py-2 px-2 hover:bg-blue-600 rounded">Art & Design</Link>
<Link href="/arts/dance" className="block py-2 px-2 hover:bg-blue-600 rounded">Dance</Link>
<Link href="/arts/books" className="block py-2 px-2 hover:bg-blue-600 rounded">Books</Link>
<Link href="/arts/music" className="block py-2 px-2 hover:bg-blue-600 rounded">Music</Link>
</div>
</div>
</div>

{/* Screen Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('screen')}
>
<span>Screen</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'screen' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'screen'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/arts/movies" className="block py-2 px-2 hover:bg-blue-600 rounded">Movies</Link>
<Link href="/arts/television" className="block py-2 px-2 hover:bg-blue-600 rounded">Television</Link>
<Link href="/arts/streaming" className="block py-2 px-2 hover:bg-blue-600 rounded">Streaming</Link>
</div>
</div>
</div>

{/* Pop Culture Accordion */}
<div className="border-b border-blue-700">
<button
type="button"
className="w-full py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('pop-culture')}
>
<span>Pop Culture</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'pop-culture' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'pop-culture'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/arts/pop-music" className="block py-2 px-2 hover:bg-blue-600 rounded">Pop Music</Link>
<Link href="/arts/comedy" className="block py-2 px-2 hover:bg-blue-600 rounded">Comedy</Link>
<Link href="/arts/podcasts" className="block py-2 px-2 hover:bg-blue-600 rounded">Podcasts</Link>
<Link href="/arts/best-of" className="block py-2 px-2 hover:bg-blue-600 rounded">Best of Culture</Link>
</div>
</div>
</div>

{/* Features Accordion */}
<div>
<button
type="button"
className="w-full  py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-between hover:bg-blue-800 transition-colors"
onClick={() => toggleAccordion('arts-features')}
>
<span>Features</span>
<ChevronDown
height={18}
className={`transition-transform duration-300 ${
activeAccordion === 'arts-features' ? "rotate-180" : ""
}`}
/>
</button>

<div
className={`overflow-hidden transition-all duration-300 ease-in-out ${
activeAccordion === 'arts-features'
? "max-h-96 opacity-100"
: "max-h-0 opacity-0"
}`}
>
<div className=" pb-3 space-y-1">
<Link href="/arts/critics-picks" className="block py-2 px-2 hover:bg-blue-600 rounded">Critics&apos; Picks</Link>
<Link href="/arts/reviews" className="block py-2 px-2 hover:bg-blue-600 rounded">Reviews</Link>
<Link href="/arts/what-to-watch" className="block py-2 px-2 hover:bg-blue-600 rounded">What to Watch</Link>
<Link href="/arts/what-to-read" className="block py-2 px-2 hover:bg-blue-600 rounded">What to Read</Link>
</div>
</div>
</div>

</div>
)}
</div>
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