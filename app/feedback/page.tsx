'use client'
import { useState, useEffect } from "react"
import { MessageSquare, ThumbsUp, ThumbsDown, Mail, Send, Star, CheckCircle, Loader } from "lucide-react"
import supabase from "../supabase/supabase"
import toast, { Toaster } from "react-hot-toast"
import type { User } from "@supabase/supabase-js"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default function Feedback() {
const [user, setUser] = useState<User | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

// Form states
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [feedbackType, setFeedbackType] = useState("general");
const [rating, setRating] = useState(0);
const [subject, setSubject] = useState("");
const [message, setMessage] = useState("");

useEffect(() => {
const checkUser = async () => {
const { data: { session } } = await supabase.auth.getSession();
setUser(session?.user ?? null);

if (session?.user) {
setEmail(session.user.email || "");

const { data: profile } = await supabase
.from('profiles')
.select('full_name')
.eq('id', session.user.id)
.single();

if (profile?.full_name) {
setName(profile.full_name);
}
}
};
checkUser();

const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
});

return () => subscription.unsubscribe();
}, []);

const handleSubmit = async () => {
setIsSubmitting(true);

if (!name || !email || !message || !subject) {
toast.error("Please fill in all required fields");
setIsSubmitting(false);
return;
}

if (!email.includes('@')) {
toast.error("Please enter a valid email address");
setIsSubmitting(false);
return;
}

try {
const { error } = await supabase
.from('feedback')
.insert([{
name,
email,
feedback_type: feedbackType,
rating,
subject,
message,
user_id: user?.id || null,
created_at: new Date().toISOString()
}]);

if (error) throw error;

toast.success("Thank you for your feedback! We'll review it carefully.");

// Reset form
if (!user) {
setName("");
setEmail("");
}
setFeedbackType("general");
setRating(0);
setSubject("");
setMessage("");
} catch (error: any) {
toast.error(`Submission failed: ${error.message}`);
} finally {
setIsSubmitting(false);
}
};

const feedbackTypes = [
{ value: "general", label: "General Feedback" },
{ value: "praise", label: "Praise / Compliment" },
{ value: "complaint", label: "Complaint / Issue" },
{ value: "suggestion", label: "Suggestion / Idea" },
{ value: "technical", label: "Technical Problem" },
{ value: "content", label: "Content Feedback" },
{ value: "other", label: "Other" }
];

const feedbackCategories = [
{
icon: <ThumbsUp className="w-8 h-8" />,
title: "What We Do Well",
description: "Tell us what you appreciate about our journalism and coverage"
},
{
icon: <ThumbsDown className="w-8 h-8" />,
title: "What We Can Improve",
description: "Share constructive criticism to help us serve you better"
},
{
icon: <MessageSquare className="w-8 h-8" />,
title: "Story Ideas",
description: "Suggest topics or stories you'd like us to cover"
}
];

return (
<>
<Navbar/>
<div className="min-h-screen bg-gray-50">
<Toaster position="top-center" />

{/* Header */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16 md:py-20">
<div className="max-w-4xl mx-auto text-center">
<MessageSquare className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-6">
We Value Your Feedback
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-8">
Help us improve by sharing your thoughts, suggestions, and ideas
</p>
</div>
</div>
</div>

{/* Why Your Feedback Matters */}
<div className="bg-white py-12 border-b">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
Why Your Feedback Matters
</h2>
<p className="text-lg text-gray-700 leading-relaxed mb-4 text-center">
As a reader-funded publication, we answer to you—our readers. Your feedback helps us 
understand what's working, what isn't, and how we can better serve you. Whether it's 
praise, criticism, or suggestions, we read every submission carefully.
</p>
</div>
</div>
</div>

{/* Feedback Categories */}
<div className="bg-gray-50 py-12">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
What Kind of Feedback Are You Sharing?
</h2>
<div className="grid md:grid-cols-3 gap-6">
{feedbackCategories.map((category, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
<div className="text-blue-900 flex justify-center mb-4">
{category.icon}
</div>
<h3 className="text-xl font-bold text-gray-900 mb-2">
{category.title}
</h3>
<p className="text-gray-600 text-sm">
{category.description}
</p>
</div>
))}
</div>
</div>
</div>
</div>

{/* Feedback Form */}
<div className="py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto">
<div className="bg-white rounded-lg shadow-lg p-8">
<h2 className="text-2xl font-bold text-gray-900 mb-6">
Share Your Feedback
</h2>

{user && (
<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
<p className="text-sm text-blue-900">
<strong>Signed in as:</strong> {user.email}
</p>
</div>
)}

<div className="space-y-6">
{/* Name */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Your Name *
</label>
<input
type="text"
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="John Doe"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Email */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Email Address *
</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="your@email.com"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Feedback Type */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Feedback Type *
</label>
<select
value={feedbackType}
onChange={(e) => setFeedbackType(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
{feedbackTypes.map((type) => (
<option key={type.value} value={type.value}>
{type.label}
</option>
))}
</select>
</div>

{/* Rating */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Overall Rating (Optional)
</label>
<div className="flex gap-2">
{[1, 2, 3, 4, 5].map((star) => (
<button
key={star}
type="button"
onClick={() => setRating(star)}
className="focus:outline-none">
<Star
className={`w-8 h-8 ${
star <= rating
? 'fill-yellow-400 text-yellow-400'
: 'text-gray-300'
}`}
/>
</button>
))}
{rating > 0 && (
<button
type="button"
onClick={() => setRating(0)}
className="ml-2 text-sm text-gray-600 hover:text-gray-800">
Clear
</button>
)}
</div>
</div>

{/* Subject */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Subject *
</label>
<input
type="text"
value={subject}
onChange={(e) => setSubject(e.target.value)}
placeholder="Brief description of your feedback"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Message */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Your Feedback *
</label>
<textarea
value={message}
onChange={(e) => setMessage(e.target.value)}
placeholder="Please share your detailed feedback here..."
rows={8}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
/>
</div>

{/* Submit Button */}
<button
onClick={handleSubmit}
disabled={isSubmitting}
className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center ${
isSubmitting
? 'bg-gray-400 cursor-not-allowed'
: 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl'
}`}>
{isSubmitting ? (
<>
<Loader className="animate-spin mr-2 h-5 w-5" />
Submitting...
</>
) : (
<>
<Send className="w-5 h-5 mr-2" />
Submit Feedback
</>
)}
</button>
</div>
</div>
</div>
</div>
</div>

{/* Other Ways to Reach Us */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
Other Ways to Reach Us
</h2>
<div className="grid md:grid-cols-3 gap-6">
<div className="bg-white p-6 rounded-lg shadow-sm text-center">
<Mail className="w-10 h-10 text-blue-900 mx-auto mb-4" />
<h3 className="text-lg font-bold text-gray-900 mb-2">
General Inquiries
</h3>
<p className="text-gray-600 text-sm mb-3">
For questions about our coverage or operations
</p>
<a href="mailto:feedback@itruthnews.com" className="text-blue-600 hover:text-blue-800 font-semibold">
feedback@itruthnews.com
</a>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm text-center">
<MessageSquare className="w-10 h-10 text-blue-900 mx-auto mb-4" />
<h3 className="text-lg font-bold text-gray-900 mb-2">
Story Tips
</h3>
<p className="text-gray-600 text-sm mb-3">
Have a story idea or tip for our reporters?
</p>
<a href="mailto:tips@itruthnews.com" className="text-blue-600 hover:text-blue-800 font-semibold">
tips@itruthnews.com
</a>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm text-center">
<CheckCircle className="w-10 h-10 text-blue-900 mx-auto mb-4" />
<h3 className="text-lg font-bold text-gray-900 mb-2">
Corrections
</h3>
<p className="text-gray-600 text-sm mb-3">
Report errors in our reporting
</p>
<a href="mailto:corrections@itruthnews.com" className="text-blue-600 hover:text-blue-800 font-semibold">
corrections@itruthnews.com
</a>
</div>
</div>
</div>
</div>
</div>

{/* Response Time */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center">
<h3 className="text-2xl font-bold text-gray-900 mb-4">
What Happens Next?
</h3>
<p className="text-lg text-gray-700 mb-6">
We read every piece of feedback we receive. While we can't respond to every submission 
individually, your input directly influences our editorial decisions and helps shape our coverage.
</p>
<p className="text-gray-600">
For urgent matters requiring a response, please use our{" "}
<a href="/contact" className="text-blue-600 hover:text-blue-800 font-semibold">
contact form
</a>{" "}
or email us directly.
</p>
</div>
</div>
</div>
</div>
<Footer/>
</>
);
}