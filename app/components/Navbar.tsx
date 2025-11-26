"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

useEffect(() => {
// Simulate loading
setTimeout(() => setIsLoading(false), 1000);
}, []);


if (isLoading) {
return (
<nav className="w-full bg-sky-900 text-white shadow-md">
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
<nav className="w-full bg-blue-700 text-white shadow-md">
<div className="container mx-auto p-4">
{/* Desktop Layout */}
<div className="hidden md:flex md:items-center md:justify-between md:flex-wrap md:gap-6">
<Link href="/">
<Image src="/images/it_back.png" alt="Truth News Logo" width={200} height={200} />
</Link>          
<div className="shrink-0"></div>

{/* Search Bar - Center */}
<div className="flex-1 max-w-md">
<div className="relative">
<input
type="text"          
placeholder="Search iTruth News..."
aria-label="Search iTruth News"
className="rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black shadow-sm"
/>
<button
className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-1 transition-colors"
>
🔍
</button>
</div>
</div>

{/* Navigation Links */}
<div className="flex items-center space-x-6 text-sm font-medium shrink-0">
<Link href="/politics" className="hover:underline hover:decoration-red-500 decoration-2 whitespace-nowrap">Politics</Link> 
<Link href="/opinion" className="hover:underline hover:decoration-red-500 decoration-2 whitespace-nowrap">Opinion</Link> 
<Link href="/finance" className="hover:underline hover:decoration-red-500 decoration-2 whitespace-nowrap">Finance</Link> 
<Link href="/technology" className="hover:underline hover:decoration-red-500 decoration-2 whitespace-nowrap">Technology</Link>




{/* Desktop Dropdown */}
<div className="relative">
<button
type="button"
className="hover:underline cursor-pointer whitespace-nowrap flex items-center"
onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
aria-expanded={menuDropdownOpen}>More
<ChevronDown
height={20}
className={`ml-1 transition-transform ${menuDropdownOpen ? "rotate-180" : ""}`}
/>
</button>

{menuDropdownOpen && (
  <div className="absolute right-0 bg-blue-700 text-white mt-2 py-6 w-lg rounded shadow-lg z-50 grid grid-cols-3 gap-6 px-4">
    
    {/* Column 1: News */}
<div>
  <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">News</h3>
  <Link href="/usnews" className="block px-2 py-1 hover:bg-blue-600 rounded">US News</Link>
  <Link href="/world" className="block px-2 py-1 hover:bg-blue-600 rounded">World</Link>
  <Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">Politics</Link>
  <Link href="/business" className="block px-2 py-1 hover:bg-blue-600 rounded">Business</Link>
  <Link href="/environment" className="block px-2 py-1 hover:bg-blue-600 rounded">Environment</Link>
  <Link href="/education" className="block px-2 py-1 hover:bg-blue-600 rounded">Education</Link>
  <Link href="/health" className="block px-2 py-1 hover:bg-blue-600 rounded">Health</Link>
  <Link href="/science" className="block px-2 py-1 hover:bg-blue-600 rounded">Science</Link>
</div>


    {/* Column 2: Lifestyle */}
  <div>
  <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Lifestyle</h3>
  <Link href="/travel" className="block px-2 py-1 hover:bg-blue-600 rounded">Travel</Link>
  <Link href="/food" className="block px-2 py-1 hover:bg-blue-600 rounded">Food & Dining</Link>
  <Link href="/fashion" className="block px-2 py-1 hover:bg-blue-600 rounded">Fashion</Link>
  <Link href="/home" className="block px-2 py-1 hover:bg-blue-600 rounded">Home & Living</Link>
  <Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness</Link>
  <Link href="/wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Wellness</Link>
  <Link href="/culture" className="block px-2 py-1 hover:bg-blue-600 rounded">Arts & Culture</Link>
</div>


    {/* Column 3: Video Games */}
    <div>
      <h3 className="text-sm  font-semibold uppercase tracking-wide mb-2">Video Games</h3>
      <Link href="/movies" className="block px-2 py-1 hover:bg-blue-600 rounded">Playstation</Link>
      <Link href="/music" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox</Link>
      <Link href="/sports" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo</Link>
      <Link href="/gaming" className="block px-2 py-1 hover:bg-blue-600 rounded">PC Gaming</Link>
      <Link href="/arts" className="block px-2 py-1 hover:bg-blue-600 rounded">Mobile Gaming</Link>

    </div>
    {/* Column 4: Entertainment */}
    <div>
      <h3 className="text-sm  font-semibold uppercase tracking-wide mb-2">Entertainment</h3>
      <Link href="/movies" className="block px-2 py-1 hover:bg-blue-600 rounded">Movies</Link>
      <Link href="/music" className="block px-2 py-1 hover:bg-blue-600 rounded">Music</Link>
      <Link href="/tv" className="block px-2 py-1 hover:bg-blue-600 rounded">TV Shows</Link>
      <Link href="/celebrity" className="block px-2 py-1 hover:bg-blue-600 rounded">Celebrity News</Link>

    </div>

    {/* Sports Column */}
    <div>
      <h3 className="text-sm  font-semibold uppercase tracking-wide mb-2">Sports</h3>
      <Link href="/nfl" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">NFL</Link>
            <Link href="/mlb" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">MLB</Link>
            <Link href="/nba" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">NBA</Link>
            <Link href="/soccer" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">Soccer</Link>
            <Link href="/nhl" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">NHL</Link>
            <Link href="/golf" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">Golf</Link>
            <Link href="/tennis" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">Tennis</Link>
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
aria-label="Toggle menu"
>
☰
</button>
</div>

{/* Mobile Menu */}
{/* Mobile Menu */}
{menuOpen && (
  <div className="mt-4 space-y-4">
    {/* Search Bar */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search iTruth News..."
        aria-label="Search iTruth News"
        className="rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black shadow-sm"
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-1 transition-colors"
      >
        🔍
      </button>
    </div>

    {/* Core Navigation Links */}
    <div className="flex flex-col space-y-3 text-sm font-medium pb-2">
      <Link href="/politics" className="hover:underline py-2">Politics</Link>
      <Link href="/opinion" className="hover:underline py-2">Opinion</Link>
      <Link href="/finance" className="hover:underline py-2">Finance</Link>
      <Link href="/technology" className="hover:underline py-2">Technology</Link>
    </div>

    {/* More Dropdown (same grid as desktop) */}
    <div>
      <button
        type="button"
        className="hover:underline cursor-pointer flex items-center text-sm font-medium"
        onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
        aria-expanded={menuDropdownOpen}
      >
        More
        <ChevronDown
          height={20}
          className={`ml-1 transition-transform ${menuDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {menuDropdownOpen && (
        <div className="bg-blue-700 text-white mt-2 py-6 rounded shadow-lg grid grid-cols-1 gap-6 px-4">
          {/* Reuse the same columns from desktop dropdown */}
          {/* Column 1: News */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">News</h3>
            <Link href="/usnews" className="block px-2 py-1 hover:bg-blue-600 rounded">US News</Link>
            <Link href="/world" className="block px-2 py-1 hover:bg-blue-600 rounded">World</Link>
            <Link href="/politics" className="block px-2 py-1 hover:bg-blue-600 rounded">Politics</Link>
            <Link href="/business" className="block px-2 py-1 hover:bg-blue-600 rounded">Business</Link>
            <Link href="/environment" className="block px-2 py-1 hover:bg-blue-600 rounded">Environment</Link>
            <Link href="/education" className="block px-2 py-1 hover:bg-blue-600 rounded">Education</Link>
            <Link href="/health" className="block px-2 py-1 hover:bg-blue-600 rounded">Health</Link>
            <Link href="/science" className="block px-2 py-1 hover:bg-blue-600 rounded">Science</Link>
          </div>

          {/* Column 2: Lifestyle */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Lifestyle</h3>
            <Link href="/travel" className="block px-2 py-1 hover:bg-blue-600 rounded">Travel</Link>
            <Link href="/food" className="block px-2 py-1 hover:bg-blue-600 rounded">Food & Dining</Link>
            <Link href="/fashion" className="block px-2 py-1 hover:bg-blue-600 rounded">Fashion</Link>
            <Link href="/home" className="block px-2 py-1 hover:bg-blue-600 rounded">Home & Living</Link>
            <Link href="/fitness" className="block px-2 py-1 hover:bg-blue-600 rounded">Fitness</Link>
            <Link href="/wellness" className="block px-2 py-1 hover:bg-blue-600 rounded">Wellness</Link>
          </div>

          {/* Column 3: Video Games */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Video Games</h3>
            <Link href="/playstation" className="block px-2 py-1 hover:bg-blue-600 rounded">PlayStation</Link>
            <Link href="/xbox" className="block px-2 py-1 hover:bg-blue-600 rounded">Xbox</Link>
            <Link href="/nintendo" className="block px-2 py-1 hover:bg-blue-600 rounded">Nintendo</Link>
            <Link href="/pcgaming" className="block px-2 py-1 hover:bg-blue-600 rounded">PC Gaming</Link>
            <Link href="/mobilegaming" className="block px-2 py-1 hover:bg-blue-600 rounded">Mobile Gaming</Link>
          </div>

          {/* Column 4: Entertainment */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Entertainment</h3>
            <Link href="/movies" className="block px-2 py-1 hover:bg-blue-600 rounded">Movies</Link>
            <Link href="/music" className="block px-2 py-1 hover:bg-blue-600 rounded">Music</Link>
            <Link href="/tv" className="block px-2 py-1 hover:bg-blue-600 rounded">TV Shows</Link>
            <Link href="/celebrity" className="block px-2 py-1 hover:bg-blue-600 rounded">Celebrity News</Link>
            <Link href="/arts" className="block px-2 py-1 hover:bg-blue-600 rounded">Arts & Culture</Link>
          </div>

          {/* Column 5: Sports */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Sports</h3>
            <Link href="/nfl" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">NFL</Link>
            <Link href="/mlb" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">MLB</Link>
            <Link href="/nba" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">NBA</Link>
            <Link href="/soccer" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">Soccer</Link>
            <Link href="/nhl" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">NHL</Link>
            <Link href="/golf" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">Golf</Link>
            <Link href="/tennis" className="block px-2 py-1 uppercase hover:bg-blue-600 rounded">Tennis</Link>
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