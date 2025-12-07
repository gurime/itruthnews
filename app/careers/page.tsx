'use client'
import { useState } from "react"
import { Briefcase, Users, TrendingUp, Award, Globe, Heart, Coffee, Zap, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Careers() {
const [selectedDepartment, setSelectedDepartment] = useState("all");

const benefits = [
{
icon: <Heart className="w-8 h-8" />,
title: "Health & Wellness",
description: "Comprehensive health, dental, and vision insurance for you and your family"
},
{
icon: <Clock className="w-8 h-8" />,
title: "Flexible Schedule",
description: "Work-life balance with flexible hours and remote work options"
},
{
icon: <TrendingUp className="w-8 h-8" />,
title: "Career Growth",
description: "Professional development programs and advancement opportunities"
},
{
icon: <Coffee className="w-8 h-8" />,
title: "Paid Time Off",
description: "Generous PTO, holidays, and parental leave policies"
},
{
icon: <Award className="w-8 h-8" />,
title: "Competitive Pay",
description: "Industry-leading salaries and performance bonuses"
},
{
icon: <Zap className="w-8 h-8" />,
title: "Modern Tools",
description: "Latest technology and resources to do your best work"
}
];

const openPositions = [
{
id: 1,
title: "Senior Investigative Reporter",
department: "Editorial",
location: "New York, NY / Remote",
type: "Full-Time",
description: "Lead in-depth investigations on national issues. 5+ years experience required."
},
{
id: 2,
title: "Political Correspondent",
department: "Editorial",
location: "Washington, DC",
type: "Full-Time",
description: "Cover national politics from Capitol Hill. Strong writing and sourcing skills essential."
},
{
id: 3,
title: "Video Producer",
department: "Multimedia",
location: "New York, NY",
type: "Full-Time",
description: "Create compelling video content for digital platforms. Experience with editing software required."
},
{
id: 4,
title: "Data Journalist",
department: "Editorial",
location: "Remote",
type: "Full-Time",
description: "Analyze data and create visualizations to support investigative reporting."
},
{
id: 5,
title: "Social Media Editor",
department: "Digital",
location: "New York, NY / Remote",
type: "Full-Time",
description: "Manage social media strategy and audience engagement across all platforms."
},
{
id: 6,
title: "Copy Editor",
department: "Editorial",
location: "Remote",
type: "Full-Time",
description: "Ensure accuracy and clarity in all published content. Strong grammar skills required."
},
{
id: 7,
title: "Full-Stack Developer",
department: "Engineering",
location: "Remote",
type: "Full-Time",
description: "Build and maintain our digital platform. React, Node.js experience preferred."
},
{
id: 8,
title: "Audience Development Manager",
department: "Marketing",
location: "New York, NY / Remote",
type: "Full-Time",
description: "Grow our readership through strategic campaigns and partnerships."
}
];

const departments = ["all", "Editorial", "Multimedia", "Digital", "Engineering", "Marketing"];

const filteredPositions = selectedDepartment === "all" 
? openPositions 
: openPositions.filter(pos => pos.department === selectedDepartment);

const values = [
{
title: "Truth Above All",
description: "We're committed to rigorous, fact-based journalism that serves the public interest."
},
{
title: "Independence",
description: "Our newsroom operates free from political or corporate influence."
},
{
title: "Diversity & Inclusion",
description: "We believe diverse perspectives make our journalism stronger and more complete."
},
{
title: "Collaboration",
description: "Great journalism is a team effort. We support and learn from each other."
},
{
title: "Innovation",
description: "We embrace new technologies and approaches to storytelling and engagement."
},
{
title: "Accountability",
description: "We hold ourselves to the highest standards and take responsibility for our work."
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
<Briefcase className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-6xl font-bold mb-6">
Join Our Mission
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-8">
Help us deliver independent journalism that matters. Build your career with iTruth News.
</p>
<div className="flex flex-wrap justify-center gap-4">
<a 
href="#openings" 
className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
View Open Positions
</a>
<a 
href="#contact" 
className="px-8 py-4 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors border-2 border-blue-500">
Contact HR
</a>
</div>
</div>
</div>
</div>

{/* Why Join Us */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
Why Work at iTruth News?
</h2>
<p className="text-xl text-gray-600">
We're building the future of independent journalism. Join a team that's passionate, 
talented, and committed to making a difference.
</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
{benefits.map((benefit, index) => (
<div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
<div className="text-blue-900 mb-4">
{benefit.icon}
</div>
<h3 className="text-xl font-bold text-gray-900 mb-3">
{benefit.title}
</h3>
<p className="text-gray-600">
{benefit.description}
</p>
</div>
))}
</div>
</div>
</div>

{/* Our Values */}
<div className="bg-blue-50 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
Our Values
</h2>
<p className="text-xl text-gray-600">
These principles guide everything we do
</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
{values.map((value, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<h3 className="text-lg font-bold text-gray-900 mb-2">
{value.title}
</h3>
<p className="text-gray-600 text-sm">
{value.description}
</p>
</div>
))}
</div>
</div>
</div>

{/* Open Positions */}
<div id="openings" className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
Open Positions
</h2>
<p className="text-xl text-gray-600 mb-8">
Find your next role at iTruth News
</p>

{/* Department Filter */}
<div className="flex flex-wrap justify-center gap-2">
{departments.map((dept) => (
<button
key={dept}
onClick={() => setSelectedDepartment(dept)}
className={`px-4 py-2 rounded-full font-semibold transition-colors ${
selectedDepartment === dept
? 'bg-blue-900 text-white'
: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
}`}>
{dept === "all" ? "All Departments" : dept}
</button>
))}
</div>
</div>

{/* Job Listings */}
<div className="space-y-4">
{filteredPositions.map((position) => (
<div key={position.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
<div className="flex-1">
<h3 className="text-xl font-bold text-gray-900 mb-2">
{position.title}
</h3>
<p className="text-gray-600 mb-3">
{position.description}
</p>
<div className="flex flex-wrap gap-3 text-sm">
<span className="flex items-center text-gray-700">
<Briefcase className="w-4 h-4 mr-1 text-blue-600" />
{position.department}
</span>
<span className="flex items-center text-gray-700">
<MapPin className="w-4 h-4 mr-1 text-blue-600" />
{position.location}
</span>
<span className="flex items-center text-gray-700">
<Clock className="w-4 h-4 mr-1 text-blue-600" />
{position.type}
</span>
</div>
</div>
<div className="shrink-0">
<a
href={`mailto:careers@itruthnews.com?subject=Application: ${position.title}`}
className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors">
Apply Now
</a>
</div>
</div>
</div>
))}
</div>

{filteredPositions.length === 0 && (
<div className="text-center py-12">
<p className="text-gray-600 text-lg">
No positions available in this department at the moment.
</p>
</div>
)}
</div>
</div>
</div>

{/* Internships */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<div className="bg-white rounded-lg shadow-md p-8">
<div className="flex items-start mb-6">
<Users className="w-12 h-12 text-blue-900 mr-4 shrink-0" />
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">
Internship Program
</h2>
<p className="text-gray-600 mb-4">
Our internship program offers hands-on experience in professional journalism. 
Interns work alongside experienced reporters and editors, contributing to real stories 
that reach millions of readers.
</p>
<ul className="space-y-2 mb-6">
<li className="flex items-start text-gray-700">
<span className="text-blue-600 mr-2">•</span>
<span>Paid positions with competitive stipends</span>
</li>
<li className="flex items-start text-gray-700">
<span className="text-blue-600 mr-2">•</span>
<span>Mentorship from senior journalists</span>
</li>
<li className="flex items-start text-gray-700">
<span className="text-blue-600 mr-2">•</span>
<span>Summer, Fall, and Spring programs available</span>
</li>
<li className="flex items-start text-gray-700">
<span className="text-blue-600 mr-2">•</span>
<span>Opportunities in Editorial, Multimedia, and Digital</span>
</li>
</ul>
<a
href="mailto:internships@itruthnews.com"
className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors">
Learn More About Internships
</a>
</div>
</div>
</div>
</div>
</div>
</div>

{/* Hiring Process */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
Our Hiring Process
</h2>
<div className="space-y-6">
<div className="flex items-start">
<div className="shrink-0 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
1
</div>
<div>
<h3 className="text-xl font-bold text-gray-900 mb-2">Apply Online</h3>
<p className="text-gray-600">
Submit your resume, cover letter, and relevant work samples through our application portal.
</p>
</div>
</div>
<div className="flex items-start">
<div className="shrink-0 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
2
</div>
<div>
<h3 className="text-xl font-bold text-gray-900 mb-2">Initial Review</h3>
<p className="text-gray-600">
Our hiring team reviews applications and reaches out to qualified candidates within 2 weeks.
</p>
</div>
</div>
<div className="flex items-start">
<div className="shrink-0 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
3
</div>
<div>
<h3 className="text-xl font-bold text-gray-900 mb-2">Interview Process</h3>
<p className="text-gray-600">
Typically includes a phone screening, skills assessment, and interviews with team members.
</p>
</div>
</div>
<div className="flex items-start">
<div className="shrink-0 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
4
</div>
<div>
<h3 className="text-xl font-bold text-gray-900 mb-2">Offer & Onboarding</h3>
<p className="text-gray-600">
Successful candidates receive an offer and join our comprehensive onboarding program.
</p>
</div>
</div>
</div>
</div>
</div>
</div>

{/* Contact Section */}
<div id="contact" className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl md:text-4xl font-bold mb-4">
Questions About Careers?
</h2>
<p className="text-xl text-blue-100 mb-8">
Our HR team is here to help you find your place at iTruth News
</p>
<div className="space-y-4 mb-8">
<div>
<p className="text-blue-200 mb-2">General Inquiries</p>
<a href="mailto:careers@itruthnews.com" className="text-2xl font-bold hover:text-blue-200">
careers@itruthnews.com
</a>
</div>
<div>
<p className="text-blue-200 mb-2">Internship Program</p>
<a href="mailto:internships@itruthnews.com" className="text-2xl font-bold hover:text-blue-200">
internships@itruthnews.com
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