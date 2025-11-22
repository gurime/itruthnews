"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);


if (isLoading) {
return (
<nav className="w-full bg-red-500 text-white shadow-md">
<div className="container mx-auto p-4">
<div className="hidden md:flex md:items-center md:justify-between md:gap-6">
<div className="w-48 h-12 bg-red-400 animate-pulse rounded"></div>
<div className="flex-1 max-w-md h-10 bg-red-400 animate-pulse rounded-full"></div>
<div className="flex space-x-6">
{[...Array(5)].map((_, i) => (
<div key={i} className="w-20 h-6 bg-red-400 animate-pulse rounded"></div>
))}
</div>
</div>
<div className="md:hidden flex items-center justify-between">
<div className="w-32 h-10 bg-red-400 animate-pulse rounded"></div>
<div className="w-8 h-8 bg-red-400 animate-pulse rounded"></div>
</div>
</div>
</nav>
);
}

return (
<nav className="w-full bg-red-500 text-white shadow-md">
<div className="container mx-auto p-4">
{/* Desktop Layout */}
<div className="hidden md:flex md:items-center md:justify-between md:gap-6">
<Image src="/images/it.png" alt="Truth News Logo" width={200} height={200} />          
<div className="shrink-0">
</div>

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
<Link href="/politics" className="hover:underline whitespace-nowrap">Politics</Link>
<Link href="/technology" className="hover:underline whitespace-nowrap">Technology</Link>
<Link href="/sports" className="hover:underline whitespace-nowrap">Sports</Link>
<Link href="/music" className="hover:underline whitespace-nowrap">Music</Link>
<Link href="/entertainment" className="hover:underline whitespace-nowrap">Entertainment</Link>
</div>
</div>

{/* Mobile Layout */}
<div className="md:hidden">
{/* Top Row: Logo + Hamburger */}
<div className="flex items-center justify-between">
<div className="shrink-0">
<Image src="/images/it.png" alt="Truth News Logo" width={200} height={200} />            </div>
<button
className="text-white focus:outline-none text-2xl cursor-pointer"
onClick={() => setMenuOpen(!menuOpen)}
aria-label="Toggle menu"
>
{menuOpen ? "✕" : "☰"}
</button>
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
className="rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black shadow-sm"
                />
<button
className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-1 transition-colors"
>
🔍
</button>
</div>

{/* Navigation Links */}
<div className="flex flex-col space-y-3 text-sm font-medium pb-2">
<Link href="/politics" className="hover:underline py-2">Politics</Link>
<Link href="/technology" className="hover:underline py-2">Technology</Link>
<Link href="/sports" className="hover:underline py-2">Sports</Link>
<Link href="/music" className="hover:underline py-2">Music</Link>
<Link href="/entertainment" className="hover:underline py-2">Entertainment</Link>
</div>
</div>
)}
</div>
</div>
</nav>
);
}