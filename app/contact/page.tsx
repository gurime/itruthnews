"use client"

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, MessageSquare, AlertCircle, Send, Clock, Users, Shield } from "lucide-react";
import supabase from "../supabase/supabase";
import toast, { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

} catch (error: any) {
toast.error(error.message || 'Something went wrong. Please try again.');
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
{ value: 'other', label: 'Other' }
];

return (
<>
<Navbar/>
<div className="bg-gray-100 py-8"></div>
<div className="min-h-screen bg-gray-50">
<Toaster position="top-center" />

{/* Header */}
<div className="bg-linear-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
<div className="container mx-auto px-4 py-16">
<div className="max-w-4xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-4">
Contact Us
</h1>
<p className="text-xl text-blue-100">
We'd love to hear from you. Get in touch with our team.
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
: "Anyone can contact us! Fill out the form below and we'll get back to you as soon as possible."}
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
disabled={isSubmitting}
className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center ${
isSubmitting
? 'bg-gray-400 cursor-not-allowed'
: 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl'
}`}>
{isSubmitting ? (
<>
<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
Sending...
</>
) : (
<>
<Send className="w-5 h-5 mr-2" />
Send Message
</>
)}
</button>
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
<a href="#" className="text-blue-600 hover:text-blue-800">
<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
</a>
<a href="#" className="text-blue-600 hover:text-blue-800">
<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
</a>
<a href="#" className="text-blue-600 hover:text-blue-800">
<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
</a>
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
Please email corrections@itruthnews.com with the article URL, the error you've identified, 
and the correct information. We review all correction requests promptly.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-lg font-bold text-gray-900 mb-2">
Can I pitch a story idea?
</h3>
<p className="text-gray-600">
Absolutely! Send your story ideas to tips@itruthnews.com. Please include relevant details, 
sources, and why you think it's important for our readers.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-lg font-bold text-gray-900 mb-2">
How do I report a technical issue?
</h3>
<p className="text-gray-600">
For website or app issues, please use the contact form above and select "Technical Support" 
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