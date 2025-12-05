"use client"

import { useState } from "react";
import { Target, Users, TrendingUp, Globe, BarChart3, Zap, CheckCircle, Mail, Download, Eye, MousePointerClick, Smartphone, Award, X } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import supabase from "../supabase/supabase";
import toast, { Toaster } from "react-hot-toast";



interface ScheduleCallModalProps {
isOpen: boolean;
onClose: () => void;
onSubmit: (data: { name: string; email: string; date: string; time: string; notes: string }) => void;
}

const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({ isOpen, onClose, onSubmit }) => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [date, setDate] = useState('');
const [time, setTime] = useState('');
const [notes, setNotes] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState('');

if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setIsSubmitting(true);
setSubmitError('');

// Basic form validation
if (!name || !email || !date || !time) {
setSubmitError('Please fill in Name, Email, Date, and Time.');
setIsSubmitting(false);
return;
}

try {
const { data, error } = await supabase
.from('schedule_call')
.insert([
{
name: name,
email: email,
scheduled_date: date,
scheduled_time: time,
notes: notes || null
}
])
.select();

if (error) {
throw error;
}

onSubmit({ name, email, date, time, notes });
toast.success('Call scheduled successfully! We will contact you soon.');
// Clear form
setName('');
setEmail('');
setDate('');
setTime('');
setNotes('');
onClose();

} catch (error) {
console.error('Error scheduling call:', error);
setSubmitError('An error occurred. Please try again later.');
} finally {
setIsSubmitting(false);
}
};

return (
<div className="fixed inset-0 bg-blue-800  bg-opacity-50 z-50 flex justify-center items-center p-4">
<div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
<div className="p-6 border-b flex justify-between items-center">
<h2 className="text-2xl font-bold text-gray-900">Schedule a Call</h2>
<button onClick={onClose} className="text-gray-400 hover:text-gray-600">
<X className="w-6 h-6" />
</button>
</div>
<form onSubmit={handleSubmit} className="p-6">
<div className="space-y-4">
<div>
<label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
<input 
type="text" 
id="name" 
value={name}
onChange={(e) => setName(e.target.value)}
required
className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
/>
</div>
<div>
<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
<input 
type="email" 
id="email" 
value={email}
onChange={(e) => setEmail(e.target.value)}
required
className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
<input 
type="date" 
id="date" 
value={date}
onChange={(e) => setDate(e.target.value)}
required
className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
/>
</div>
<div>
<label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
<input 
type="time" 
id="time" 
value={time}
onChange={(e) => setTime(e.target.value)}
required
className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
/>
</div>
</div>
<div>
<label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
<textarea
id="notes" 
rows={3}
value={notes}
onChange={(e) => setNotes(e.target.value)}
className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
></textarea>
</div>
</div>
{submitError && (
<p className="mt-4 text-sm text-red-600 text-center">{submitError}</p>
)}
<div className="mt-6 flex justify-end space-x-3">
<button
type="button"
onClick={onClose}
className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
disabled={isSubmitting}
>
Cancel
</button>
<button
type="submit"
className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800 disabled:bg-blue-400 cursor-pointer"
disabled={isSubmitting}
>
{isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
</button>
</div>
</form>
</div>
</div>
);
};
// --- END: New ScheduleCallModal Component ---


export default function Advertise() {
const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
// --- START: New State for Modal ---
const [isModalOpen, setIsModalOpen] = useState(false);
// --- END: New State for Modal ---

const stats = [
{ icon: <Users className="w-8 h-8" />, value: "5M+", label: "Monthly Readers" },
{ icon: <Eye className="w-8 h-8" />, value: "50M+", label: "Monthly Page Views" },
{ icon: <Globe className="w-8 h-8" />, value: "180+", label: "Countries Reached" },
{ icon: <TrendingUp className="w-8 h-8" />, value: "4.2min", label: "Avg. Time on Site" }
];

const audience = [
{ category: "Age 25-54", percentage: 68, description: "Prime decision-makers and professionals" },
{ category: "College Educated", percentage: 72, description: "Highly educated, informed readers" },
{ category: "HHI $75K+", percentage: 58, description: "Above-average household income" },
{ category: "Mobile Users", percentage: 65, description: "Access news on-the-go" }
];

const adFormats = [
{
icon: <Target className="w-8 h-8" />,
title: "Display Advertising",
description: "Premium banner placements across our site with high visibility and engagement.",
formats: ["Leaderboard (728x90)", "Medium Rectangle (300x250)", "Large Rectangle (336x280)", "Skyscraper (160x600)"],
cpm: "$15-25 CPM"
},
{
icon: <Zap className="w-8 h-8" />,
title: "Native Advertising",
description: "Seamlessly integrated sponsored content that matches our editorial style and engages readers.",
formats: ["Sponsored Articles", "In-Feed Content", "Recommendation Widgets"],
cpm: "$20-35 CPM"
},
{
icon: <Smartphone className="w-8 h-8" />,
title: "Mobile Advertising",
description: "Optimized ad experiences for our mobile-first audience with high engagement rates.",
formats: ["Mobile Banners", "Interstitials", "In-App Ads", "Mobile Native"],
cpm: "$12-22 CPM"
},
{
icon: <Mail className="w-8 h-8" />,
title: "Newsletter Sponsorship",
description: "Reach our highly engaged subscribers directly in their inbox with targeted messaging.",
formats: ["Header Placement", "Mid-Newsletter", "Dedicated Send"],
cpm: "$25-40 CPM"
},
{
icon: <BarChart3 className="w-8 h-8" />,
title: "Video Advertising",
description: "Pre-roll, mid-roll, and display video ads with completion rates above industry average.",
formats: ["Pre-roll Video", "Mid-roll Video", "Outstream Video"],
cpm: "$30-50 CPM"
},
{
icon: <Award className="w-8 h-8" />,
title: "Premium Sponsorships",
description: "Exclusive partnerships and custom campaigns tailored to your brand objectives.",
formats: ["Section Sponsorships", "Event Sponsorships", "Custom Content Series"],
cpm: "Custom Pricing"
}
];

const packages = [
{
name: "Starter",
price: "$5,000",
period: "/month",
description: "Perfect for testing the waters with iTruth News audience",
features: [
"500K display ad impressions",
"Standard banner placements",
"Basic audience targeting",
"Monthly performance report",
"Email support"
],
cta: "Get Started",
highlighted: false
},
{
name: "Professional",
price: "$15,000",
period: "/month",
description: "Ideal for brands seeking significant reach and engagement",
features: [
"2M display ad impressions",
"Premium banner placements",
"Advanced audience targeting",
"1 native content piece/month",
"Newsletter sponsorship (50K subscribers)",
"Bi-weekly performance reports",
"Dedicated account manager",
"A/B testing support"
],
cta: "Most Popular",
highlighted: true
},
{
name: "Enterprise",
price: "Custom",
period: "",
description: "Comprehensive solutions for maximum impact and brand alignment",
features: [
"5M+ display ad impressions",
"Premium placements across all sections",
"Full audience targeting suite",
"4 native content pieces/month",
"Dedicated newsletter sends",
"Video advertising inclusion",
"Real-time reporting dashboard",
"Strategic planning sessions",
"Custom branded content series",
"Event sponsorship opportunities"
],
cta: "Contact Sales",
highlighted: false
}
];

const benefits = [
{
icon: <CheckCircle className="w-6 h-6" />,
title: "Brand-Safe Environment",
description: "Your ads appear alongside quality journalism in a trusted, moderated environment."
},
{
icon: <Target className="w-6 h-6" />,
title: "Precise Targeting",
description: "Reach your ideal audience with demographic, geographic, and behavioral targeting."
},
{
icon: <TrendingUp className="w-6 h-6" />,
title: "Proven Performance",
description: "Average CTR 2.3x industry standard with high engagement and conversion rates."
},
{
icon: <BarChart3 className="w-6 h-6" />,
title: "Transparent Reporting",
description: "Detailed analytics and insights to measure ROI and optimize campaigns."
},
{
icon: <Users className="w-6 h-6" />,
title: "Quality Audience",
description: "Educated, affluent readers who trust our content and engage deeply."
},
{
icon: <Globe className="w-6 h-6" />,
title: "Global Reach",
description: "Connect with readers across 180+ countries with localized targeting options."
}
];

const testimonials = [
{
quote: "Advertising with iTruth News has consistently delivered exceptional ROI. Their audience is highly engaged and our campaigns perform well above industry benchmarks.",
author: "Sarah Johnson",
title: "Marketing Director, TechCorp Solutions",
company: "Fortune 500 Technology Company"
},
{
quote: "The native advertising opportunities allowed us to tell our story in a compelling way that resonated with their audience. The results exceeded our expectations.",
author: "Michael Chen",
title: "VP of Brand Marketing, GreenEnergy Inc.",
company: "Renewable Energy Leader"
},
{
quote: "Working with iTruth News team has been seamless. They're professional, responsive, and truly understand how to create campaigns that drive results.",
author: "Jennifer Martinez",
title: "Chief Marketing Officer, Financial Services Group",
company: "Top 10 Financial Institution"
}
];

// --- START: Updated handleSchedule function to open modal ---
const handleSchedule = () => {
setIsModalOpen(true);
} 

const handleModalSubmit = (data: { name: string; email: string; date: string; time: string; notes: string }) => {
// Here you would integrate with your server-side logic
// The data object contains all the information for the SQL INSERT:
// { name, email, date, time, notes }
console.log("Call Scheduled Data:", data);
// The modal component handles the actual API submission
}
// --- END: Updated handleSchedule function ---

return ( 
<>
<Navbar/>
<Toaster/>

<div className="min-h-screen bg-gray-50">
{/* Header */}

<div className="dark:bg-blue-900 text-white">

<div className="container mx-auto px-4 py-16 md:py-24">

<div className="max-w-4xl mx-auto text-center">

<Target className="w-16 h-16 mx-auto mb-6" />

<h1 className="text-4xl md:text-6xl font-bold mb-6">

Reach Millions of Engaged Readers

</h1>

<p className="text-xl md:text-2xl text-blue-100 mb-8">

Connect your brand with our influential, informed audience through premium advertising solutions

</p>

<div className="flex flex-wrap justify-center gap-4">

<Link

href="#packages"

className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">

View Packages

</Link>

<a

href="#contact"

className="px-8 py-4 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors border-2 border-blue-500">

Contact Sales

</a>

</div>

</div>

</div>

</div>



{/* Stats Section */}

<div className="bg-white py-16 border-b">

<div className="container mx-auto px-4">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">

Our Reach

</h2>

<div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">

{stats.map((stat, index) => (

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



{/* Audience Demographics */}

<div className="bg-gray-50 py-16">

<div className="container mx-auto px-4">

<div className="max-w-5xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">

Our Audience

</h2>

<p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">

Reach decision-makers, professionals, and informed consumers who trust our journalism

</p>

<div className="grid md:grid-cols-2 gap-8">

{audience.map((segment, index) => (

<div key={index} className="bg-white p-6 rounded-lg shadow-md">

<div className="flex justify-between items-center mb-2">

<h3 className="text-xl font-bold text-gray-900">{segment.category}</h3>

<span className="text-3xl font-bold text-blue-900">{segment.percentage}%</span>

</div>

<div className="w-full bg-gray-200 rounded-full h-3 mb-3">

<div

className="bg-blue-600 h-3 rounded-full transition-all duration-500"

style={{ width: `${segment.percentage}%` }}

></div>

</div>

<p className="text-gray-600 text-sm">{segment.description}</p>

</div>

))}

</div>

</div>

</div>

</div>



{/* Ad Formats */}

<div className="bg-white py-16">

<div className="container mx-auto px-4">

<div className="max-w-6xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">

Advertising Solutions

</h2>

<p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">

Choose from a variety of premium ad formats designed to maximize engagement and ROI

</p>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{adFormats.map((format, index) => (

<div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">

<div className="text-blue-900 mb-4">

{format.icon}

</div>

<h3 className="text-xl font-bold text-gray-900 mb-3">

{format.title}

</h3>

<p className="text-gray-600 mb-4 text-sm">

{format.description}

</p>

<div className="mb-4">

<p className="text-sm font-semibold text-gray-700 mb-2">Available Formats:</p>

<ul className="text-sm text-gray-600 space-y-1">

{format.formats.map((f, idx) => (

<li key={idx} className="flex items-start">

<span className="text-blue-600 mr-2">•</span>

{f}

</li>

))}

</ul>

</div>

<div className="pt-4 border-t border-gray-200">

<p className="text-blue-900 font-bold">{format.cpm}</p>

</div>

</div>

))}

</div>

</div>

</div>

</div>



{/* Packages */}

<div id="packages" className="bg-gray-100 py-16">

<div className="container mx-auto px-4">

<div className="max-w-6xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">

Advertising Packages

</h2>

<p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">

Flexible solutions designed to fit your budget and marketing objectives

</p>

<div className="grid md:grid-cols-3 gap-8">

{packages.map((pkg, index) => (

<div

key={index}

className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${

pkg.highlighted ? 'ring-4 ring-blue-600' : ''

}`}>

{pkg.highlighted && (

<div className="bg-blue-600 text-white text-center py-2 font-bold">

MOST POPULAR

</div>

)}

<div className="p-8">

<h3 className="text-2xl font-bold text-gray-900 mb-2">

{pkg.name}

</h3>

<div className="mb-4">

<span className="text-4xl font-bold text-blue-900">{pkg.price}</span>

<span className="text-gray-600">{pkg.period}</span>

</div>

<p className="text-gray-600 mb-6 text-sm">

{pkg.description}

</p>

<ul className="space-y-3 mb-8">

{pkg.features.map((feature, idx) => (

<li key={idx} className="flex items-start text-sm">

<CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />

<span className="text-gray-700">{feature}</span>

</li>

))}

</ul>

<Link

href="#contact"

className={`block w-full text-center py-3 rounded-lg font-bold transition-colors ${

pkg.highlighted

? 'bg-blue-900 text-white hover:bg-blue-800'

: 'bg-gray-200 text-gray-900 hover:bg-gray-300'

}`}>

{pkg.cta}

</Link>

</div>

</div>

))}

</div>

</div>

</div>

</div>



{/* Benefits */}

<div className="bg-white py-16">

<div className="container mx-auto px-4">

<div className="max-w-6xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">

Why Advertise With Us

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{benefits.map((benefit, index) => (

<div key={index} className="flex items-start">

<div className="text-blue-900 mr-4 mt-1">

{benefit.icon}

</div>

<div>

<h3 className="text-lg font-bold text-gray-900 mb-2">

{benefit.title}

</h3>

<p className="text-gray-600 text-sm">

{benefit.description}

</p>

</div>

</div>

))}

</div>

</div>

</div>

</div>



{/* Testimonials */}

<div className="bg-blue-50 py-16">

<div className="container mx-auto px-4">

<div className="max-w-5xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">

What Our Partners Say

</h2>

<div className="grid md:grid-cols-3 gap-8">

{testimonials.map((testimonial, index) => (

<div key={index} className="bg-white p-6 rounded-lg shadow-md">

<div className="text-blue-900 text-4xl mb-4">`&quot`</div>

<p className="text-gray-700 mb-6 italic">

{testimonial.quote}

</p>

<div className="border-t pt-4">

<p className="font-bold text-gray-900">{testimonial.author}</p>

<p className="text-sm text-gray-600">{testimonial.title}</p>

<p className="text-xs text-gray-500 mt-1">{testimonial.company}</p>

</div>

</div>

))}

</div>

</div>

</div>

</div>



{/* Resources */}

<div className="bg-white py-16">

<div className="container mx-auto px-4">

<div className="max-w-4xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">

Resources for Advertisers

</h2>

<div className="grid md:grid-cols-3 gap-6">

<div className="text-center">

<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">

<Download className="w-8 h-8 text-blue-900" />

</div>

<h3 className="font-bold text-gray-900 mb-2">Media Kit</h3>

<p className="text-sm text-gray-600 mb-4">Download our comprehensive media kit with specs and rates</p>

<a href="#" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">

Download PDF →

</a>

</div>

<div className="text-center">

<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">

<BarChart3 className="w-8 h-8 text-blue-900" />

</div>

<h3 className="font-bold text-gray-900 mb-2">Audience Insights</h3>

<p className="text-sm text-gray-600 mb-4">Detailed demographics and behavior data</p>

<a href="#" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">

View Report →

</a>

</div>

<div className="text-center">

<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">

<Award className="w-8 h-8 text-blue-900" />

</div>

<h3 className="font-bold text-gray-900 mb-2">Case Studies</h3>

<p className="text-sm text-gray-600 mb-4">See how brands succeed with our platform</p>

<a href="#" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">

Read Stories →

</a>

</div>

</div>

</div>

</div>

</div>
{/* Contact CTA */}
<div id="contact" className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl md:text-4xl font-bold mb-4">
Ready to Get Started?
</h2>
<p className="text-xl text-blue-100 mb-8">
Contact our advertising team to discuss custom solutions for your brand
</p>
<div className="space-y-4 mb-8">
<div>
<p className="text-blue-200 mb-2">Email</p>
<a href="mailto:advertising@itruthnews.com" className="text-2xl font-bold hover:text-blue-200">
advertising@itruthnews.com
</a>
</div>
<div>
<p className="text-blue-200 mb-2">Phone</p>
<a href="tel:+12125550199" className="text-2xl font-bold hover:text-blue-200">
(212) 555-0199
</a>
</div>
</div>
<div className="flex flex-wrap justify-center gap-4">
<Link 
href="/contact" 
className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
Contact Sales Team
</Link>
{/* --- The button calls handleSchedule() to open the modal --- */}
<button 
onClick={handleSchedule}
className="px-8 py-4 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors border-2 border-blue-500 cursor-pointer">
Schedule a Call
</button>
</div>
</div>
</div>
</div>

{/* Footer Note */}
<div className="bg-gray-100 py-8">
<div className="container mx-auto px-4">
<p className="text-center text-gray-600 text-sm max-w-3xl mx-auto">
All advertising is subject to iTruth News editorial guidelines and must comply with our standards. 
We reserve the right to reject advertising that conflicts with our editorial mission or values.
</p>
</div>
</div>
</div>

<Footer/>

{/* --- Schedule Modal Component is rendered here --- */}
<ScheduleCallModal 
isOpen={isModalOpen} 
onClose={() => setIsModalOpen(false)} 
onSubmit={handleModalSubmit}
/>
</>
);
}