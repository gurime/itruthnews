"use client"

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, MessageSquare, AlertCircle, Send, Clock, Users, Shield } from "lucide-react";
import supabase from "../supabase/supabase";
import toast, { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Contact() {
const [email, setEmail] = useState('');
const [fullName, setFullName] = useState('');
const [subject, setSubject] = useState('');
const [category, setCategory] = useState('general');
const [textmessage, setTextMessage] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [user, setUser] = useState<User | null>(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);

useEffect(() => {
const checkUser = async () => {
const { data: { session } } = await supabase.auth.getSession();
setUser(session?.user ?? null);

// Pre-fill email and name if user is logged in
if (session?.user) {
setEmail(session.user.email || '');

// Try to get full name from profiles table
const { data: profile } = await supabase
.from('profiles')
.select('full_name')
.eq('id', session.user.id)
.single();

if (profile?.full_name) {
setFullName(profile.full_name);
}
}
setIsLoadingUser(false);
};
checkUser();

const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null); 
if(!session){
setEmail("");
setFullName("");
setSubject("");
setTextMessage("");
setCategory("general");
}

});


return () => subscription.unsubscribe();
}, []);

const handleContact = async () => {
setIsSubmitting(true);

// Validate inputs
if (!email || !subject || !textmessage || !fullName) {
toast.error('All fields are required.');
setIsSubmitting(false);
return;
}

// Validate email format
if (!email.includes('@')) {
toast.error('Please enter a valid email address.');
setIsSubmitting(false);
return;
}

try {
// Insert contact form data into Supabase
const { error } = await supabase
.from('contact') 
.insert([{ 
email, 
textmessage, 
subject,
full_name: fullName,
category,
user_id: user?.id || null
}]);

if (error) throw error;

// Reset form and handle success
if (!user) {
setEmail('');
setFullName('');
}
setSubject('');
setTextMessage('');
setCategory('general');
toast.success("Your message has been sent successfully! We'll get back to you within 24-48 hours.");

} catch (error: Error | unknown) {
const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
toast.error(errorMessage);
} finally {
setIsSubmitting(false);
}
};

const contactInfo = [
{
icon: <Mail className="w-6 h-6" />,
title: "General Inquiries",
content: "contact@itruthnews.com",
description: "For general questions and feedback"
},
{
icon: <MessageSquare className="w-6 h-6" />,
title: "Tips & Story Ideas",
content: "tips@itruthnews.com",
description: "Have a story we should cover?"
},
{
icon: <AlertCircle className="w-6 h-6" />,
title: "Corrections",
content: "corrections@itruthnews.com",
description: "Report errors in our coverage"
},
{
icon: <Users className="w-6 h-6" />,
title: "Careers",
content: "careers@itruthnews.com",
description: "Join our team"
}
];

const categories = [
{ value: 'general', label: 'General Inquiry' },
{ value: 'tip', label: 'Story Tip' },
{ value: 'correction', label: 'Correction Request' },
{ value: 'technical', label: 'Technical Support' },
{ value: 'subscription', label: 'Subscription/Membership' },
{ value: 'press', label: 'Press Inquiry' },
{ value: 'partnership', label: 'Partnership Opportunity' },
{ value: 'accessibility', label: 'Accessibility Feedback' },
{ value: 'other', label: 'Other' }
];

return (
<>
<Navbar/>
<div className="min-h-screen bg-gray-50">
<Toaster position="top-center" />

{/* Header */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16">
<div className="max-w-4xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-4">
Contact Us
</h1>
<p className="text-xl text-blue-100">
We&lsquo;d love to hear from you. Get in touch with our team.
</p>
</div>
</div>
</div>

{/* Quick Contact Info Cards */}
<div className="bg-white py-12 border-b">
<div className="container mx-auto px-4">
<div className="max-w-6xl mx-auto">
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{contactInfo.map((info, index) => (
<div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
<div className="text-blue-900 mb-3">
{info.icon}
</div>
<h3 className="text-lg font-bold text-gray-900 mb-2">
{info.title}
</h3>
<a 
href={`mailto:${info.content}`}
className="text-blue-600 hover:text-blue-800 font-semibold mb-2 block">
{info.content}
</a>
<p className="text-sm text-gray-600">
{info.description}
</p>
</div>
))}
</div>
</div>
</div>
</div>

{/* Main Contact Form Section */}
<div className="py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<div className="grid lg:grid-cols-3 gap-8">

{/* Contact Form */}
<div className="lg:col-span-2">
<div className="bg-white rounded-lg shadow-lg p-8">
<h2 className="text-3xl font-bold text-gray-900 mb-2">
Send Us a Message
</h2>
<p className="text-gray-600 mb-6">
{user 
? "Fill out the form below and we'll get back to you as soon as possible."
: "Only Registered users can fill out the form below!"}
</p>

{!isLoadingUser && user && (
<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
<Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
<div>
<p className="text-sm text-blue-900">
<strong>Signed in as:</strong> {user.email}
</p>
<p className="text-xs text-blue-700 mt-1">
Your contact information has been pre-filled
</p>
</div>
</div>
)}

<div className="space-y-6">
{/* Full Name */}
<div>
<label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
Full Name *
</label>
<input
id="fullName"
type="text"
value={fullName}
onChange={(e) => setFullName(e.target.value)}
placeholder="John Doe"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Email */}
<div>
<label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
Email Address *
</label>
<input
id="email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="your@email.com"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Category */}
<div>
<label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
Category *
</label>
<select
id="category"
value={category}
onChange={(e) => setCategory(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
{categories.map((cat) => (
<option key={cat.value} value={cat.value}>
{cat.label}
</option>
))}
</select>
</div>

{/* Subject */}
<div>
<label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
Subject *
</label>
<input
id="subject"
type="text"
value={subject}
onChange={(e) => setSubject(e.target.value)}
placeholder="Brief description of your inquiry"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Message */}
<div>
<label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
Message *
</label>
<textarea
id="message"
value={textmessage}
onChange={(e) => setTextMessage(e.target.value)}
placeholder="Please provide as much detail as possible..."
rows={6}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
/>
</div>

{/* Submit Button */}
<button
onClick={handleContact}
disabled={!user || isSubmitting}
className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center ${
!user || isSubmitting
? 'bg-gray-400 cursor-not-allowed text-gray-700'
: 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl'
}`}
>
{isSubmitting ? (
<>
<Link href="#" className="text-blue-600 hover:text-blue-800">
<svg
className="w-6 h-6"
fill="currentColor"
viewBox="0 0 24 24"
>
<path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8h4.5v14h-4.5V8zm7.5 0h4.31v1.95h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 2.96 5.39 6.81V22h-4.5v-6.78c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.61 1.77-2.61 3.58V22h-4.5V8z"/>
</svg>
</Link>
Sending...
</>
) : (
<>
<Send className="w-5 h-5 mr-2" />
{!user ? 'Sign In to Send Message' : 'Send Message'}
</>
)}
</button>

{/* Optional: Add a message below the button explaining why they need to sign in */}
{!user && (
<p className="text-sm text-gray-600 text-center mt-2">
Please sign in to submit a contact form
</p>
)}
</div>
</div>
</div>

{/* Sidebar Info */}
<div className="space-y-6">

{/* Response Time */}
<div className="bg-white rounded-lg shadow-md p-6">
<div className="flex items-start mb-4">
<Clock className="w-6 h-6 text-blue-900 mr-3 mt-1" />
<div>
<h3 className="text-lg font-bold text-gray-900 mb-2">
Response Time
</h3>
<p className="text-gray-600 text-sm">
We typically respond within 24-48 hours during business days.
</p>
</div>
</div>
</div>

{/* Tips & Confidentiality */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<div className="flex items-start mb-4">
<Shield className="w-6 h-6 text-blue-900 mr-3 mt-1" />
<div>
<h3 className="text-lg font-bold text-gray-900 mb-2">
For Confidential Tips
</h3>
<p className="text-gray-700 text-sm mb-3">
If you have sensitive information to share with our investigative team, please use our secure tip line.
</p>
<a 
href="mailto:tips@itruthnews.com"
className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
tips@itruthnews.com
</a>
</div>
</div>
</div>

{/* Office Info */}
<div className="bg-white rounded-lg shadow-md p-6">
<h3 className="text-lg font-bold text-gray-900 mb-4">
Headquarters
</h3>
<div className="space-y-3 text-sm text-gray-600">
<div className="flex items-start">
<MapPin className="w-5 h-5 text-blue-900 mr-3 mt-0.5 shrink-0" />
<div>
<p className="font-semibold text-gray-900">iTruth News</p>
<p>123 Press Avenue</p>
<p>New York, NY 10001</p>
</div>
</div>
<div className="flex items-start">
<Phone className="w-5 h-5 text-blue-900 mr-3 mt-0.5 shrink-0" />
<div>
<p className="font-semibold text-gray-900">Main Line</p>
<p>(212) 555-0123</p>
</div>
</div>
</div>
</div>

{/* Social Media */}
<div className="bg-white rounded-lg shadow-md p-6">
<h3 className="text-lg font-bold text-gray-900 mb-4">
Follow Us
</h3>
<div className="flex space-x-4">
{/* Facebook icon */}
<Link href="#" className="text-blue-500 ">
<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
</Link>
{/* Facebook icon */}

{/* X Icon */}
<Link href="#" className="text-black ">
<svg
className="w-6 h-6"
fill="currentColor"
viewBox="0 0 24 24"
>
<path d="M18.146 2H21.5l-7.52 8.59L23.5 22h-7.09l-5.03-6.48L5.77 22H2.5l8.06-9.2L1.5 2h7.2l4.57 5.89L18.146 2z" />
</svg>
</Link>
{/* X Icon */}

{/* LinkedIn icon */}
<Link href="#" className="text-blue-700 ">
<svg
className="w-6 h-6"
fill="currentColor"
viewBox="0 0 24 24"
>
<path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8h4.5v14h-4.5V8zm7.5 0h4.31v1.95h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 2.96 5.39 6.81V22h-4.5v-6.78c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.61 1.77-2.61 3.58V22h-4.5V8z"/>
</svg>
</Link>
{/* LinkedIn icon */}

</div>
</div>

</div>
</div>
</div>
</div>
</div>

{/* FAQ Section */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
Frequently Asked Questions
</h2>
<div className="space-y-4">
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-lg font-bold text-gray-900 mb-2">
How do I submit a correction?
</h3>
<p className="text-gray-600">
Please email corrections@itruthnews.com with the article URL, the error you&lsquo;ve identified, 
and the correct information. We review all correction requests promptly.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-lg font-bold text-gray-900 mb-2">
Can I pitch a story idea?
</h3>
<p className="text-gray-600">
Absolutely! Send your story ideas to tips@itruthnews.com. Please include relevant details, 
sources, and why you think it&lsquo;s important for our readers.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-lg font-bold text-gray-900 mb-2">
How do I report a technical issue?
</h3>
<p className="text-gray-600">
For website or app issues, please use the contact form above and select &ldquo;Technical Support&ldquo; 
as the category. Include details about your device, browser, and what you were trying to do.
</p>
</div>
</div>
</div>
</div>
</div>
</div>
<Footer/>
</>
);
}