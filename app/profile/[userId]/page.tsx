'use client'
import React, { useEffect, useState } from 'react'
import { User, Mail, Bell, Cookie, MessageSquare, Bookmark, Loader, Save, LogOut, Heart, Crown, Star, Sparkles, Shield } from 'lucide-react'
import supabase from '../../supabase/supabase'
import type { User as SupabaseUser } from "@supabase/supabase-js"
import toast, { Toaster } from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Image from 'next/image'
import Link from 'next/link'

// --- Types ---
interface BookmarkItem {
id: string
created_at: string
article_title: string
article_url: string
article_image?: string
article_excerpt?: string
user_id: string
}

interface NewsletterPrefs {
daily: boolean
weekly: boolean
breaking: boolean
politics: boolean
tech: boolean
}
interface Comment {
id: string
article_id: string
user_id: string
content: string
parent_comment_id: string | null
likes: number
created_at: string
updated_at: string
is_edited: boolean
article_url: string | null  // This can be null in your schema
article_title?: string | null  // Add this
article_image?: string | null  // Add this
}

// --- Component ---
export default function Profile() {
const router = useRouter()
const searchParams = useSearchParams()

// Loading & User State
const [isLoading, setIsLoading] = useState(true)
const [isInitialized, setIsInitialized] = useState(false); // ✅ Add this
const [isSaving, setIsSaving] = useState(false)
const [user, setUser] = useState<SupabaseUser | null>(null)
const [comments, setComments] = useState<Comment[]>([]);


// UI State
const [activeTab, setActiveTab] = useState('account')

// Data State
const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
const [fullName, setFullName] = useState('')
const [email, setEmail] = useState('')
const [role, setRole] = useState('')
const [subscriptionStatus, setSubscriptionStatus] = useState('free')
const getSubscriptionConfig = (status: string) => {
  const configs = {
    free: {
      name: 'iTruth Free',
      icon: <User className="w-5 h-5" />,
      bgGradient: 'from-gray-600 to-gray-700',
      ringColor: 'ring-gray-400',
      badgeColor: 'bg-gray-500',
      textColor: 'text-gray-700'
    },
    monthly: {
      name: 'iTruth Premium',
      icon: <Star className="w-5 h-5" />,
      bgGradient: 'from-blue-600 to-blue-700',
      ringColor: 'ring-blue-400',
      badgeColor: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    yearly: {
      name: 'iTruth Premium',
      icon: <Star className="w-5 h-5" />,
      bgGradient: 'from-blue-600 to-blue-700',
      ringColor: 'ring-blue-400',
      badgeColor: 'bg-blue-500',
      textColor: 'text-white'
    },
    premium: {
      name: 'iTruth Premium',
      icon: <Star className="w-5 h-5" />,
      bgGradient: 'from-blue-600 to-blue-700',
      ringColor: 'ring-blue-400',
      badgeColor: 'bg-blue-500',
      textColor: 'text-white'
    },
    premium_monthly: {
      name: 'iTruth Premium',
      icon: <Star className="w-5 h-5" />,
      bgGradient: 'from-blue-600 to-blue-700',
      ringColor: 'ring-blue-400',
      badgeColor: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    premium_yearly: {
      name: 'iTruth Premium',
      icon: <Star className="w-5 h-5" />,
      bgGradient: 'from-blue-600 to-blue-700',
      ringColor: 'ring-blue-400',
      badgeColor: 'bg-blue-500',
      textColor: 'text-white'
    }
  }
  
  return configs[status as keyof typeof configs] || configs.free
}

// Preferences State
const [newsletters, setNewsletters] = useState<NewsletterPrefs>({
daily: false,
weekly: false,
breaking: false,
politics: false,
tech: false
})

const [notifications, setNotifications] = useState({
commentReplies: true,
breakingNews: false,
weeklyDigest: true,
productUpdates: false
})

const [cookieSettings, setCookieSettings] = useState({
necessary: true,
analytics: true,
marketing: false,
functional: true,
performance: false,
personalization: false,
thirdParty: false,
version: 1
})

// Create a notifications table in Supabase first

// Then in your component:
useEffect(() => {
if (!user) return;

const channel = supabase
.channel('notifications')
.on(
'postgres_changes',
{
event: 'INSERT',
schema: 'public',
table: 'notifications',
filter: `user_id=eq.${user.id}`
},
(payload) => {
// Show toast notification
toast.success(payload.new.message)
// Or update a notifications dropdown
}
)
.subscribe()

return () => {
supabase.removeChannel(channel)
}
}, [user])

useEffect(() => {
if (!user?.id) return; // ✅ Check for user.id specifically

const channelName = `user-comments-${user.id}`; // ✅ Unique channel name

const channel = supabase
.channel(channelName)
.on(
'postgres_changes',
{
event: 'INSERT',
schema: 'public',
table: 'comments',
filter: `user_id=eq.${user.id}`
},
(payload) => {
setComments(prev => {
// ✅ Prevent duplicates
const exists = prev.some(c => c.id === payload.new.id);
if (exists) return prev;
return [payload.new as Comment, ...prev];
});
}
)
.subscribe((status) => {

});

return () => {
console.log('Cleaning up comments channel');
supabase.removeChannel(channel);
};
}, [user?.id]); // ✅ Only depend on user.id, not entire user object

useEffect(() => {
if (!user?.id) return;

let timeoutId: NodeJS.Timeout;

const channel = supabase
.channel(`cookie_preferences_${user.id}`)
.on(
'postgres_changes',
{
event: 'UPDATE',
schema: 'public',
table: 'cookie_preferences',
filter: `user_id=eq.${user.id}`,
},
payload => {
// ✅ Debounce state updates
clearTimeout(timeoutId);
timeoutId = setTimeout(() => {
setCookieSettings({
necessary: payload.new.necessary,
analytics: payload.new.analytics,
marketing: payload.new.marketing,
functional: payload.new.functional,
performance: payload.new.performance,
personalization: payload.new.personalization,
thirdParty: payload.new.third_party,
version: payload.new.version
});
}, 100);
}
)
.subscribe();

return () => {
clearTimeout(timeoutId);
supabase.removeChannel(channel);
};
}, [user?.id]);


// --- Data Loading ---
useEffect(() => {
if (isInitialized) return; // ✅ Prevent re-initialization
let mounted = true

const loadProfile = async () => {
try {
const { data: { session } } = await supabase.auth.getSession()

if (!session?.user) {
router.push('/login')
return
}

if(!mounted) return;

if (mounted) {
setIsInitialized(true); // ✅ Mark as initialized
setUser(session.user)
setEmail(session.user.email || '')
if (!mounted) return;

// In your useEffect, replace this section:
const [profileReq, bookmarkReq, newsletterReq, notificationReq, commentsReq,cookieReq] = await Promise.all([
supabase.from("profiles").select("*").eq("id", session.user.id).single(),
supabase.from("bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
supabase.from("newsletter_subscribers").select("*").eq("email", session.user.email).maybeSingle(),
supabase.from("notification_preferences").select("*").eq("user_id", session.user.id).maybeSingle(),
supabase.from("comments").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }) ,
supabase.from("cookie_preferences").select("*").eq("user_id", session.user.id).maybeSingle()  // Add this
// <-- new
])

if (commentsReq.data) {
setComments(commentsReq.data)
}



// Set Notification Preferences - UPDATE THIS
else {
// Create default preferences if none exist
const { error } = await supabase
.from('notification_preferences')
.insert({
user_id: session.user.id,
comment_replies: true,
breaking_news: false,
weekly_digest: true,
product_updates: false
})

if (error) console.error('Error creating default preferences:', error)
}

// Set Profile Data
if (profileReq.data) {
setFullName(profileReq.data.full_name || '')
setRole(profileReq.data.role || '')
setSubscriptionStatus(profileReq.data.subscription_status || 'free')
}

// Set Bookmarks
if (bookmarkReq.data) {
setBookmarks(bookmarkReq.data)
}

// Set Newsletters
if (newsletterReq.data) {
setNewsletters({
daily: newsletterReq.data.daily_newsletter || false,
weekly: newsletterReq.data.weekly_newsletter || false,
breaking: newsletterReq.data.breaking_news || false,
politics: newsletterReq.data.politics_newsletter || false,
tech: newsletterReq.data.tech_newsletter || false
})
}


if (cookieReq.data) {
setCookieSettings({
necessary: cookieReq.data.necessary,
analytics: cookieReq.data.analytics,
marketing: cookieReq.data.marketing,
functional: cookieReq.data.functional,
performance: cookieReq.data.performance,
personalization: cookieReq.data.personalization,
thirdParty: cookieReq.data.third_party,
version: cookieReq.data.version
})
}

// Set Notification Preferences - ADD THIS
if (notificationReq.data) {
setNotifications({
commentReplies: notificationReq.data.comment_replies,
breakingNews: notificationReq.data.breaking_news,
weeklyDigest: notificationReq.data.weekly_digest,
productUpdates: notificationReq.data.product_updates
})
}


}
} catch (error) {
console.error("Error loading profile:", error)
toast.error("Failed to load profile data")
} finally {
if (mounted) setIsLoading(false)
}
}

loadProfile()
}, [router, isInitialized])


// --- URL Tab Sync ---
useEffect(() => {
const tabParam = searchParams?.get('tab')
if (tabParam && ['account', 'newsletters', 'notifications', 'cookies', 'comments', 'saved'].includes(tabParam)) {
setActiveTab(tabParam)
}
}, [searchParams])

// --- Handlers ---
const handleUpdateProfile = async () => {
if (!user) return
setIsSaving(true)
try {
const { error } = await supabase
.from('profiles')
.update({ full_name: fullName })
.eq('id', user.id)

if (error) throw error
toast.success('Profile updated successfully!')
} catch (error: unknown) {
const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
toast.error(errorMessage);
} finally {
setIsSaving(false)
}
}
const handleUpdateNotifications = async () => {
if (!user) return
setIsSaving(true)
try {
const { error } = await supabase
.from('notification_preferences')
.upsert({
user_id: user.id,
comment_replies: notifications.commentReplies,
breaking_news: notifications.breakingNews,
weekly_digest: notifications.weeklyDigest,
product_updates: notifications.productUpdates
}, { onConflict: 'user_id' })

if (error) throw error
toast.success('Notification preferences saved!')
} catch (error) {
const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
toast.error(errorMessage);} 
finally {
setIsSaving(false)
}
}

const handleUpdateNewsletters = async () => {
if (!user) return
setIsSaving(true)
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
}, { onConflict: 'email' })  // Add this parameter

if (error) throw error
toast.success('Newsletter preferences updated!')
} catch (error: unknown) {
const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
toast.error(errorMessage);    
} 
finally {
setIsSaving(false)
}
}


const handleRemoveBookmark = async (bookmarkId: string) => {
// Optimistic UI update could happen here, but we'll wait for success for safety
try {
const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId)
if (error) throw error

setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
toast.success('Bookmark removed')
} catch (error: unknown) {
const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
toast.error(errorMessage);
}
}



// Save to database instead of localStorage
const handleUpdateCookies = async () => {
if (!user) return;
setIsSaving(true);

try {
const { error } = await supabase
.from('cookie_preferences')
.upsert({
user_id: user.id,
necessary: cookieSettings.necessary,
analytics: cookieSettings.analytics,
marketing: cookieSettings.marketing,
functional: cookieSettings.functional,
performance: cookieSettings.performance,
personalization: cookieSettings.personalization,
third_party: cookieSettings.thirdParty,
version: cookieSettings.version,
updated_at: new Date().toISOString()
}, { onConflict: 'user_id' });

if (error) throw error;

// Also save to localStorage as backup for immediate access
localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));

toast.success('Cookie preferences saved!');
} catch (error) {
const errorMessage = error instanceof Error ? error.message : 'Failed to save preferences';
toast.error(errorMessage);
} finally {
setIsSaving(false);
}
};
const handleLogout = async () => {
try {
const { error } = await supabase.auth.signOut();
if (error) throw error;

// Reset all user-related state


router.push('/');
} catch (error) {
console.error(error);
}
};

// --- Render Helpers ---

const renderContent = () => {
const subConfig = getSubscriptionConfig(subscriptionStatus)

switch (activeTab) {
case 'account':
return (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
<div className="space-y-6">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
<input
type="text"
value={fullName}
onChange={(e) => setFullName(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
/>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
<input 
type="email" 
value={email} 
disabled 
className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
/>
<p className="text-sm text-gray-500 mt-1">Email cannot be changed from profile.</p>
</div>

{/* Enhanced Subscription Display */}
<div>
<label className="block text-sm font-semibold text-gray-700 mb-3">Current Subscription</label>
<div className={`bg-linear-to-br ${
  subscriptionStatus !== 'free' && subscriptionStatus !== ''
    ? 'from-blue-900 via-blue-800 to-blue-900'
    : 'from-gray-700 via-gray-800 to-gray-900'
} text-white shadow-2xl relative overflow-hidden`}>
{/* Background gradient */}
<div className={`absolute inset-0 bg-linear-to-r ${subConfig.bgGradient} opacity-10`}></div>

<div className="relative p-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
{/* Tier Icon */}
<div className={`relative w-24 h-24 rounded-full border-4 ${
  subscriptionStatus !== 'free' ? 'border-blue-300 shadow-blue-500/50' : 'border-white'
} shadow-2xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br ${subConfig.bgGradient}`}>
{subConfig.icon}
</div>

<div>
<div className="flex items-center gap-2 mb-1">
<h3 className={`text-xl font-bold ${subConfig.textColor}`}>
{subConfig.name}
</h3>

</div>

<p className="text-sm text-gray-600">
  {subscriptionStatus === 'free' && 'Free tier - Upgrade to unlock all premium features'}
  {subscriptionStatus === 'monthly' && 'Monthly billing • Full access to all features'}
  {subscriptionStatus === 'yearly' && 'Yearly billing • Full access to all features'}
  {subscriptionStatus === 'premium' && 'Premium membership • Full access to all features'}
  {subscriptionStatus === 'premium_monthly' && 'Monthly billing • Full access to all features'}
  {subscriptionStatus === 'premium_yearly' && 'Yearly billing • Full access to all features'}
</p>
</div>
</div>

{/* Action Button */}
{subscriptionStatus === 'free' ? (
<Link
href="/membership"
className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
>
<Crown className="w-4 h-4" />
Upgrade Now
</Link>
) : (
<Link
href="/membership"
className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
>
Manage Plan
</Link>
)}
</div>

{/* Feature highlights for current tier */}
{subscriptionStatus !== 'free' && (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Active Benefits</p>
    <div className="grid grid-cols-2 gap-2">
      <span className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-500" /> Ad-free reading
      </span>
      <span className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-500" /> Exclusive newsletters
      </span>
      <span className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-500" /> Full archive access
      </span>
      <span className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-500" /> Comment privileges
      </span>
      <span className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-500" /> Audio articles
      </span>
      <span className="text-xs text-gray-600 flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-500" /> Priority support
      </span>
    </div>
  </div>
)}
</div>
</div>
</div>

<div className="flex justify-between items-center pt-4">
<button
onClick={handleUpdateProfile}
disabled={isSaving}
className="px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
>
{isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
Save Changes
</button>
<button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center gap-2 font-medium cursor-pointer">
<LogOut className="w-4 h-4" /> Sign Out
</button>
</div>
</div>
</div>
)

case 'newsletters':
return (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Newsletter Preferences</h2>
<p className="text-gray-600 mb-6">Choose which newsletters you&apos;d like to receive</p>
<div className="space-y-4">
{[
{ key: 'daily', label: 'Daily Briefing', desc: 'Get our top stories every morning' },
{ key: 'weekly', label: 'Weekly Analysis', desc: 'In-depth analysis every Sunday' },
{ key: 'breaking', label: 'Breaking News', desc: 'Major news as it happens' },
{ key: 'politics', label: 'Politics', desc: 'Weekly political coverage' },
{ key: 'tech', label: 'Technology', desc: 'Latest in tech and innovation' },
].map((item) => (
<div key={item.key} className="flex items-start">
<input
type="checkbox"
checked={newsletters[item.key as keyof NewsletterPrefs]}
onChange={(e) => setNewsletters({ ...newsletters, [item.key]: e.target.checked })}
className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5 cursor-pointer"
/>
<div className="ml-3">
<label className="font-semibold text-gray-900 block">{item.label}</label>
<span className="text-sm text-gray-600">{item.desc}</span>
</div>
</div>
))}
<button
onClick={handleUpdateNewsletters}
disabled={isSaving}
className="mt-6 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white disabled:bg-gray-400"
>
{isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
Save Preferences
</button>
</div>
</div>
)

case 'notifications':
return (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
<p className="text-gray-600 mb-6">Manage your notification settings</p>
<div className="space-y-4">
{[
{ label: 'Comment Replies', desc: 'Notify when someone replies to me', state: notifications.commentReplies, key: 'commentReplies' },
{ label: 'Breaking News', desc: 'Push notifications for breaking news', state: notifications.breakingNews, key: 'breakingNews' },
{ label: 'Weekly Digest', desc: 'Summary of activity', state: notifications.weeklyDigest, key: 'weeklyDigest' },
{ label: 'Product Updates', desc: 'New features and improvements', state: notifications.productUpdates, key: 'productUpdates' },
].map((item) => (
<div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
<div>
<label className="font-semibold text-gray-900 block">{item.label}</label>
<p className="text-sm text-gray-600">{item.desc}</p>
</div>
<input
type="checkbox"
checked={item.state}
onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
/>
</div>

))}
<button
onClick={handleUpdateNotifications}
disabled={isSaving}
className="mt-6 px-6 py-3 rounded-lg font-bold bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-2"
>
{isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
Save Preferences
</button>

</div>
</div>
)
case 'cookies':
return (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Cookie Preferences</h2>
<p className="text-gray-600 mb-6">Manage how we use cookies on your device</p>

<div className="space-y-4">

{/* Strictly Necessary */}
<div className="p-4 bg-gray-100 rounded-lg border-l-4 border-gray-500">
<div className="flex items-center justify-between mb-2">
<label className="font-semibold text-gray-900">Strictly Necessary</label>
<span className="px-2 py-0.5 bg-gray-600 text-white rounded text-xs font-bold">REQUIRED</span>
</div>
<p className="text-sm text-gray-600">Essential for the website to function.</p>
</div>

{/* Analytics */}
<div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
<div>
<label className="font-semibold text-gray-900 block">Analytics Cookies</label>
<p className="text-sm text-gray-600">Help us understand how visitors interact.</p>
</div>
<input
type="checkbox"
checked={cookieSettings.analytics}
onChange={e =>
setCookieSettings({ ...cookieSettings, analytics: e.target.checked })
}
className="w-5 h-5 text-blue-600 rounded"
/>
</div>

{/* Functional */}
<div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
<div>
<label className="font-semibold text-gray-900 block">Functional Cookies</label>
<p className="text-sm text-gray-600">Enable enhanced features and remember preferences.</p>
</div>
<input
type="checkbox"
checked={cookieSettings.functional}
onChange={e =>
setCookieSettings({ ...cookieSettings, functional: e.target.checked })
}
className="w-5 h-5 text-blue-600 rounded"
/>
</div>

{/* Performance */}
<div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
<div>
<label className="font-semibold text-gray-900 block">Performance Cookies</label>
<p className="text-sm text-gray-600">Improve site speed and monitor technical performance.</p>
</div>
<input
type="checkbox"
checked={cookieSettings.performance}
onChange={e =>
setCookieSettings({ ...cookieSettings, performance: e.target.checked })
}
className="w-5 h-5 text-blue-600 rounded"
/>
</div>

{/* Personalization */}
<div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
<div>
<label className="font-semibold text-gray-900 block">Personalization Cookies</label>
<p className="text-sm text-gray-600">Customize content and show relevant listings.</p>
</div>
<input
type="checkbox"
checked={cookieSettings.personalization}
onChange={e =>
setCookieSettings({ ...cookieSettings, personalization: e.target.checked })
}
className="w-5 h-5 text-blue-600 rounded"
/>
</div>

{/* Marketing */}
<div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
<div>
<label className="font-semibold text-gray-900 block">Marketing Cookies</label>
<p className="text-sm text-gray-600">Used to deliver personalized ads and measure ad performance.</p>
</div>
<input
type="checkbox"
checked={cookieSettings.marketing}
onChange={e =>
setCookieSettings({ ...cookieSettings, marketing: e.target.checked })
}
className="w-5 h-5 text-blue-600 rounded"
/>
</div>

{/* Third-Party */}
<div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
<div>
<label className="font-semibold text-gray-900 block">Third-Party Cookies</label>
<p className="text-sm text-gray-600">Required for maps, chat support, and embedded services.</p>
</div>
<input
type="checkbox"
checked={cookieSettings.thirdParty}
onChange={e =>
setCookieSettings({ ...cookieSettings, thirdParty: e.target.checked })
}
className="w-5 h-5 text-blue-600 rounded"
/>
</div>

{/* Save Button */}
<button
onClick={handleUpdateCookies}
disabled={isSaving || !cookieSettings}  // Add this check
className="mt-4 px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 flex items-center gap-2"
>
<Save className="w-4 h-4" /> Save Cookie Preferences
</button>
</div>
</div>
);


case 'saved':
return (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Articles</h2>
{bookmarks.length === 0 ? (
<div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
<Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<p className="text-gray-600 font-medium">No saved articles yet</p>
<p className="text-sm text-gray-500 mt-2">Bookmark articles to read them later</p>
</div>
) : (
<div className="space-y-4">
{bookmarks.map((bookmark) => (
<div key={bookmark.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
{bookmark.article_image && (
<div className="shrink-0">
<Image 
src={bookmark.article_image} 
alt={bookmark.article_title}
width={96}
height={96}
className="w-24 h-24 object-cover rounded-md"
/>
</div>
)}
<div className="flex-1 min-w-0">
<h3 className="font-bold text-gray-900 mb-1 truncate">
<a href={bookmark.article_url} className="hover:text-blue-600 transition-colors">
{bookmark.article_title}
</a>
</h3>
{bookmark.article_excerpt && (
<p className="text-sm text-gray-600 mb-2 line-clamp-2">{bookmark.article_excerpt}</p>
)}
<p className="text-xs text-gray-400">
Saved on {new Date(bookmark.created_at).toLocaleDateString()}
</p>
</div>
<button
onClick={() => handleRemoveBookmark(bookmark.id)}
className="text-red-500 hover:text-red-700 text-sm font-semibold whitespace-nowrap self-start"
>
Remove
</button>
</div>
))}
</div>
)}
</div>
)

case 'comments':
return (
<div>
<h2 className="text-2xl font-bold text-gray-900 mb-6">My Comments</h2>
{comments.length === 0 ? (
<div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
<MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<p className="text-gray-600 font-medium">No comments yet</p>
<p className="text-sm text-gray-500 mt-2">Start engaging with articles to see your history.</p>
</div>
) : (
<div className="space-y-4">
{comments.map((comment) => (
<div 
key={comment.id} 
className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
>
{/* Article Image */}
{comment.article_image && (
<div className="shrink-0">
<Image 
src={comment.article_image} 
alt={comment.article_title || 'Article'}
width={96}
height={96}
className="w-24 h-24 object-cover rounded-md"
/>
</div>
)}

{/* Content */}
<div className="flex-1 min-w-0">
{/* Article Title */}
{comment.article_title && (
<h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
{comment.article_url ? (
<Link 
href={comment.article_url}
className="hover:text-blue-600 transition-colors"
>
{comment.article_title}
</Link>
) : (
comment.article_title
)}
</h3>
)}

{/* Comment Content */}
<div className="bg-white p-3 rounded-md border border-gray-200 mb-2">
<p className="text-gray-800 text-sm line-clamp-3">
{comment.content}
</p>
</div>

{/* Meta Info */}
<div className="flex items-center gap-4 text-xs text-gray-500">
<span className="flex items-center gap-1">
<Heart className="w-3 h-3" />
{comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
</span>
<span>
Posted on {new Date(comment.created_at).toLocaleDateString('en-US', {
month: 'short',
day: 'numeric',
year: 'numeric'
})}
</span>
{comment.is_edited && (
<span className="text-gray-400">(edited)</span>
)}
</div>
</div>

{/* View Article Button */}
{comment.article_url && (
<Link
href={comment.article_url}
className="shrink-0 self-start px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
>
View Article
</Link>
)}
</div>
))}
</div>
)}
</div>
)

}
}

// --- Main Render ---
if (isLoading) {
return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
<Loader className="w-10 h-10 animate-spin text-blue-900" />
</div>
)
}

const tabs = [
{ id: 'account', label: 'Account Settings', icon: <User className="w-5 h-5" /> },
{ id: 'newsletters', label: 'Newsletters', icon: <Mail className="w-5 h-5" /> },
{ id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
{ id: 'cookies', label: 'Cookie Preferences', icon: <Cookie className="w-5 h-5" /> },
{ id: 'comments', label: 'My Comments', icon: <MessageSquare className="w-5 h-5" /> },
{ id: 'saved', label: 'Saved Articles', icon: <Bookmark className="w-5 h-5" /> }
]
const subConfig = getSubscriptionConfig(subscriptionStatus)

return (
<>
<Navbar />
<div className="min-h-screen bg-gray-100">
<Toaster position="top-center" />

{/* Enhanced Header with Tier-specific styling */}
<div className={`bg-linear-to-br ${
subscriptionStatus.includes('premium') ? 'from-amber-600 via-yellow-600 to-amber-700' 
: subscriptionStatus !== 'free'
? 'from-blue-900 via-blue-800 to-blue-900'
: 'from-gray-700 via-gray-800 to-gray-900'
} text-white shadow-2xl relative overflow-hidden`}>

{/* Decorative background pattern */}
<div className="absolute inset-0 opacity-10">
<div className="absolute inset-0" style={{
backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
backgroundSize: '40px 40px'
}}></div>
</div>

<div className="container mx-auto px-4 py-12 relative z-10">
<div className="flex flex-col items-center justify-center space-y-4">
{/* Avatar with tier-specific styling */}
<div className={`relative w-24 h-24 rounded-full border-4 ${
subscriptionStatus.includes('premium') ? 'border-amber-300 shadow-amber-500/50' :
subscriptionStatus !== 'free' ? 'border-blue-300 shadow-blue-500/50' :
'border-white'
} shadow-2xl flex items-center justify-center text-2xl font-bold bg-linear-to-br ${subConfig.bgGradient}`}>
{fullName ? fullName.charAt(0).toUpperCase() : <User />}

{/* Tier badge */}
{subscriptionStatus !== 'free' && (
<div className={`absolute -bottom-2 -right-2 ${subConfig.badgeColor} rounded-full p-2 border-2 border-white shadow-lg`}>
{subConfig.icon}
</div>
)}
</div>

<div className="text-center">
<h1 className="text-4xl font-bold mb-2 text-white">My Profile</h1>
<p className="text-lg font-medium text-white">{fullName}</p>
<p className="text-white/90 font-semibold text-sm mt-1">{email}</p>

{/* Tier badge */}
<div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
{subConfig.icon}
<span className="font-bold text-sm">{subConfig.name}</span>
{role === 'admin' && (
<>
<span className="text-white/50">•</span>
<span className="font-bold text-sm">Admin</span>
</>
)}
</div>
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
<div className="bg-white rounded-xl shadow-sm p-3 sticky top-24">
<nav className="space-y-1">
{tabs.map((tab) => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-medium ${
activeTab === tab.id
? subscriptionStatus.includes('premium')
? 'bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-100'
: 'bg-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-100'
: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}`}
>
<span className={
activeTab === tab.id 
? subscriptionStatus.includes('premium') 
? 'text-amber-600' 
: 'text-blue-600'
: 'text-gray-400'
}>
{tab.icon}
</span>
{tab.label}
</button>
))}
</nav>
</div>
</div>

{/* Content Area */}
<div className="lg:col-span-3">
<div className="bg-white rounded-xl shadow-sm p-8 min-h-[500px]">
{renderContent()}
</div>
</div>

</div>
</div>
</div>
</div>
<Footer />
</>
)
}