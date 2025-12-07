import React from 'react'
import { Newspaper, Download, Mail, Award, TrendingUp, Users, Calendar, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Press() {
const pressReleases = [
{
date: "December 1, 2024",
title: "iTruth News Surpasses 5 Million Monthly Readers",
excerpt: "Independent news platform reaches major milestone in audience growth, reflecting growing demand for quality journalism.",
link: "#"
},
{
date: "November 15, 2024",
title: "iTruth News Wins Regional Journalism Excellence Award",
excerpt: "Our investigative series on climate policy recognized for outstanding reporting and impact.",
link: "#"
},
{
date: "October 28, 2024",
title: "iTruth News Launches Enhanced Mobile App Experience",
excerpt: "New features include personalized news feeds, offline reading, and breaking news notifications.",
link: "#"
},
{
date: "September 10, 2024",
title: "iTruth News Expands International Coverage with New Bureaus",
excerpt: "Opening offices in London and Singapore to strengthen global reporting capabilities.",
link: "#"
}
];

const awards = [
{
year: "2024",
title: "Regional Journalism Excellence Award",
category: "Investigative Reporting"
},
{
year: "2024",
title: "Digital Innovation in Media",
category: "Platform Design"
},
{
year: "2023",
title: "Best New Media Startup",
category: "Industry Recognition"
},
{
year: "2023",
title: "Public Service Journalism Award",
category: "Community Impact"
}
];

const keyStats = [
{ icon: <Users className="w-8 h-8" />, value: "5M+", label: "Monthly Readers" },
{ icon: <TrendingUp className="w-8 h-8" />, value: "180+", label: "Countries" },
{ icon: <Award className="w-8 h-8" />, value: "15+", label: "Awards Won" },
{ icon: <FileText className="w-8 h-8" />, value: "100+", label: "Journalists" }
];

const mediaAssets = [
{
icon: <Download className="w-6 h-6" />,
title: "Logo Package",
description: "High-resolution logos in multiple formats (PNG, SVG, EPS)",
size: "2.4 MB",
link: "#"
},
{
icon: <Download className="w-6 h-6" />,
title: "Brand Guidelines",
description: "Complete style guide with colors, typography, and usage rules",
size: "1.8 MB",
link: "#"
},
{
icon: <Download className="w-6 h-6" />,
title: "Executive Photos",
description: "High-resolution headshots of leadership team",
size: "5.2 MB",
link: "#"
},
{
icon: <Download className="w-6 h-6" />,
title: "Company Fact Sheet",
description: "Key statistics, milestones, and company information",
size: "450 KB",
link: "#"
}
];

const leadership = [
{
name: "Sarah Mitchell",
title: "Editor-in-Chief",
bio: "Former senior editor at major publications with 20+ years in journalism"
},
{
name: "James Chen",
title: "Managing Editor",
bio: "Pulitzer Prize finalist, specializing in investigative reporting"
},
{
name: "David Kim",
title: "Chief Technology Officer",
bio: "Pioneer in digital journalism and news platform innovation"
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
<Newspaper className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-6xl font-bold mb-6">
Press & Media Center
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-8">
Resources for journalists, media partners, and press inquiries
</p>
<div className="flex flex-wrap justify-center gap-4">
<a 
href="#contact" 
className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
Contact Press Team
</a>
<a 
href="#downloads" 
className="px-8 py-4 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors border-2 border-blue-500">
Download Media Kit
</a>
</div>
</div>
</div>
</div>

{/* Quick Stats */}
<div className="bg-white py-16 border-b">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
iTruth News at a Glance
</h2>
<div className="grid md:grid-cols-4 gap-8">
{keyStats.map((stat, index) => (
<div key={index} className="text-center">
<div className="text-blue-900 flex justify-center mb-4">
{stat.icon}
</div>
<div className="text-4xl font-bold text-gray-900 mb-2">
{stat.value}
</div>
<div className="text-gray-600">
{stat.label}
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* About iTruth News */}
<div className="bg-gray-50 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
About iTruth News
</h2>
<div className="bg-white rounded-lg shadow-md p-8">
<p className="text-lg text-gray-700 leading-relaxed mb-4">
iTruth News is an independent digital news organization committed to delivering fact-based, 
rigorous journalism that serves the public interest. Founded in 2020, we've grown to reach 
over 5 million monthly readers across 180+ countries.
</p>
<p className="text-lg text-gray-700 leading-relaxed mb-4">
Our newsroom operates with complete independence from political parties, corporate interests, 
and advertisers. As a reader-funded publication, our loyalty is to our audience and to the truth.
</p>
<p className="text-lg text-gray-700 leading-relaxed">
We cover national and international news, politics, economy, technology, climate, culture, and more, 
with a focus on investigative reporting and in-depth analysis that helps readers understand the 
world around them.
</p>
</div>
</div>
</div>
</div>

{/* Press Releases */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
Recent Press Releases
</h2>
<div className="space-y-6">
{pressReleases.map((release, index) => (
<div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
<div className="flex items-start justify-between gap-4">
<div className="flex-1">
<div className="flex items-center text-sm text-gray-600 mb-2">
<Calendar className="w-4 h-4 mr-2" />
{release.date}
</div>
<h3 className="text-xl font-bold text-gray-900 mb-2">
{release.title}
</h3>
<p className="text-gray-600 mb-3">
{release.excerpt}
</p>
<a 
href={release.link}
className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
Read Full Release
<ExternalLink className="w-4 h-4 ml-1" />
</a>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Awards & Recognition */}
<div className="bg-blue-50 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
Awards & Recognition
</h2>
<div className="grid md:grid-cols-2 gap-6">
{awards.map((award, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<div className="flex items-start">
<Award className="w-6 h-6 text-blue-900 mr-3 hrink-0 mt-1" />
<div>
<p className="text-sm text-gray-600 mb-1">{award.year}</p>
<h3 className="text-lg font-bold text-gray-900 mb-1">
{award.title}
</h3>
<p className="text-sm text-gray-600">{award.category}</p>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Media Assets */}
<div id="downloads" className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
Media Assets & Downloads
</h2>
<p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
Download our logos, photos, and brand materials for use in your coverage
</p>
<div className="grid md:grid-cols-2 gap-6">
{mediaAssets.map((asset, index) => (
<div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
<div className="flex items-start justify-between">
<div className="flex-1">
<div className="flex items-start mb-3">
<div className="text-blue-900 mr-3 mt-1">
{asset.icon}
</div>
<div>
<h3 className="text-lg font-bold text-gray-900 mb-1">
{asset.title}
</h3>
<p className="text-sm text-gray-600 mb-2">
{asset.description}
</p>
<p className="text-xs text-gray-500">
File size: {asset.size}
</p>
</div>
</div>
</div>
<a
href={asset.link}
className="shrink-0 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm">
Download
</a>
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Leadership */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
Available for Interviews
</h2>
<p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
Our leadership team is available for media interviews and speaking engagements
</p>
<div className="grid md:grid-cols-3 gap-8">
{leadership.map((leader, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
<div className="w-24 h-24 bg-linear-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
<Users className="w-12 h-12 text-white" />
</div>
<h3 className="text-xl font-bold text-gray-900 mb-1">
{leader.name}
</h3>
<p className="text-blue-600 font-semibold mb-3">
{leader.title}
</p>
<p className="text-gray-600 text-sm">
{leader.bio}
</p>
</div>
))}
</div>
</div>
</div>
</div>

{/* Press Contact */}
<div id="contact" className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl md:text-4xl font-bold mb-4">
Press Inquiries
</h2>
<p className="text-xl text-blue-100 mb-8">
For media inquiries, interview requests, or press information
</p>
<div className="bg-blue-800 rounded-lg p-8 mb-8">
<div className="space-y-4">
<div>
<p className="text-blue-200 text-sm mb-2">Press Contact</p>
<p className="font-bold text-lg mb-1">Jennifer Adams</p>
<p className="text-blue-100 text-sm mb-3">Director of Communications</p>
<a href="mailto:press@itruthnews.com" className="text-xl font-bold hover:text-blue-200">
press@itruthnews.com
</a>
</div>
<div className="pt-4 border-t border-blue-700">
<p className="text-blue-200 text-sm mb-2">Phone</p>
<a href="tel:+12125550145" className="text-xl font-bold hover:text-blue-200">
(212) 555-0145
</a>
</div>
</div>
</div>
<p className="text-blue-100 text-sm">
We typically respond to press inquiries within 24 hours during business days
</p>
</div>
</div>
</div>

{/* Social Media */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center">
<h3 className="text-2xl font-bold text-gray-900 mb-4">
Follow Our Newsroom
</h3>
<p className="text-gray-600 mb-6">
Stay updated with our latest coverage and announcements
</p>
<div className="flex justify-center space-x-6">
{/* X Icon */}
<Link href="#" className="text-black ">
<svg
className="w-8 h-8"
fill="currentColor"
viewBox="0 0 24 24"
>
<path d="M18.146 2H21.5l-7.52 8.59L23.5 22h-7.09l-5.03-6.48L5.77 22H2.5l8.06-9.2L1.5 2h7.2l4.57 5.89L18.146 2z" />
</svg>
</Link>
{/* X Icon */}

{/* Facebook Icon */}
<Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
</Link>
{/* Facebook Icon */}

{/* LinkedIn */}
<Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
</Link>
{/* LinkedIn */}

</div>
</div>
</div>
</div>
</div>
<Footer/>
</>
);
}