'use client'
import React, { useEffect, useState } from 'react'
import { User, Mail, Bell,  Cookie, MessageSquare, Bookmark, Loader, Save } from 'lucide-react'
import supabase from '../supabase/supabase';
import type { User as SupabaseUser } from "@supabase/supabase-js";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
const router = useRouter();
const [isLoading, setIsLoading] = useState(true);
const [user, setUser] = useState<SupabaseUser | null>(null);
const [bookmarks, setBookmarks] = useState<any[]>([]);

const [activeTab, setActiveTab] = useState('account');
const [isSaving, setIsSaving] = useState(false);
const searchParams = useSearchParams();

// Profile data
const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [subscriptionStatus, setSubscriptionStatus] = useState('free');

// Newsletter preferences
const [newsletters, setNewsletters] = useState({
daily: false,
weekly: false,
breaking: false,
politics: false,
tech: false
});

// Notification preferences
const [notifications, setNotifications] = useState({
commentReplies: true,
breakingNews: false,
weeklyDigest: true,
productUpdates: false
});

// Cookie preferences
const [cookieSettings, setCookieSettings] = useState({
necessary: true, // Always true, can't be disabled
analytics: true,
marketing: false,
functional: true
});

useEffect(() => {
let mounted = true;

const loadProfile = async () => {
const { data: { session } } = await supabase.auth.getSession();
if (!mounted) return;

if (!session?.user) {
router.push('/login');
return;
}

setUser(session.user);
setEmail(session.user.email || '');

// Load profile data
const { data: profileData } = await supabase
.from("profiles")
.select("*")
.eq("id", session.user.id)
.single();

if (profileData) {
setFullName(profileData.full_name || '');
setSubscriptionStatus(profileData.subscription_status || 'free');
}


// Load bookmarks
const { data: bookmarkData } = await supabase
.from("bookmarks")
.select("*")
.eq("user_id", session.user.id)
.order("created_at", { ascending: false }); // Most recent first

if (bookmarkData && bookmarkData.length > 0) {
setBookmarks(bookmarkData);
}
// Load newsletter preferences
const { data: newsletterData } = await supabase
.from("newsletter_subscribers")
.select("*")
.eq("email", session.user.email)
.single();

if (newsletterData) {
setNewsletters({
daily: newsletterData.daily_newsletter || false,
weekly: newsletterData.weekly_newsletter || false,
breaking: newsletterData.breaking_news || false,
politics: newsletterData.politics_newsletter || false,
tech: newsletterData.tech_newsletter || false
});
}

setIsLoading(false);
};

loadProfile();

const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
if (!session) {
router.push('/login');
}
});

return () => {
mounted = false;
subscription.unsubscribe();
};
}, [router]);

const handleUpdateProfile = async () => {
if (!user) return;
setIsSaving(true);

try {
const { error } = await supabase
.from('profiles')
.update({ full_name: fullName })
.eq('id', user.id);

if (error) throw error;
toast.success('Profile updated successfully!');
} catch (error: any) {
toast.error(`Failed to update profile: ${error.message}`);
} finally {
setIsSaving(false);
}
};

const handleRemoveBookmark = async (bookmarkId: string) => {
try {
const { error } = await supabase
.from('bookmarks')
.delete()
.eq('id', bookmarkId);

if (error) throw error;

setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
toast.success('Bookmark removed');
} catch (error: any) {
toast.error('Failed to remove bookmark');
}
};


const handleUpdateNewsletters = async () => {
if (!user) return;
setIsSaving(true);

try {
const { error } = await supabase
.from('newsletter_subscribers')
.upsert({
email: email,
subscribed: true,
daily_newsletter: newsletters.daily,
weekly_newsletter: newsletters.weekly,
breaking_news: newsletters.breaking,
politics_newsletter: newsletters.politics,
tech_newsletter: newsletters.tech
});

if (error) throw error;
toast.success('Newsletter preferences updated!');
} catch (error: any) {
toast.error(`Failed to update: ${error.message}`);
} finally {
setIsSaving(false);
}
};

const handleUpdateCookies = () => {
localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));
toast.success('Cookie preferences saved!');
};

useEffect(() => {
  // Check for tab parameter in URL
  const tabParam = searchParams?.get('tab');
  if (tabParam && ['account', 'newsletters', 'notifications', 'cookies', 'comments', 'saved'].includes(tabParam)) {
    setActiveTab(tabParam);
  }
}, [searchParams]);


const tabs = [
{ id: 'account', label: 'Account Settings', icon: <User className="w-5 h-5" /> },
{ id: 'newsletters', label: 'Newsletters', icon: <Mail className="w-5 h-5" /> },
{ id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
{ id: 'cookies', label: 'Cookie Preferences', icon: <Cookie className="w-5 h-5" /> },
{ id: 'comments', label: 'My Comments', icon: <MessageSquare className="w-5 h-5" /> },
{ id: 'saved', label: 'Saved Articles', icon: <Bookmark className="w-5 h-5" /> }
];

if (isLoading) {
return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
<Loader className="w-8 h-8 animate-spin text-blue-600" />
</div>
);
}

return (
<>
<Navbar/>

<div className="min-h-screen bg-gray-100">
<Toaster position="top-center" />

{/* Header */}
<div className="bg-linear-to-br from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl">
<div className="container mx-auto px-4 py-12">
<div className="flex flex-col items-center justify-center space-y-4">
{/* Avatar Placeholder - Add if you have user image */}
<div className="w-24 h-24 bg-blue-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
<svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
</svg>
</div>

<div className="text-center">
<h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent">
My Profile
</h1>
<p className="text-lg font-semibold text-blue-100">{fullName}</p>
<p className="text-blue-200 flex items-center justify-center gap-2 mt-1">
<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
</svg>
{email}
</p>
</div>
</div>
</div>
</div>


{/* Main Content */}
<div className="container mx-auto px-4 py-8">
<div className="max-w-6xl mx-auto">
<div className="grid lg:grid-cols-4 gap-6">

{/* Sidebar Navigation */}
<div className="lg:col-span-1">
<div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
<nav className="space-y-2">
{tabs.map((tab) => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
activeTab === tab.id
? 'bg-blue-900 text-white'
: 'text-gray-700 hover:bg-gray-100'
}`}>
{tab.icon}
<span className="font-medium">{tab.label}</span>
</button>
))}
</nav>
</div>
</div>

{/* Content Area */}
<div className="lg:col-span-3">
<div className="bg-white rounded-lg shadow-md p-8">

{/* Account Settings */}
{activeTab === 'account' && (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

<div className="space-y-6">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Full Name
</label>
<input
type="text"
value={fullName}
onChange={(e) => setFullName(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
/>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Email Address
</label>
<input
type="email"
value={email}
disabled
className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
/>
<p className="text-sm text-gray-500 mt-1">Email cannot be changed from profile</p>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
Subscription Status
</label>
<div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
<span className="text-gray-900 font-semibold capitalize">{subscriptionStatus}</span>
{subscriptionStatus === 'free' && (
<p className="text-sm text-gray-600 mt-1">
<a href="/membership" className="text-blue-600 hover:text-blue-800">Upgrade to Premium</a>
</p>
)}
</div>
</div>

<button
onClick={handleUpdateProfile}
disabled={isSaving}
className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 cursor-pointer ${
isSaving
? 'bg-gray-400 cursor-not-allowed'
: 'bg-blue-900 hover:bg-blue-800 text-white'
}`}>
{isSaving ? (
<>
<Loader className="w-4 h-4 animate-spin" />
Saving...
</>
) : (
<>
<Save className="w-4 h-4" />
Save Changes
</>
)}
</button>
</div>
</div>
)}

{/* Newsletter Preferences */}
{activeTab === 'newsletters' && (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Newsletter Preferences</h2>
<p className="text-gray-600 mb-6">Choose which newsletters you'd like to receive</p>

<div className="space-y-4">
<div className="flex items-start">
<input
type="checkbox"
checked={newsletters.daily}
onChange={(e) => setNewsletters({...newsletters, daily: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
/>
<div className="ml-3">
<label className="font-semibold text-gray-900">Daily Briefing</label>
<p className="text-sm text-gray-600">Get our top stories every morning</p>
</div>
</div>

<div className="flex items-start">
<input
type="checkbox"
checked={newsletters.weekly}
onChange={(e) => setNewsletters({...newsletters, weekly: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
/>
<div className="ml-3">
<label className="font-semibold text-gray-900">Weekly Analysis</label>
<p className="text-sm text-gray-600">In-depth analysis every Sunday</p>
</div>
</div>

<div className="flex items-start">
<input
type="checkbox"
checked={newsletters.breaking}
onChange={(e) => setNewsletters({...newsletters, breaking: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
/>
<div className="ml-3">
<label className="font-semibold text-gray-900">Breaking News Alerts</label>
<p className="text-sm text-gray-600">Major news as it happens</p>
</div>
</div>

<div className="flex items-start">
<input
type="checkbox"
checked={newsletters.politics}
onChange={(e) => setNewsletters({...newsletters, politics: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
/>
<div className="ml-3">
<label className="font-semibold text-gray-900">Politics Newsletter</label>
<p className="text-sm text-gray-600">Weekly political coverage and analysis</p>
</div>
</div>

<div className="flex items-start">
<input
type="checkbox"
checked={newsletters.tech}
onChange={(e) => setNewsletters({...newsletters, tech: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
/>
<div className="ml-3">
<label className="font-semibold text-gray-900">Tech Newsletter</label>
<p className="text-sm text-gray-600">Latest in technology and innovation</p>
</div>
</div>

<button
onClick={handleUpdateNewsletters}
disabled={isSaving}
className={`mt-4 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${
isSaving
? 'bg-gray-400 cursor-not-allowed'
: 'bg-blue-900 hover:bg-blue-800 text-white cursor-pointer'
}`}>
{isSaving ? (
<>
<Loader className="w-4 h-4 animate-spin" />
Saving...
</>
) : (
<>
<Save className="w-4 h-4" />
Save Preferences
</>
)}
</button>
</div>
</div>
)}

{/* Notification Preferences */}
{activeTab === 'notifications' && (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
<p className="text-gray-600 mb-6">Manage your notification settings</p>

<div className="space-y-4">
<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
<div>
<label className="font-semibold text-gray-900">Comment Replies</label>
<p className="text-sm text-gray-600">Get notified when someone replies to your comments</p>
</div>
<input
type="checkbox"
checked={notifications.commentReplies}
onChange={(e) => setNotifications({...notifications, commentReplies: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
<div>
<label className="font-semibold text-gray-900">Breaking News</label>
<p className="text-sm text-gray-600">Push notifications for breaking news</p>
</div>
<input
type="checkbox"
checked={notifications.breakingNews}
onChange={(e) => setNotifications({...notifications, breakingNews: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
<div>
<label className="font-semibold text-gray-900">Weekly Digest</label>
<p className="text-sm text-gray-600">Summary of your activity and trending stories</p>
</div>
<input
type="checkbox"
checked={notifications.weeklyDigest}
onChange={(e) => setNotifications({...notifications, weeklyDigest: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
<div>
<label className="font-semibold text-gray-900">Product Updates</label>
<p className="text-sm text-gray-600">New features and improvements</p>
</div>
<input
type="checkbox"
checked={notifications.productUpdates}
onChange={(e) => setNotifications({...notifications, productUpdates: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>
</div>
</div>
)}

{/* Cookie Preferences */}
{activeTab === 'cookies' && (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Cookie Preferences</h2>
<p className="text-gray-600 mb-6">Manage how we use cookies on your device</p>

<div className="space-y-4">
<div className="p-4 bg-gray-100 rounded-lg border-l-4 border-gray-500">
<div className="flex items-center justify-between mb-2">
<label className="font-semibold text-gray-900">Strictly Necessary Cookies</label>
<span className="px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-bold">REQUIRED</span>
</div>
<p className="text-sm text-gray-600">Essential for the website to function properly. Cannot be disabled.</p>
</div>

<div className="p-4 bg-gray-50 rounded-lg">
<div className="flex items-center justify-between mb-2">
<label className="font-semibold text-gray-900">Analytics Cookies</label>
<input
type="checkbox"
checked={cookieSettings.analytics}
onChange={(e) => setCookieSettings({...cookieSettings, analytics: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>
<p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
</div>

<div className="p-4 bg-gray-50 rounded-lg">
<div className="flex items-center justify-between mb-2">
<label className="font-semibold text-gray-900">Marketing Cookies</label>
<input
type="checkbox"
checked={cookieSettings.marketing}
onChange={(e) => setCookieSettings({...cookieSettings, marketing: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>
<p className="text-sm text-gray-600">Used to deliver personalized advertisements</p>
</div>

<div className="p-4 bg-gray-50 rounded-lg">
<div className="flex items-center justify-between mb-2">
<label className="font-semibold text-gray-900">Functional Cookies</label>
<input
type="checkbox"
checked={cookieSettings.functional}
onChange={(e) => setCookieSettings({...cookieSettings, functional: e.target.checked})}
className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
/>
</div>
<p className="text-sm text-gray-600">Remember your preferences and enhance functionality</p>
</div>

<button
onClick={handleUpdateCookies}
className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2 cursor-pointer">
<Save className="w-4 h-4" />
Save Cookie Preferences
</button>

<p className="text-sm text-gray-600">
Learn more about our use of cookies in our{' '}
<a href="/cookie-policy" className="text-blue-600 hover:text-blue-800">Cookie Policy</a>
</p>
</div>
</div>
)}

{/* Comments */}
{activeTab === 'comments' && (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-6">My Comments</h2>
<div className="text-center py-12">
<MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
<p className="text-gray-600">Your comment history will appear here</p>
<p className="text-sm text-gray-500 mt-2">Start engaging with articles to see your comments</p>
</div>
</div>
)}

{/* Saved Articles */}
{activeTab === 'saved' && (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Articles</h2>
{bookmarks.length === 0 ? (
<div className="text-center py-12">
<Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4 " />
<p className="text-gray-600">No saved articles yet</p>
<p className="text-sm text-gray-500 mt-2">Bookmark articles to read them later</p>
</div>
) : (
<div className="space-y-4">
{bookmarks.map((bookmark) => (
<div key={bookmark.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
{bookmark.article_image && (
<img 
src={bookmark.article_image} 
alt={bookmark.article_title}
className="w-24 h-24 object-cover rounded"
/>
)}
<div className="flex-1">
<h3 className="font-bold text-gray-900 mb-2">
<a href={bookmark.article_url} className="hover:text-blue-600">
{bookmark.article_title}
</a>
</h3>
{bookmark.article_excerpt && (
<p className="text-sm text-gray-600 mb-2">{bookmark.article_excerpt}</p>
)}
<p className="text-xs text-gray-500">
Saved on {new Date(bookmark.created_at).toLocaleDateString()}
</p>
</div>
<button
onClick={() => handleRemoveBookmark(bookmark.id)}
className="text-red-600 hover:text-red-800 text-sm font-semibold cursor-pointer">
Remove
</button>
</div>
))}
</div>
)}
</div>
)}
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