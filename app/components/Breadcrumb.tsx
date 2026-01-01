import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
category?: string | null;
title: string;
}

// Shared link styles (outside component for cleanliness)
const linkBase =
"flex items-center whitespace-nowrap transition-colors hover:text-blue-600";

// Category → folder mapping
const categoryMap: Record<string, string> = {
economy: "economy",
editorials: "editorial",
politics: "politics",
climate: "climate",
crime: "crime",
asia: "world/asia",
"middle east": "world/middle-east",
africa: "world/africa",
europe: "world/europe",
americas: "world/americas",
smartphones: "technology/smartphones",
computing: "technology/computing",
internet: "technology/internet",
"silicon valley": "technology/silicon-valley",
reviews: "technology/reviews",
columnists: "opinion/columnist",
"guest voices": "opinion/guest-voices",
};

const getCategoryPath = (cat: string) => {
const normalized = cat.toLowerCase().trim();
return categoryMap[normalized] || normalized.replace(/\s+/g, "-");
};

export default function Breadcrumb({ category, title }: BreadcrumbProps) {
return (
<nav
className="flex items-center text-sm text-gray-600 mb-6 overflow-x-auto py-2 px-1"
aria-label="Breadcrumb"
>
{/* Home */}
<Link href="/" className={`${linkBase} group`} aria-label="Home">
<Home
size={16}
className="mr-1.5 transition-transform group-hover:scale-110"
/>
<span>Home</span>
</Link>

<ChevronRight size={14} className="mx-2 text-gray-400 shrink-0" />

{/* Category */}
{category && (
<>
<Link
href={`/${getCategoryPath(category)}`}
className={`${linkBase} capitalize hover:underline decoration-blue-600/30 underline-offset-4`}
>
{category}
</Link>

<ChevronRight
size={14}
className="mx-2 text-gray-400 shrink-0"
/>
</>
)}

{/* Current Article */}
<span
className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md"
aria-current="page"
>
{title}
</span>
</nav>
);
}
