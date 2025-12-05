/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, ImageIcon, User,LogOut, Lock, Loader } from "lucide-react";
import supabase from "../supabase/supabase";
import toast, { Toaster } from "react-hot-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { categories, opinionCategories } from "./category_tables";

interface Article {
id: string;
title: string;
image?: string | null;
content?: string | null;
bodycontent?: string | null;
endcontent?: string | null;
created_at?: string | null;
category?: string | null;
author?: string | null;
author_bio?: string | null;
author_role?: string | null;
author_avatar?: string | null;
author_disclaimer?: string | null;
excerpt?: string | null;
tags?: string[] | string | null;
source?: string | null;
featured?: boolean;
}

export default function Admin() {
const router = useRouter();
const [user, setUser] = useState<SupabaseUser | null>(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

// Login form states
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");

// Article form states
const [title, setTitle] = useState("");
const [excerpt, setExcerpt] = useState("");
const [category, setCategory] = useState("politics");
const [author, setAuthor] = useState("");
const [authorBio, setAuthorBio] = useState("");
const [authorRole, setAuthorRole] = useState("Staff Writer");
const [authorAvatar, setAuthorAvatar] = useState("");
const [authorDisclaimer, setAuthorDisclaimer] = useState("The views expressed in this article are those of the author and do not reflect the views of iTruth News.");
const [featured, setFeatured] = useState(false);
const [tags, setTags] = useState("");
const [content, setContent] = useState("");
const [bodycontent, setBodyContent] = useState("");
const [endcontent, setEndContent] = useState("");
const [source, setSource] = useState("");
const [image, setImage] = useState<File | null>(null);
const [imageUrl, setImageUrl] = useState("");
const [imagePreview, setImagePreview] = useState("");



useEffect(() => {
checkAuth();
}, []);

const checkAuth = async () => {
try {
const { data: { session } } = await supabase.auth.getSession();

if (session?.user) {
// Check if user has admin/staff role
const { data: profile } = await supabase
.from('profiles')
.select('email, full_name, role')
.eq('id', session.user.id)
.single();

if (profile) {
setUser(session.user);
setIsAuthenticated(true);
setAuthor(profile.full_name || profile.email || session.user.email || "");
}
}
} catch (error) {
console.error("Auth check error:", error);
} finally {
setIsLoading(false);
}
};

const handleLogin = async () => {
if (!loginEmail || !loginPassword) {
toast.error("Please enter email and password");
return;
}

try {
const { data, error } = await supabase.auth.signInWithPassword({
email: loginEmail,
password: loginPassword,
});

if (error) throw error;

if (data.user) {
setUser(data.user);
setIsAuthenticated(true);
setAuthor(data.user.email || "");
toast.success("Login successful!");
}
} catch (error: unknown) {
const errorMessage = error instanceof Error ? error.message : "Login failed";
toast.error(errorMessage);
}
};

const handleLogout = async () => {
try {
await supabase.auth.signOut();
setUser(null);
setIsAuthenticated(false);
toast.success("Logged out successfully");
} catch (error: unknown) {
toast.error("Logout failed");
}
};

const handleImageUpload = async (file: File) => {
try {
const fileExt = file.name.split('.').pop();
const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
const filePath = `${fileName}`;

const { data, error } = await supabase.storage
.from('images')
.upload(filePath, file);

if (error) throw error;

// Use createSignedUrl instead of getPublicUrl for consistency
const { data: urlData } = await supabase.storage
.from('images')
.createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry

if (!urlData) {
throw new Error('Failed to generate signed URL');
}

return urlData.signedUrl;
} catch (error: unknown) {
const errorMessage = error instanceof Error ? error.message : "Unknown error";
toast.error(`Image upload failed: ${errorMessage}`);
return null;
}
};
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
setImage(file);
// Create preview
const reader = new FileReader();
reader.onloadend = () => {
setImagePreview(reader.result as string);
};
reader.readAsDataURL(file);
}
};



const handleSubmit = async () => {
setIsSubmitting(true);

// Validation
if (!title || !excerpt || !category || !author || !content) {
toast.error("Please fill in all required fields");
setIsSubmitting(false);
return;
}

try {
let finalImageUrl = imageUrl;

// Upload image if selected
if (image) {
const uploadedUrl = await handleImageUpload(image);
if (uploadedUrl) {
finalImageUrl = uploadedUrl;
}
}

// Parse tags
const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

// Get the correct table name based on category
const selectedCategory = categories.find(cat => cat.value === category);
const tableName = selectedCategory?.table || category;

// Prepare article data - ONLY include fields that exist in your table
const articleData = {
title,
excerpt,
category: selectedCategory?.label || category,
author,
author_bio: authorBio || null,
author_role: authorRole || null,
author_avatar: authorAvatar || null,
author_disclaimer: opinionCategories.includes(category) ? authorDisclaimer : null,
featured,
tags: tagsArray,
content,
bodycontent: bodycontent || null,
endcontent: endcontent || null,
image: finalImageUrl || null,
source: source || null,
created_at: new Date().toISOString()
};



// Insert into appropriate table - no select() call to avoid column issues
const { data, error } = await supabase
.from(tableName)
.insert(articleData)
.select(); // Add select() to return the inserted row

if (error) {
console.error('Supabase error:', error);
throw error;
}

toast.success(`Article published successfully to ${selectedCategory?.label}!`);

// Reset form
resetForm();
} catch (error: unknown) {
console.error('Full error:', error);
const errorMessage = error instanceof Error ? error.message : "Publication failed";
toast.error(`Publication failed: ${errorMessage}`);
} finally {
setIsSubmitting(false);
}
};

const resetForm = () => {
setTitle("");
setExcerpt("");
setCategory("politics");
setAuthorBio("");
setAuthorRole("Staff Writer");
setAuthorAvatar("");
setFeatured(false);
setTags("");
setContent("");
setBodyContent("");
setEndContent("");
setSource("");
setImage(null);
setImageUrl("");
setImagePreview("");
};

// Login Screen
if (isLoading) {
return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
<Loader className="w-8 h-8 animate-spin text-blue-600" />
</div>
);
}

if (!isAuthenticated) {
return (
<div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
<Toaster position="top-center" />
<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
<div className="text-center mb-8">
<Lock className="w-16 h-16 text-blue-900 mx-auto mb-4" />
<Link href="/">
<h1 className="text-2xl font-bold" title="Home">iTruth News CMS</h1>
<p className="text-blue-200 text-sm">Content Management System</p>
</Link>
</div>

<div className="space-y-4">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Email Address
</label>
<input
type="email"
value={loginEmail}
onChange={(e) => setLoginEmail(e.target.value)}
placeholder="staff@itruthnews.com"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
/>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Password
</label>
<input
type="password"
value={loginPassword}
onChange={(e) => setLoginPassword(e.target.value)}
placeholder="••••••••"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
/>
</div>

<button
onClick={handleLogin}
className="w-full py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors">
Sign In
</button>
</div>

<div className="mt-6 text-center">
<p className="text-sm text-gray-600">
Access restricted to authorized staff only
</p>
</div>
</div>
</div>
);
}

// CMS Dashboard
return (
<div className="min-h-screen bg-gray-100">
<Toaster position="top-center" />

{/* Header */}
<div className="bg-blue-900 text-white shadow-lg">
<div className="container mx-auto px-4 py-4">
<div className="flex items-center justify-between">
<div>
<Link href="/">
<h1 className="text-2xl font-bold" title="Home">iTruth News CMS</h1>
<p className="text-blue-200 text-sm">Content Management System</p>
</Link>
</div>
<div className="flex items-center gap-4">
<div className="text-right">
<p className="text-sm font-semibold">{user?.email}</p>
<p className="text-xs text-blue-200">Staff Writer</p>
</div>
<button
onClick={handleLogout}
className="flex items-center gap-2 px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors">
<LogOut className="w-4 h-4" />
Logout
</button>
</div>
</div>
</div>
</div>

{/* Main Content */}
<div className="container mx-auto px-4 py-8">
<div className="max-w-5xl mx-auto">

{/* Page Header */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
<h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Article</h2>
<p className="text-gray-600">Fill in the details below to publish a new article</p>
</div>

{/* Form */}
<div className="bg-white rounded-lg shadow-md p-6 space-y-6">

{/* Basic Info Section */}
<div className="border-b pb-6">
<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
<FileText className="w-5 h-5 mr-2 text-blue-900" />
Article Information
</h3>

{/* Category Selection */}
<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Category * <span className="text-gray-500 font-normal">(Determines which table to publish to)</span>
</label>
<select
value={category}
onChange={(e) => setCategory(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
{categories.map((cat) => (
<option key={cat.value} value={cat.value}>
{cat.label} (Table: {cat.table})
</option>
))}
</select>
</div>

{/* Title */}
<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Article Title *
</label>
<input
type="text"
value={title}
onChange={(e) => setTitle(e.target.value)}
placeholder="Enter article title..."
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Excerpt */}
<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Excerpt / Summary *
</label>
<textarea
value={excerpt}
onChange={(e) => setExcerpt(e.target.value)}
placeholder="Brief summary of the article (1-2 sentences)..."
rows={3}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
/>
</div>

{/* Tags */}
<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Tags <span className="text-gray-500 font-normal">(comma-separated)</span>
</label>
<input
type="text"
value={tags}
onChange={(e) => setTags(e.target.value)}
placeholder="politics, breaking news, us news"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Source */}
<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Source <span className="text-gray-500 font-normal">(optional)</span>
</label>
<input
type="text"
value={source}
onChange={(e) => setSource(e.target.value)}
placeholder="Source attribution (if applicable)"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{/* Featured Checkbox */}
<div className="flex items-center">
<input
type="checkbox"
id="featured"
checked={featured}
onChange={(e) => setFeatured(e.target.checked)}
className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
/>
<label htmlFor="featured" className="ml-2 text-sm font-semibold text-gray-700">
Mark as Featured Article
</label>
</div>
</div>

{/* Image Upload Section */}
<div className="border-b pb-6">
<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
<ImageIcon className="w-5 h-5 mr-2 text-blue-900" />
Featured Image
</h3>

<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Upload Image
</label>
<input
type="file"
accept="image/*"
onChange={handleImageChange}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
{imagePreview && (
<div className="mt-4">
<p className="text-sm text-gray-600 mb-2">Preview:</p>
<Image loading="eager"
priority style={{width:"auto", height:"auto"}} height={100} width={500} src={imagePreview} alt="Preview" className="max-w-xs rounded-lg shadow-md" />
</div>
)}
</div>

<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Or Enter Image URL
</label>
<input
type="url"
value={imageUrl}
onChange={(e) => setImageUrl(e.target.value)}
placeholder="https://example.com/image.jpg"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>
</div>

{/* Author Section */}
<div className="border-b pb-6">
<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
<User className="w-5 h-5 mr-2 text-blue-900" />
Author Information
</h3>

<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Author Name *
</label>
<input
type="text"
value={author}
onChange={(e) => setAuthor(e.target.value)}
placeholder="Your name"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Author Role
</label>
<input
type="text"
value={authorRole}
onChange={(e) => setAuthorRole(e.target.value)}
placeholder="Staff Writer, Opinion Columnist, etc."
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>
</div>

<div className="mt-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Author Bio
</label>
<textarea
value={authorBio}
onChange={(e) => setAuthorBio(e.target.value)}
placeholder="Brief bio about the author..."
rows={2}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
/>
</div>


<div className="mt-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Author Avatar URL
</label>
<input
type="url"
value={authorAvatar}
onChange={(e) => setAuthorAvatar(e.target.value)}
placeholder="https://example.com/avatar.jpg"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

{['columnists', 'guest_voices', 'editorials', 'letters', 'editorial_board', 
'opinion_politics', 'opinion_world', 'opinion_culture', 'opinion_economy', 
'opinion_technology', 'opinion_climate', 'trending_voices', 'weekend_reads'].includes(category) && (
<div className="mt-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Author Disclaimer
</label>
<textarea
value={authorDisclaimer}
onChange={(e) => setAuthorDisclaimer(e.target.value)}
placeholder="The views expressed in this article are those of the author and do not reflect the views of iTruth News."
rows={2}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
/>
</div>
)}
</div>

{/* Content Section */}
<div>
<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
<FileText className="w-5 h-5 mr-2 text-blue-900" />
Article Content
</h3>

<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Full Content * <span className="text-gray-500 font-normal">(Main article body)</span>
</label>
<textarea
value={content}
onChange={(e) => setContent(e.target.value)}
placeholder="Write the full article content here..."
rows={12}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-900"
/>
</div>

<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
Body Content <span className="text-gray-500 font-normal">(Optional - for split layout)</span>
</label>
<textarea
value={bodycontent}
onChange={(e) => setBodyContent(e.target.value)}
placeholder="Additional body content (if using split content layout)..."
rows={6}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-900"
/>
</div>

<div className="mb-4">
<label className="block text-sm font-semibold text-gray-700 mb-2">
End Content <span className="text-gray-500 font-normal">(Optional - concluding paragraphs)</span>
</label>
<textarea
value={endcontent}
onChange={(e) => setEndContent(e.target.value)}
placeholder="Concluding content (if using split content layout)..."
rows={6}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-900"
/>
</div>
</div>

{/* Submit Button */}
<div className="pt-6 border-t">
<div className="flex gap-4">
<button
onClick={handleSubmit}
disabled={isSubmitting}
className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center ${
isSubmitting
? 'bg-gray-400 cursor-not-allowed'
: 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl cursor-pointer'
}`}>
{isSubmitting ? (
<>
<Loader className="animate-spin mr-2 h-5 w-5" />
Publishing...
</>
) : (
<>
<Upload className="w-5 h-5 mr-2" />
Publish Article
</>
)}
</button>
<button
onClick={resetForm}
disabled={isSubmitting}
className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors cursor-pointer">
Clear Form
</button>
</div>
</div>
</div>
</div>
</div>
</div>
);
}