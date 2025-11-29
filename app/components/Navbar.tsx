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
const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
const [user, setUser] = useState<User | null>(null);
const [email, setEmail] = useState('');
const [subscribed, setSubscribed] = useState(false);
const [isSubscribed, setIsSubscribed] = useState(false);
const [showNewsletter, setShowNewsletter] = useState(false);
const router = useRouter();
<Toaster position="top-center" />


useEffect(() => {
// Simulate loading
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
// Check current auth session
const checkUser = async () => {
const { data: { session } } = await supabase.auth.getSession();
setUser(session?.user ?? null);
// Check if user's email is subscribed to newsletter
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
// Listen for auth changes
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

// Check if email already exists
const { data: existing } = await supabase
.from('newsletter_subscribers')
.select('email, subscribed')
.eq('email', email)
.single();

if (existing && existing.subscribed) {
toast('This email is already subscribed!');
return;
}

// If exists but unsubscribed, resubscribe
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
// New subscriber
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

useEffect(() => {
// Check current auth session
const checkUser = async () => {
const { data: { session } } = await supabase.auth.getSession();
setUser(session?.user ?? null);
setIsLoading(false);
};
checkUser();

// Listen for auth changes
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
});

return () => subscription.unsubscribe();
}, []);

if (isLoading) {
return (
<nav className="w-full dark:bg-blue-900 text-white shadow-md">
<div className="container mx-auto p-4">
<div className="hidden md:flex md:items-center md:justify-between md:gap-6">
<div className="w-48 h-12 bg-gray-200 animate-pulse rounded"></div>
<div className="flex-1 max-w-md h-10 bg-gray-200 animate-pulse rounded-full"></div>
<div className="flex space-x-6">
{[...Array(5)].map((_, i) => (
<div key={i} className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
))}
</div>
</div>
<div className="md:hidden flex items-center justify-between">
<div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
<div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
</div>
</div>
</nav>
);
}

return (
<nav className="w-full dark:bg-blue-900 text-white shadow-md">
<div className="container mx-auto p-4">
{/* Top Support Bar */}
<div className="w-full bg-blue-400 text-black text-sm">
<div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3 sm:gap-4">
<span className="text-center sm:text-left">
Support independent journalism. <strong className="text-blue-900">Join iTruth News.</strong>
</span>

<div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
{/* Newsletter Section */}
<div className="relative w-full sm:w-auto">
<button
onClick={() => setShowNewsletter(!showNewsletter)}
className="text-blue-900 font-medium hover:underline underline-offset-2 transition-all whitespace-nowrap cusor-pointer">
{isSubscribed ? ' Newsletter ✓' : ' Newsletter'}
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

{/* Support & Login Buttons */}

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
className="px-4 py-1.5 text-sm font-medium text-white bg-blue-900 border border-blue-900 rounded hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm cusor-pointer"
onClick={() => router.push('/login')}
>
Login
</button>
)}
</div>
</div>


</div>
</div>
<div className="pb-8 border-b border-gray-400 mb-4"></div>

{/* Desktop Layout */}
<div className="hidden md:flex md:items-center md:justify-between md:flex-wrap md:gap-6">
<Link href="/">
<Image src="/images/it_back.png" alt="Truth News Logo" width={200} height={200} />
</Link>          
<div className="shrink-0"></div>

{/* Navigation Links */}
<div className="flex items-center space-x-6 text-sm font-medium shrink-0">
{/* Core Navigation Links */}
<Link href='/topstories' className="hover:underline  decoration-2 whitespace-nowrap">Top Stories</Link>
<Link href="/politics" className="hover:underline decoration-2 whitespace-nowrap">Politics</Link> 
<Link href="/opinion" className="hover:underline  decoration-2 whitespace-nowrap">Opinion</Link> 
<Link href="/finance" className="hover:underline  decoration-2 whitespace-nowrap">Finance</Link> 
<Link href="/technology" className="hover:underline  decoration-2 whitespace-nowrap">Technology</Link>
<Link href='/sports' className="hover:underline  decoration-2 whitespace-nowrap">Sports</Link>
<Link href='/entertainment' className="hover:underline  decoration-2 whitespace-nowrap">Entertainment</Link>
{/* Core Navigation Links */}



{/* Desktop Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline decoration-2 cursor-pointer whitespace-nowrap flex items-center"
onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
aria-expanded={menuDropdownOpen}>More
<ChevronDown
height={20}
className={`ml-1 transition-transform ${menuDropdownOpen ? "rotate-180" : ""}`}
/>
</button>

{menuDropdownOpen && (
<div className="absolute right-0 dark:bg-blue-900 text-white mt-2 py-6 w-lg rounded shadow-lg z-50 grid grid-cols-3 gap-6 px-4">
{/* World News Column */}
<div className="border-r">
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">World News</h3>
<Link href="/world" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Headlines</Link>
<Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">International Politics</Link>
<Link href="/conflict" className="block px-2 py-1 hover:bg-blue-600 rounded">Conflict & Security</Link>
<Link href="/economy" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Economy</Link>
<Link href="/climate" className="block px-2 py-1 hover:bg-blue-600 rounded">Climate & Environment</Link>
<Link href="/health" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Health</Link>
<Link href="/science" className="block px-2 py-1 hover:bg-blue-600 rounded">Science & Innovation</Link>

{/* Regional Coverage */}
<Link href="/africa" className="block px-2 py-1 hover:bg-blue-600 rounded">Africa</Link>
<Link href="/asia" className="block px-2 py-1 hover:bg-blue-600 rounded">Asia</Link>
<Link href="/europe" className="block px-2 py-1 hover:bg-blue-600 rounded">Europe</Link>
<Link href="/middle-east" className="block px-2 py-1 hover:bg-blue-600 rounded">Middle East</Link>
<Link href="/americas" className="block px-2 py-1 hover:bg-blue-600 rounded">Americas</Link>
<Link href="/south-america" className="block px-2 py-1 hover:bg-blue-600 rounded">South America</Link>
</div>

{/* Video Games Column */}
<div className="border-r">
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Video Games</h3>
<Link href="/playstation" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation</Link>
<Link href="/xbox" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox</Link>
<Link href="/nintendo" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo</Link>
<Link href="/pcgaming" className="block px-2 py-1 hover:bg-blue-600 rounded">PC Gaming</Link>
<Link href="/mobilegaming" className="block px-2 py-1 hover:bg-blue-600 rounded">Mobile Gaming</Link>
<Link href="/cloudgaming" className="block px-2 py-1 hover:bg-blue-600 rounded">Cloud Gaming</Link>
<Link href="/esports" className="block px-2 py-1 hover:bg-blue-600 rounded">Esports</Link>
<Link href="/indie" className="block px-2 py-1 hover:bg-blue-600 rounded">Indie Games</Link>
<Link href="/retro" className="block px-2 py-1 hover:bg-blue-600 rounded">Retro Classics</Link>
<Link href="/gamenews" className="block px-2 py-1 hover:bg-blue-600 rounded">Gaming News</Link>
<Link href="/gamedev" className="block px-2 py-1 hover:bg-blue-600 rounded">Game Development</Link>
<Link href="/gamereviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Game Reviews</Link>
<Link href="/gameguides" className="block px-2 py-1 hover:bg-blue-600 rounded">Game Guides</Link>
</div>


{/* Lifestyle Column */}
<div>
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Lifestyle</h3>
<Link href="/cars" className="block px-2 py-1 hover:bg-blue-600 rounded">Automotive</Link>
<Link href="/travel" className="block px-2 py-1 hover:bg-blue-600 rounded">Travel</Link>
<Link href="faith" className="block px-2 py-1 hover:bg-blue-600 rounded">Faith & Religion</Link>
<Link href="/food" className="block px-2 py-1 hover:bg-blue-600 rounded">Food & Dining</Link>
<Link href="/fashion" className="block px-2 py-1 hover:bg-blue-600 rounded">Fashion</Link>
<Link href="/home" className="block px-2 py-1 hover:bg-blue-600 rounded">Home & Living</Link>
<Link href="/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">Arts & Culture</Link>
<Link href="/books" className="block px-2 py-1 hover:bg-blue-600 rounded">Books</Link>
<Link href="/relationships" className="block px-2 py-1 hover:bg-blue-600 rounded">Relationships</Link>
{new Date().getMonth() === 6 && (
<Link href="/pride" className="block px-2 py-1 hover:bg-blue-600 rounded">Pride</Link>
)}
</div>

{/* Health Column */}
<div>
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Health </h3>
<Link href="/nutrition" className="block px-2 py-1 hover:bg-blue-600 rounded">Nutrition</Link>
<Link href="/diseases" className="block px-2 py-1 hover:bg-blue-600 rounded">Diseases & Conditions</Link>
<Link href="/medical-research" className="block px-2 py-1 hover:bg-blue-600 rounded">Medical Research</Link>
<Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness & Exercise</Link>
<Link href="/wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Wellness Tips</Link>
<Link href="/pethealth" className="block px-2 py-1 hover:bg-blue-600 rounded">Pet Health</Link>
<Link href="/health-policy" className="block px-2 py-1 hover:bg-blue-600 rounded">Health Policy</Link>
<Link href="/global-health" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Health</Link>
<Link href="/health-technology" className="block px-2 py-1 hover:bg-blue-600 rounded">Health Technology</Link>
<Link href="/public-health" className="block px-2 py-1 hover:bg-blue-600 rounded">Public Health</Link>
<Link href="/mental-wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Mental Wellness</Link>
<Link href="/health-news" className="block px-2 py-1 hover:bg-blue-600 rounded">Health News</Link>
<Link href="/healthy-living" className="block px-2 py-1 hover:bg-blue-600 rounded">Healthy Living</Link>
</div>

</div>
)}

</div>
</div>
</div>

{/* Mobile Layout */}
<div className="md:hidden">
{/* Top Row: Logo + Hamburger */}
<div className="flex items-center justify-between">

<div className="shrink-0">
<Image src="/images/it.png" alt="Truth News Logo" width={200} height={200} />
</div>

<button 
className="text-white focus:outline-none text-2xl cursor-pointer"
onClick={() => setMenuOpen(!menuOpen)}
aria-label="Toggle menu">☰</button>
</div>

{/* Mobile Menu */}

{menuOpen && (
<div className="mt-4 space-y-4">
{/* Search Bar */}
<div className="relative">

<input
type="text"
placeholder="Search iTruth News..."
aria-label="Search iTruth News"
className="rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black shadow-sm"/>

<button
className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-1 transition-colors">
🔍
</button>
</div>

{/* Core Navigation Links */}
<div className="flex flex-col space-y-3 text-sm font-medium pb-2">
<Link href='/topstories' className="hover:underline  decoration-2 whitespace-nowrap">Top Stories</Link>
<Link href="/politics" className="hover:underline decoration-2 whitespace-nowrap">Politics</Link> 
<Link href="/opinion" className="hover:underline  decoration-2 whitespace-nowrap">Opinion</Link> 
<Link href="/finance" className="hover:underline  decoration-2 whitespace-nowrap">Finance</Link> 
<Link href="/technology" className="hover:underline  decoration-2 whitespace-nowrap">Technology</Link>
<Link href='/sports' className="hover:underline  decoration-2 whitespace-nowrap">Sports</Link>
<Link href='/entertainment' className="hover:underline  decoration-2 whitespace-nowrap">Entertainment</Link>
</div>

{/* More Dropdown (same grid as desktop) */}
<div>
<button
type="button"
className="hover:underline cursor-pointer flex items-center text-sm font-medium"
onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
aria-expanded={menuDropdownOpen}>
More
<ChevronDown
height={20}
className={`ml-1 transition-transform ${menuDropdownOpen ? "rotate-180" : ""}`}/>
</button>

{menuDropdownOpen && (
<div className="dark:bg-blue-900 text-white mt-2 py-6 rounded shadow-lg grid grid-cols-1 gap-6 px-4">
{/* Reuse the same columns from desktop dropdown */}

{/* World News Column */}
<div>
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">World News</h3>
<Link href="/world" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Headlines</Link>
<Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">International Politics</Link>
<Link href="/conflict" className="block px-2 py-1 hover:bg-blue-600 rounded">Conflict & Security</Link>
<Link href="/economy" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Economy</Link>
<Link href="/climate" className="block px-2 py-1 hover:bg-blue-600 rounded">Climate & Environment</Link>
<Link href="/health" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Health</Link>
<Link href="/science" className="block px-2 py-1 hover:bg-blue-600 rounded">Science & Innovation</Link>

 {/* Regional Coverage */}
<Link href="/africa" className="block px-2 py-1 hover:bg-blue-600 rounded">Africa</Link>
<Link href="/asia" className="block px-2 py-1 hover:bg-blue-600 rounded">Asia</Link>
<Link href="/europe" className="block px-2 py-1 hover:bg-blue-600 rounded">Europe</Link>
<Link href="/middle-east" className="block px-2 py-1 hover:bg-blue-600 rounded">Middle East</Link>
<Link href="/americas" className="block px-2 py-1 hover:bg-blue-600 rounded">Americas</Link>
<Link href="/south-america" className="block px-2 py-1 hover:bg-blue-600 rounded">South America</Link>
</div>


<div className="pb-8 border-b border-gray-200 mb-8"></div>


{/* Video Games Column */}
<div>
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Video Games</h3>
<Link href="/playstation" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation</Link>
<Link href="/xbox" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox</Link>
<Link href="/nintendo" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo</Link>
<Link href="/pcgaming" className="block px-2 py-1 hover:bg-blue-600 rounded">PC Gaming</Link>
<Link href="/mobilegaming" className="block px-2 py-1 hover:bg-blue-600 rounded">Mobile Gaming</Link>
<Link href="/cloudgaming" className="block px-2 py-1 hover:bg-blue-600 rounded">Cloud Gaming</Link>
<Link href="/esports" className="block px-2 py-1 hover:bg-blue-600 rounded">Esports</Link>
<Link href="/indie" className="block px-2 py-1 hover:bg-blue-600 rounded">Indie Games</Link>
<Link href="/retro" className="block px-2 py-1 hover:bg-blue-600 rounded">Retro Classics</Link>
<Link href="/gamenews" className="block px-2 py-1 hover:bg-blue-600 rounded">Gaming News</Link>
<Link href="/gamedev" className="block px-2 py-1 hover:bg-blue-600 rounded">Game Development</Link>
<Link href="/gamereviews" className="block px-2 py-1 hover:bg-blue-600 rounded">Game Reviews</Link>
<Link href="/gameguides" className="block px-2 py-1 hover:bg-blue-600 rounded">Game Guides</Link>
</div>


<div className="pb-8 border-b border-gray-200 mb-8"></div>


{/* Lifestyle Column */}
<div>
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Lifestyle</h3>
<Link href="cars" className="block px-2 py-1 hover:bg-blue-600 rounded">Automotive</Link>
<Link href="/travel" className="block px-2 py-1 hover:bg-blue-600 rounded">Travel</Link>
<Link href="/pets" className="block px-2 py-1 hover:bg-blue-600 rounded">Pets</Link>
<Link href="faith" className="block px-2 py-1 hover:bg-blue-600 rounded">Faith & Religion</Link>
<Link href="/food" className="block px-2 py-1 hover:bg-blue-600 rounded">Food & Dining</Link>
<Link href="/fashion" className="block px-2 py-1 hover:bg-blue-600 rounded">Fashion</Link>
<Link href="/home" className="block px-2 py-1 hover:bg-blue-600 rounded">Home & Living</Link>
<Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness</Link>
<Link href="/wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Wellness</Link>
<Link href="/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">Arts & Culture</Link>
<Link href="/books" className="block px-2 py-1 hover:bg-blue-600 rounded">Books</Link>
<Link href="/relationships" className="block px-2 py-1 hover:bg-blue-600 rounded">Relationships</Link>
{new Date().getMonth() === 5 && (
<Link href="/pride" className="block px-2 py-1 hover:bg-blue-600 rounded">Pride</Link>
)}
</div>

<div className="pb-8 border-b border-gray-200 mb-8"></div>


{/* Health Column */}
<div>
<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Health </h3>
<Link href="/nutrition" className="block px-2 py-1 hover:bg-blue-600 rounded">Nutrition</Link>
<Link href="/diseases" className="block px-2 py-1 hover:bg-blue-600 rounded">Diseases & Conditions</Link>
<Link href="/medical-research" className="block px-2 py-1 hover:bg-blue-600 rounded">Medical Research</Link>
<Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness & Exercise</Link>
<Link href="/wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Wellness Tips</Link>
<Link href="/pethealth" className="block px-2 py-1 hover:bg-blue-600 rounded">Pet Health</Link>
<Link href="/health-policy" className="block px-2 py-1 hover:bg-blue-600 rounded">Health Policy</Link>
<Link href="/global-health" className="block px-2 py-1 hover:bg-blue-600 rounded">Global Health</Link>
<Link href="/health-technology" className="block px-2 py-1 hover:bg-blue-600 rounded">Health Technology</Link>
<Link href="/public-health" className="block px-2 py-1 hover:bg-blue-600 rounded">Public Health</Link>
<Link href="/mental-wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Mental Wellness</Link>
<Link href="/health-news" className="block px-2 py-1 hover:bg-blue-600 rounded">Health News</Link>
<Link href="/healthy-living" className="block px-2 py-1 hover:bg-blue-600 rounded">Healthy Living</Link>
</div>

</div>
)}
</div>
</div>
)}

</div>
</div>
</nav>
);
}