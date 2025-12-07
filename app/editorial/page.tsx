'use client'
import { useState } from "react"
import { Users, Shield, Eye, BookOpen, Scale, CheckCircle, Mail, Pen } from "lucide-react"
import Link from "next/link"
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Editorial() {
const boardMembers = [
{
name: "Sarah Mitchell",
title: "Editor-in-Chief",
bio: "Sarah leads iTruth News with over 20 years of experience at major national publications. A Pulitzer Prize finalist, she's committed to rigorous, independent journalism that serves the public interest.",
expertise: ["Investigative Reporting", "Editorial Strategy", "Newsroom Leadership"]
},
{
name: "James Chen",
title: "Managing Editor",
bio: "James oversees daily editorial operations and our investigative unit. His work on government accountability has earned multiple national journalism awards.",
expertise: ["Investigative Journalism", "Government Affairs", "Editorial Management"]
},
{
name: "Maria Rodriguez",
title: "Executive Editor, Opinion",
bio: "Maria shapes our opinion section, ensuring diverse perspectives and thoughtful commentary. Previously a columnist at leading newspapers for 15 years.",
expertise: ["Opinion Journalism", "Political Commentary", "Editorial Writing"]
},
{
name: "Dr. Robert Thompson",
title: "Senior Editor, Standards",
bio: "Robert ensures our journalism meets the highest ethical standards. Former journalism professor and author of three books on media ethics.",
expertise: ["Journalism Ethics", "Fact-Checking", "Editorial Standards"]
},
{
name: "Lisa Park",
title: "Deputy Managing Editor",
bio: "Lisa coordinates coverage across all sections and leads our data journalism initiatives. Award-winning reporter with expertise in visual storytelling.",
expertise: ["Data Journalism", "Multimedia Storytelling", "Coverage Coordination"]
},
{
name: "Michael O'Brien",
title: "International Editor",
bio: "Michael directs our global coverage from bureaus around the world. Former foreign correspondent with 18 years of experience covering international affairs.",
expertise: ["International Affairs", "Foreign Correspondence", "Global Strategy"]
}
];

const editorialPrinciples = [
{
icon: <Shield className="w-8 h-8" />,
title: "Independence",
description: "Our editorial decisions are made solely by journalists, free from influence by advertisers, donors, or political interests. We're accountable only to our readers and the truth."
},
{
icon: <CheckCircle className="w-8 h-8" />,
title: "Accuracy First",
description: "We verify facts through multiple sources, consult experts, and maintain rigorous fact-checking processes. When we make errors, we correct them promptly and transparently."
},
{
icon: <Scale className="w-8 h-8" />,
title: "Fairness & Balance",
description: "We present diverse viewpoints fairly, seek out voices that are often underrepresented, and distinguish clearly between news reporting and opinion content."
},
{
icon: <Eye className="w-8 h-8" />,
title: "Transparency",
description: "We explain our reporting methods, disclose conflicts of interest, and make our editorial standards public. Our readers deserve to understand how we work."
},
{
icon: <Users className="w-8 h-8" />,
title: "Public Service",
description: "We focus on stories that matter to people's lives and hold power accountable. Our mission is to serve the public interest, not clicks or controversy."
},
{
icon: <BookOpen className="w-8 h-8" />,
title: "Context & Depth",
description: "We provide the context readers need to understand complex issues, going beyond breaking news to explain what it means and why it matters."
}
];

const editorialProcess = [
{
step: "1",
title: "Story Selection",
description: "Our editorial board meets daily to identify stories that serve the public interest, considering news value, impact, and reader needs."
},
{
step: "2",
title: "Reporting & Research",
description: "Reporters gather information through interviews, documents, and on-the-ground reporting, verifying facts with multiple independent sources."
},
{
step: "3",
title: "Editorial Review",
description: "Editors review stories for accuracy, fairness, clarity, and adherence to our standards. Major investigations undergo additional scrutiny."
},
{
step: "4",
title: "Fact-Checking",
description: "Our dedicated fact-checking team verifies all factual claims, sources, and data before publication."
},
{
step: "5",
title: "Legal Review",
description: "Stories involving sensitive legal issues are reviewed by our legal team to ensure responsible reporting."
},
{
step: "6",
title: "Publication & Accountability",
description: "After publication, we monitor feedback, make corrections when needed, and engage with reader concerns."
}
];

const recentEditorials = [
{
date: "December 5, 2024",
title: "The Case for Climate Action: Why Delay Is No Longer an Option",
excerpt: "As global temperatures continue to rise, the urgency of comprehensive climate policy has never been clearer.",
link: "/opinion/editorials/climate-action"
},
{
date: "December 1, 2024",
title: "Protecting Democracy Requires More Than Elections",
excerpt: "Free and fair elections are essential, but democratic institutions need constant vigilance and support.",
link: "/opinion/editorials/democracy"
},
{
date: "November 28, 2024",
title: "The Future of Work: Balancing Innovation with Worker Rights",
excerpt: "As technology transforms the workplace, we must ensure that progress doesn't come at workers' expense.",
link: "/opinion/editorials/future-work"
}
];

return (
<>
<Navbar/>
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16 md:py-24">
<div className="max-w-4xl mx-auto text-center">
<Pen className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-6xl font-bold mb-6">
Editorial Board
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-8">
Meet the journalists who guide our editorial vision and uphold our standards
</p>
<div className="flex flex-wrap justify-center gap-4">
<Link 
href="/ethics-policy" 
className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
Our Standards
</Link>
<a 
href="#contact" 
className="px-8 py-4 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors border-2 border-blue-500">
Contact Editorial
</a>
</div>
</div>
</div>
</div>

{/* Mission Statement */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
Our Editorial Mission
</h2>
<div className="prose prose-lg max-w-none">
<p className="text-xl text-gray-700 leading-relaxed mb-6">
The iTruth News Editorial Board is committed to producing journalism that serves the public 
interest through rigorous reporting, thoughtful analysis, and unwavering commitment to truth. 
We believe that an informed citizenry is essential to a healthy democracy.
</p>
<p className="text-xl text-gray-700 leading-relaxed mb-6">
Our newsroom operates with complete independence from our business operations. Editorial 
decisions are made solely by journalists based on news value, public interest, and journalistic 
merit—never by advertisers, donors, or outside interests.
</p>
<p className="text-xl text-gray-700 leading-relaxed">
We hold ourselves accountable to the highest standards of accuracy, fairness, and transparency. 
When we make mistakes, we correct them promptly. When we face difficult ethical questions, 
we confront them openly and explain our reasoning to readers.
</p>
</div>
</div>
</div>
</div>

{/* Editorial Principles */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-6xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
Our Editorial Principles
</h2>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
{editorialPrinciples.map((principle, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
<div className="text-blue-900 mb-4">
{principle.icon}
</div>
<h3 className="text-xl font-bold text-gray-900 mb-3">
{principle.title}
</h3>
<p className="text-gray-600">
{principle.description}
</p>
</div>
))}
</div>
</div>
</div>
</div>

{/* Editorial Board Members */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-6xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
Editorial Board Members
</h2>
<p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
Our editorial leaders bring decades of journalism experience and unwavering commitment to excellence
</p>
<div className="grid md:grid-cols-2 gap-8">
{boardMembers.map((member, index) => (
<div key={index} className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-start mb-4">
<div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4 shrink-0">
<Users className="w-8 h-8 text-white" />
</div>
<div>
<h3 className="text-xl font-bold text-gray-900 mb-1">
{member.name}
</h3>
<p className="text-blue-600 font-semibold">
{member.title}
</p>
</div>
</div>
<p className="text-gray-700 mb-4">
{member.bio}
</p>
<div className="flex flex-wrap gap-2">
{member.expertise.map((skill, idx) => (
<span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
{skill}
</span>
))}
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Editorial Process */}
<div className="bg-blue-50 py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
Our Editorial Process
</h2>
<p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
How we decide what to cover and ensure accuracy in our reporting
</p>
<div className="space-y-6">
{editorialProcess.map((item, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex items-start">
<div className="shrink-0 w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
{item.step}
</div>
<div className="flex-1">
<h3 className="text-xl font-bold text-gray-900 mb-2">
{item.title}
</h3>
<p className="text-gray-600">
{item.description}
</p>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Recent Editorials */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
Recent Editorial Board Pieces
</h2>
<p className="text-gray-600 mb-8 text-center">
Our editorial board's latest perspectives on major issues
</p>
<div className="space-y-6">
{recentEditorials.map((editorial, index) => (
<div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
<p className="text-sm text-gray-600 mb-2">{editorial.date}</p>
<h3 className="text-2xl font-bold text-gray-900 mb-3">
{editorial.title}
</h3>
<p className="text-gray-700 mb-4">
{editorial.excerpt}
</p>
<Link 
href={editorial.link}
className="text-blue-600 hover:text-blue-800 font-semibold">
Read Full Editorial →
</Link>
</div>
))}
</div>
<div className="text-center mt-8">
<Link 
href="/opinion/editorials"
className="inline-block px-8 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors">
View All Editorials
</Link>
</div>
</div>
</div>
</div>

{/* Accountability */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
Accountability & Corrections
</h2>
<div className="bg-white rounded-lg shadow-md p-8">
<div className="prose prose-lg max-w-none">
<p className="text-gray-700 mb-4">
We take our responsibility to readers seriously. When we make errors in our reporting, 
we correct them promptly and transparently. All corrections are clearly labeled and 
include an explanation of what was wrong and why.
</p>
<p className="text-gray-700 mb-4">
If you believe we've made an error in our reporting, please contact our Standards 
Editor with details including the article URL, the error you've identified, and the 
correct information with supporting evidence.
</p>
<p className="text-gray-700 mb-6">
We welcome feedback from readers about our coverage. Your input helps us improve 
and ensures we remain accountable to the communities we serve.
</p>
<div className="flex flex-wrap gap-4">
<Link 
href="/corrections"
className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors">
View Corrections
</Link>
<a 
href="mailto:corrections@itruthnews.com"
className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition-colors">
Report an Error
</a>
</div>
</div>
</div>
</div>
</div>
</div>

{/* Contact Editorial */}
<div id="contact" className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl md:text-4xl font-bold mb-4">
Contact the Editorial Board
</h2>
<p className="text-xl text-blue-100 mb-8">
We welcome reader feedback, story tips, and questions about our editorial process
</p>
<div className="grid md:grid-cols-3 gap-6 mb-8">
<div className="bg-blue-800 rounded-lg p-6">
<h3 className="font-bold mb-2">General Editorial</h3>
<a href="mailto:editorial@itruthnews.com" className="text-blue-200 hover:text-white">
editorial@itruthnews.com
</a>
</div>
<div className="bg-blue-800 rounded-lg p-6">
<h3 className="font-bold mb-2">Corrections</h3>
<a href="mailto:corrections@itruthnews.com" className="text-blue-200 hover:text-white">
corrections@itruthnews.com
</a>
</div>
<div className="bg-blue-800 rounded-lg p-6">
<h3 className="font-bold mb-2">Story Tips</h3>
<a href="mailto:tips@itruthnews.com" className="text-blue-200 hover:text-white">
tips@itruthnews.com
</a>
</div>
</div>
<Link 
href="/contact" 
className="inline-block px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
Contact Form
</Link>
</div>
</div>
</div>

{/* Related Links */}
{/* Equal Opportunity Statement */}
<div className="bg-gray-100 py-8">
<div className="container mx-auto px-4">
<p className="text-center text-gray-600 text-sm max-w-3xl mx-auto">
iTruth News is an equal opportunity employer. We celebrate diversity and are committed to creating 
an inclusive environment for all employees. All qualified applicants will receive consideration for 
employment without regard to race, color, religion, gender, gender identity or expression, sexual 
orientation, national origin, genetics, disability, age, or veteran status.
</p>
</div>
</div>
</div>
<Footer/>
</>
);
}