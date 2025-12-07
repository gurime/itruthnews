'use client'
import { useState } from "react"
import { AlertCircle, Mail, Calendar, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Corrections() {
const [selectedMonth, setSelectedMonth] = useState("all");

const corrections = [
{
date: "December 5, 2024",
article: "Senate Passes Major Climate Legislation",
correction: "An earlier version of this article incorrectly stated the vote margin as 52-48. The correct vote was 51-49.",
articleUrl: "/politics/senate-climate-legislation",
month: "december"
},
{
date: "December 3, 2024",
article: "Tech Company Announces Layoffs",
correction: "This article misstated the number of affected employees. The company announced 2,500 layoffs, not 3,500 as originally reported.",
articleUrl: "/tech/company-layoffs",
month: "december"
},
{
date: "November 28, 2024",
article: "New Study on Renewable Energy Costs",
correction: "The article incorrectly identified the lead researcher. Dr. Jennifer Martinez led the study, not Dr. Jennifer Martin.",
articleUrl: "/climate/renewable-energy-study",
month: "november"
},
{
date: "November 22, 2024",
article: "Federal Reserve Interest Rate Decision",
correction: "An earlier version mischaracterized the Fed's statement. The Fed indicated rates would remain unchanged 'for now,' not 'indefinitely.'",
articleUrl: "/economy/fed-decision",
month: "november"
},
{
date: "November 15, 2024",
article: "Supreme Court Ruling on Education Policy",
correction: "The article incorrectly stated that the ruling was 6-3. The actual vote was 5-4.",
articleUrl: "/politics/supreme-court-education",
month: "november"
},
{
date: "October 30, 2024",
article: "International Trade Agreement Signed",
correction: "Due to an editing error, the article omitted Canada from the list of participating countries.",
articleUrl: "/world/trade-agreement",
month: "october"
},
{
date: "October 18, 2024",
article: "City Council Budget Vote",
correction: "The article incorrectly stated the budget amount as $2.4 billion. The correct amount is $2.4 million.",
articleUrl: "/local/council-budget",
month: "october"
},
{
date: "October 5, 2024",
article: "Sports: Championship Game Results",
correction: "An earlier version incorrectly identified the winning team's coach. The correct coach is Mike Thompson, not Mark Thompson.",
articleUrl: "/sports/championship-game",
month: "october"
}
];

const months = [
{ value: "all", label: "All Corrections" },
{ value: "december", label: "December 2024" },
{ value: "november", label: "November 2024" },
{ value: "october", label: "October 2024" }
];

const filteredCorrections = selectedMonth === "all" 
? corrections 
: corrections.filter(c => c.month === selectedMonth);

return (
    <>
    <Navbar/>
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16 md:py-20">
<div className="max-w-4xl mx-auto text-center">
<AlertCircle className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-6">
Corrections
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-8">
When we make errors, we correct them promptly and transparently
</p>
</div>
</div>
</div>

{/* Policy Statement */}
<div className="bg-white py-12 border-b">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
<div className="flex items-start">
<Info className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-1" />
<div>
<h2 className="text-xl font-bold text-gray-900 mb-3">
Our Correction Policy
</h2>
<p className="text-gray-700 mb-3">
At iTruth News, we strive for accuracy in all our reporting. When we make mistakes, 
we correct them as quickly as possible and acknowledge them clearly. This page lists 
all corrections made to our published articles.
</p>
<p className="text-gray-700 mb-3">
Corrections are published at the top of the original article and on this page. 
Minor typos and style changes are corrected directly without a formal correction notice. 
Substantive errors that affect the accuracy or meaning of an article are noted here.
</p>
<p className="text-gray-700">
If you believe we've made an error in our reporting, please contact us at{" "}
<a href="mailto:corrections@itruthnews.com" className="text-blue-600 hover:text-blue-800 font-semibold">
corrections@itruthnews.com
</a>
</p>
</div>
</div>
</div>
</div>
</div>
</div>

{/* Corrections List */}
<div className="py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">

{/* Filter by Month */}
<div className="mb-8">
<label className="block text-sm font-semibold text-gray-700 mb-3">
Filter by Time Period
</label>
<div className="flex flex-wrap gap-2">
{months.map((month) => (
<button
key={month.value}
onClick={() => setSelectedMonth(month.value)}
className={`px-4 py-2 rounded-full font-semibold transition-colors ${
selectedMonth === month.value
? 'bg-blue-900 text-white'
: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
}`}>
{month.label}
</button>
))}
</div>
</div>

{/* Corrections */}
<div className="space-y-6">
{filteredCorrections.map((correction, index) => (
<div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
<div className="p-6">
<div className="flex items-start justify-between mb-4">
<div className="flex items-center text-sm text-gray-600">
<Calendar className="w-4 h-4 mr-2" />
{correction.date}
</div>
<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold uppercase">
Corrected
</span>
</div>

<h3 className="text-xl font-bold text-gray-900 mb-3">
{correction.article}
</h3>

<div className="bg-gray-50 border-l-4 border-red-500 p-4 mb-4">
<p className="text-sm font-semibold text-gray-700 mb-1">
Correction:
</p>
<p className="text-gray-800">
{correction.correction}
</p>
</div>

<Link 
href={correction.articleUrl}
className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold">
View Updated Article
<ExternalLink className="w-4 h-4 ml-1" />
</Link>
</div>
</div>
))}
</div>

{filteredCorrections.length === 0 && (
<div className="text-center py-12">
<AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
<p className="text-gray-600 text-lg">
No corrections for this time period.
</p>
</div>
)}
</div>
</div>
</div>

{/* How We Handle Errors */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
How We Handle Errors
</h2>
<div className="grid md:grid-cols-2 gap-6">
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">
When We Learn of an Error
</h3>
<p className="text-gray-600 mb-3">
Whether the error is brought to our attention by readers, sources, or discovered 
internally, we investigate immediately.
</p>
<p className="text-gray-600">
Our Standards Editor reviews the claim and consults with the reporter and editors 
involved to verify the facts.
</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">
Making the Correction
</h3>
<p className="text-gray-600 mb-3">
If we confirm an error, we correct the article immediately and add a correction 
notice at the top clearly explaining what was wrong.
</p>
<p className="text-gray-600">
The correction is also published on this page with a link to the updated article.
</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">
Types of Corrections
</h3>
<p className="text-gray-600 mb-3">
<strong>Corrections:</strong> For factual errors that affect the meaning or accuracy 
of the article.
</p>
<p className="text-gray-600">
<strong>Clarifications:</strong> When something is unclear or potentially misleading, 
even if technically accurate.
</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">
What We Don't Correct Here
</h3>
<p className="text-gray-600 mb-3">
Minor typos, style inconsistencies, and formatting issues are fixed directly 
without a formal correction notice.
</p>
<p className="text-gray-600">
Only substantive errors that could affect reader understanding are listed here.
</p>
</div>
</div>
</div>
</div>
</div>

{/* Submit a Correction */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto">
<div className="bg-linear-to-br from-blue-900 to-blue-800 text-white rounded-lg shadow-xl p-8 md:p-12">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl font-bold mb-4 text-center">
Report an Error
</h2>
<p className="text-xl text-blue-100 mb-8 text-center">
If you've spotted an error in our reporting, please let us know
</p>

<div className="bg-blue-800 rounded-lg p-6 mb-6">
<h3 className="font-bold text-lg mb-3">What to Include:</h3>
<ul className="space-y-2 text-blue-100">
<li className="flex items-start">
<span className="mr-2">•</span>
<span>The URL or headline of the article</span>
</li>
<li className="flex items-start">
<span className="mr-2">•</span>
<span>What you believe is incorrect</span>
</li>
<li className="flex items-start">
<span className="mr-2">•</span>
<span>What you believe the correct information should be</span>
</li>
<li className="flex items-start">
<span className="mr-2">•</span>
<span>Any sources or evidence to support your claim</span>
</li>
</ul>
</div>

<div className="text-center">
<a 
href="mailto:corrections@itruthnews.com"
className="inline-block px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
Email corrections@itruthnews.com
</a>
</div>

<p className="text-blue-100 text-sm text-center mt-6">
We review all correction requests and respond within 48 hours
</p>
</div>
</div>
</div>
</div>

{/* Related Links */}
<div className="bg-gray-100 py-8">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center">
<p className="text-gray-600 mb-4 font-semibold">Learn More About Our Standards</p>
<div className="flex flex-wrap justify-center gap-6 text-sm">
<Link href="/ethics-policy" className="text-blue-600 hover:text-blue-800 font-semibold">
Ethics & Standards Policy
</Link>
<Link href="/editorial" className="text-blue-600 hover:text-blue-800 font-semibold">
Editorial Board
</Link>
<Link href="/about" className="text-blue-600 hover:text-blue-800 font-semibold">
About iTruth News
</Link>
<Link href="/contact" className="text-blue-600 hover:text-blue-800 font-semibold">
Contact Us
</Link>
</div>
</div>
</div>
</div>
</div>
<Footer/>
</>
);
}