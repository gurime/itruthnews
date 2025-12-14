'use client'
import { useState } from 'react';
import { Check, X, Shield, Zap, Users, Star, Crown, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';

export default function MembershipPage() {
const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
const [loading, setLoading] = useState(false);

const plans = {
premium: {
monthly: { price: 9.99, priceId: 'price_premium_monthly_xxxxx', status: 'monthly' },
yearly: { price: 99.99, priceId: 'price_premium_yearly_xxxxx', savings: '17% off', status: 'monthly' }
},
elite: {
monthly: { price: 19.99, priceId: 'price_elite_monthly_xxxxx', status: 'yearly' },
yearly: { price: 199.99, priceId: 'price_elite_yearly_xxxxx', savings: '17% off', status: 'yearly' }
}
};

const handleSubscribe = async (priceId: string, subscriptionStatus: string) => {
setLoading(true);

try {
const response = await fetch('/api/create-checkout-session', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ 
priceId,
subscriptionStatus // Pass the status to save in profiles table
}),
});

const { sessionId } = await response.json();
console.log('Checkout session created:', sessionId);
toast.success('This would redirect to Stripe Checkout.');
} catch (error) {
console.error('Error:', error);
toast.error('Something went wrong. Please try again.');
} finally {
setLoading(false);
}
};

const premiumPlan = plans.premium[billingPeriod];
const elitePlan = plans.elite[billingPeriod];

const premiumMonthly = billingPeriod === 'yearly' 
? (premiumPlan.price / 12).toFixed(2) 
: premiumPlan.price;

const eliteMonthly = billingPeriod === 'yearly' 
? (elitePlan.price / 12).toFixed(2) 
: elitePlan.price;

const freeTierFeatures = [
'Limited to 3 articles per day',
'Standard display advertising',
'Basic breaking news alerts',
'Access to homepage and section fronts',
'Limited mobile app features'
];

const premiumFeatures = [
'Unlimited articles across all sections',
'Ad-free reading on all devices',
'Full access to investigative journalism',
'Subscriber-only newsletters and briefings',
'Complete archive dating back 10+ years',
'Enhanced mobile and tablet app experience',
'Offline reading with save-for-later',
'Commenting privileges on articles'
];

const eliteFeatures = [
'Everything in Premium, plus:',
'Full access to iTruth Business & Markets',
'Real-time market data and analysis',
'Exclusive Business section reporting',
'Company profiles and earnings coverage',
'Interactive business news tools',
'Virtual events with journalists and experts',
'Gift up to 10 articles per month to non-subscribers',
'Discounted tickets to iTruth Live events',
'Early access to major investigations',
'Priority customer service'
];

return (
<>
<Navbar />
<Toaster position="top-center" />

<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-16 px-4">
<div className="max-w-7xl mx-auto">

{/* Hero Section */}
<div className="text-center mb-16">
<div className="inline-block mb-4">
<span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
Join 10,000+ Truth Seekers
</span>
</div>
<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
Support Independent<br />
<span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
Journalism
</span>
</h1>
<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
Choose the membership that fits your commitment to truth and transparency. 
Your support keeps our journalism free from corporate influence.
</p>
</div>

{/* Social Proof */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
<div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
<Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
<div className="text-3xl font-bold text-gray-900 mb-1">10,000+</div>
<div className="text-gray-600 text-sm">Active Members</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
<Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
<div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
<div className="text-gray-600 text-sm">Exclusive Reports</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
<Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
<div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
<div className="text-gray-600 text-sm">Independent</div>
</div>
</div>

{/* Billing Toggle */}
<div className="flex justify-center items-center gap-4 mb-10">
<span className={`text-lg font-semibold transition-colors ${billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-400'}`}>
Monthly
</span>
<button
onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
className="relative w-20 h-10 bg-gray-300 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer shadow-inner"
style={{ backgroundColor: billingPeriod === 'yearly' ? '#2563eb' : '#d1d5db' }}
>
<div
className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg transition-transform duration-300"
style={{ transform: billingPeriod === 'yearly' ? 'translateX(40px)' : 'translateX(0)' }}
/>
</button>
<span className={`text-lg font-semibold transition-colors ${billingPeriod === 'yearly' ? 'text-blue-600' : 'text-gray-400'}`}>
Yearly
</span>
{billingPeriod === 'yearly' && (
<span className="bg-linear-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md animate-pulse">
Save 17%
</span>
)}
</div>

{/* Pricing Cards */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

{/* Free Tier */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
<div className="p-8">
<div className="flex items-center gap-2 mb-2">
<Star className="w-6 h-6 text-gray-400" />
<h2 className="text-2xl font-bold text-gray-900">iTruth Reader</h2>
</div>
<div className="flex items-baseline gap-2 mb-6">
<span className="text-5xl font-bold text-gray-900">$0</span>
<span className="text-gray-500">/month</span>
</div>

<button
className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors duration-200 mb-6 cursor-pointer"
>
Current Plan
</button>

<div className="space-y-3">
<h3 className="font-semibold text-gray-700 text-sm mb-3">What's included:</h3>
{freeTierFeatures.map((feature, index) => (
<div key={index} className="flex items-start gap-3">
<X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
<span className="text-gray-600 text-sm">{feature}</span>
</div>
))}
</div>
</div>
</div>

{/* Premium Tier */}
<div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-500 hover:shadow-3xl transition-shadow lg:scale-105 relative">
<div className="absolute top-0 right-0 bg-linear-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
MOST POPULAR
</div>
<div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-8">
<div className="flex items-center gap-2 mb-3">
<Sparkles className="w-7 h-7 text-blue-100" />
<h2 className="text-3xl font-bold">iTruth Premium</h2>
</div>
<div className="flex items-baseline justify-center gap-2">
<span className="text-6xl font-bold">${premiumMonthly}</span>
<span className="text-xl text-blue-100">/month</span>
</div>
{billingPeriod === 'yearly' && (
<p className="text-blue-100 mt-3 text-sm text-center">
${premiumPlan.price} billed annually
</p>
)}
</div>

<div className="p-8">
<button
onClick={() => handleSubscribe(premiumPlan.priceId, premiumPlan.status)}
disabled={loading}
className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 mb-8 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
>
{loading ? 'Processing...' : 'Get Premium →'}
</button>

<div className="space-y-3">
<h3 className="font-semibold text-gray-700 text-sm mb-3">Everything included:</h3>
{premiumFeatures.map((feature, index) => (
<div key={index} className="flex items-start gap-3">
<div className="bg-green-100 rounded-full p-1 shrink-0">
<Check className="w-4 h-4 text-green-600" />
</div>
<span className="text-gray-700 text-sm">{feature}</span>
</div>
))}
</div>
</div>
</div>

{/* Elite Tier */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-300 hover:shadow-2xl transition-shadow relative">
<div className="absolute top-0 right-0 bg-linear-to-r from-amber-400 to-amber-500 text-gray-900 text-xs font-bold px-4 py-1 rounded-bl-lg">
ELITE ACCESS
</div>
<div className="bg-linear-to-br from-amber-500 to-amber-600 text-white p-8">
<div className="flex items-center gap-2 mb-3">
<Crown className="w-7 h-7 text-amber-100" />
<h2 className="text-3xl font-bold">iTruth Elite</h2>
</div>
<div className="flex items-baseline justify-center gap-2">
<span className="text-6xl font-bold">${eliteMonthly}</span>
<span className="text-xl text-amber-100">/month</span>
</div>
{billingPeriod === 'yearly' && (
<p className="text-amber-100 mt-3 text-sm text-center">
${elitePlan.price} billed annually
</p>
)}
</div>

<div className="p-8">
<button
onClick={() => handleSubscribe(elitePlan.priceId, elitePlan.status)}
disabled={loading}
className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 mb-8 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
>
{loading ? 'Processing...' : 'Get Elite →'}
</button>

<div className="space-y-3">
<h3 className="font-semibold text-gray-700 text-sm mb-3">Premium features plus:</h3>
{eliteFeatures.map((feature, index) => (
<div key={index} className="flex items-start gap-3">
<div className="bg-amber-100 rounded-full p-1 shrink-0">
<Check className="w-4 h-4 text-amber-600" />
</div>
<span className="text-gray-700 text-sm">{feature}</span>
</div>
))}
</div>
</div>
</div>
</div>

{/* Trust Indicators */}
<div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
<div>
<div className="text-3xl mb-2">🔒</div>
<p className="text-sm font-semibold text-gray-900 mb-1">Secure Payments</p>
<p className="text-xs text-gray-600">Protected by Stripe</p>
</div>
<div>
<div className="text-3xl mb-2">↩️</div>
<p className="text-sm font-semibold text-gray-900 mb-1">Money-Back Guarantee</p>
<p className="text-xs text-gray-600">30 days, no questions asked</p>
</div>
<div>
<div className="text-3xl mb-2">✓</div>
<p className="text-sm font-semibold text-gray-900 mb-1">Cancel Anytime</p>
<p className="text-xs text-gray-600">No hidden fees</p>
</div>
</div>
</div>

</div>
</div>

<Footer />
</>
);
}