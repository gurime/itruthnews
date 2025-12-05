'use client';

import Image from "next/image";
import Link from "next/link";
import { Mail, Users, Award, Globe, Shield, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";

export default function AboutPage() {
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
name: "Maria Rodriguez",
title: "Executive Editor, Opinion",
bio: "Leading voice in political commentary and editorial strategy"
},
{
name: "David Kim",
title: "Chief Technology Officer",
bio: "Pioneer in digital journalism and news platform innovation"
}
];

const values = [
{
icon: <Shield className="w-8 h-8" />,
title: "Truth & Accuracy",
description: "We hold ourselves to the highest standards of fact-checking and verification"
},
{
icon: <Users className="w-8 h-8" />,
title: "Independence",
description: "Reader-funded journalism free from corporate or political influence"
},
{
icon: <Globe className="w-8 h-8" />,
title: "Global Perspective",
description: "Comprehensive coverage that connects local stories to global trends"
},
{
icon: <Award className="w-8 h-8" />,
title: "Excellence",
description: "Award-winning reporting from experienced journalists you can trust"
}
];

const milestones = [
{ year: "2020", event: "iTruth News founded with mission to deliver independent journalism" },
{ year: "2021", event: "Reached 1 million monthly readers, expanded international coverage" },
{ year: "2022", event: "Launched investigative unit, won regional journalism awards" },
{ year: "2023", event: "Achieved reader-funded sustainability, opened bureaus in 5 countries" },
{ year: "2024", event: "Surpassed 5 million monthly readers, launched premium membership" }
];

return (
<>

<div className="min-h-screen bg-gray-50">
{/* Hero Section */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16 md:py-24">
<div className="max-w-4xl mx-auto text-center">
<Link href="/" title="Home">
<Image 
width={250} 
height={60} 
src="/images/it_news.png" 
alt="iTruth News"
className="mx-auto mb-8"
/>
</Link>

<h1 className="text-4xl md:text-6xl font-bold mb-6">
Independent Journalism for a Complex World
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-8">
Reader-funded. Fiercely independent. Committed to truth.
</p>
<div className="flex flex-wrap justify-center gap-4">
<Link 
href="/membership" 
className="px-8 py-3 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors">
Support Our Work
</Link>
<Link 
href="/contact" 
className="px-8 py-3 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors border-2 border-blue-500">
Contact Us
</Link>
</div>
</div>
</div>
</div>

{/* Mission Statement */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
Our Mission
</h2>
<p className="text-xl text-gray-700 leading-relaxed mb-6">
iTruth News was founded on a simple principle: in an era of misinformation and partisan media, 
people deserve journalism that serves them—not advertisers, not political parties, not corporate interests.
</p>
<p className="text-xl text-gray-700 leading-relaxed mb-6">
We believe that a healthy democracy depends on an informed citizenry. That's why we're committed 
to delivering fact-based, rigorously reported journalism that helps you understand the world 
and make informed decisions.
</p>
<p className="text-xl text-gray-700 leading-relaxed">
As a reader-funded publication, our loyalty is to you. Every day, our team of experienced 
journalists works to deliver the stories that matter most—from breaking news to in-depth 
investigations, from local reporting to international coverage.
</p>
</div>
</div>
</div>

{/* Our Values */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
Our Values
</h2>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
{values.map((value, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-md">
<div className="text-blue-900 mb-4">
  {value.icon}
</div>
<h3 className="text-xl font-bold text-gray-900 mb-3">
  {value.title}
</h3>
<p className="text-gray-600">
  {value.description}
</p>
</div>
))}
</div>
</div>
</div>

{/* Stats Section */}
<div className="bg-blue-900 text-white py-16">
<div className="container mx-auto px-4">
<div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
<div>
<div className="text-4xl md:text-5xl font-bold mb-2">5M+</div>
<div className="text-blue-200">Monthly Readers</div>
</div>
<div>
<div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
<div className="text-blue-200">Journalists</div>
</div>
<div>
<div className="text-4xl md:text-5xl font-bold mb-2">15</div>
<div className="text-blue-200">Countries Covered</div>
</div>
<div>
<div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
<div className="text-blue-200">Supporting Members</div>
</div>
</div>
</div>
</div>

{/* Leadership Team */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
Leadership Team
</h2>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
{leadership.map((leader, index) => (
<div key={index} className="text-center">
<div className="w-32 h-32 bg-linear-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
  <Users className="w-16 h-16 text-white" />
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

{/* Timeline */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
Our Journey
</h2>
<div className="max-w-3xl mx-auto">
{milestones.map((milestone, index) => (
<div key={index} className="flex mb-8 last:mb-0">
<div className="shrink-0 w-24">
  <div className="text-2xl font-bold text-blue-900">
    {milestone.year}
  </div>
</div>
<div className="grow">
  <div className="bg-white p-4 rounded-lg shadow-md">
    <p className="text-gray-700">{milestone.event}</p>
  </div>
</div>
</div>
))}
</div>
</div>
</div>

{/* Standards & Ethics */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
Our Standards
</h2>
<div className="space-y-6">
<div className="border-l-4 border-blue-600 pl-6">
<h3 className="text-xl font-bold text-gray-900 mb-2">Editorial Independence</h3>
<p className="text-gray-700">
  Our newsroom operates independently from our business operations. Editorial decisions 
  are made solely by our journalists based on news value and public interest.
</p>
</div>
<div className="border-l-4 border-blue-600 pl-6">
<h3 className="text-xl font-bold text-gray-900 mb-2">Fact-Checking</h3>
<p className="text-gray-700">
  Every story undergoes rigorous fact-checking. We verify information through multiple 
  sources and clearly distinguish between news reporting and opinion content.
</p>
</div>
<div className="border-l-4 border-blue-600 pl-6">
<h3 className="text-xl font-bold text-gray-900 mb-2">Corrections Policy</h3>
<p className="text-gray-700">
  When we make mistakes, we correct them promptly and transparently. All corrections 
  are clearly marked and explained to our readers.
</p>
</div>
<div className="border-l-4 border-blue-600 pl-6">
<h3 className="text-xl font-bold text-gray-900 mb-2">Diversity & Inclusion</h3>
<p className="text-gray-700">
  We're committed to diverse voices in our newsroom and our coverage, ensuring we 
  represent and serve all communities.
</p>
</div>
</div>
<div className="text-center mt-10">
<Link 
href="/ethics-policy" 
className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline">
Read Our Full Ethics & Standards Policy →
</Link>
</div>
</div>
</div>
</div>

{/* Contact Section */}
<div className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
Get in Touch
</h2>
<div className="grid md:grid-cols-3 gap-8 text-center">
<div>
<Mail className="w-12 h-12 mx-auto mb-4" />
<h3 className="text-xl font-bold mb-2">General Inquiries</h3>
<Link href="mailto:contact@itruthnews.com" className="text-blue-200 hover:text-white">
  contact@itruthnews.com
</Link>
</div>
<div>
<TrendingUp className="w-12 h-12 mx-auto mb-4" />
<h3 className="text-xl font-bold mb-2">Tips & Story Ideas</h3>
<a href="mailto:tips@itruthnews.com" className="text-blue-200 hover:text-white">
  tips@itruthnews.com
</a>
</div>
<div>
<Users className="w-12 h-12 mx-auto mb-4" />
<h3 className="text-xl font-bold mb-2">Careers</h3>
<a href="mailto:careers@itruthnews.com" className="text-blue-200 hover:text-white">
  careers@itruthnews.com
</a>
</div>
</div>
<div className="text-center mt-12">
<Link 
href="/contact" 
className="inline-block px-8 py-3 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors">
Contact Form
</Link>
</div>
</div>
</div>
</div>

{/* Support CTA */}
<div className="bg-yellow-400 py-12">
<div className="container mx-auto px-4 text-center">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
Support Independent Journalism
</h2>
<p className="text-xl text-gray-800 mb-6 max-w-2xl mx-auto">
Join thousands of readers who power iTruth News. Your support keeps our journalism free from corporate influence.
</p>
<Link 
href="/membership" 
className="inline-block px-10 py-4 bg-blue-900 text-white rounded-full font-bold text-xl hover:bg-blue-800 transition-colors shadow-lg">
Become a Member
</Link>
</div>
</div>
</div>
<Footer/>
</>
);
}