'use client';

import { useState } from 'react';
import {
Check,
X,
Shield,
Zap,
Users,
Star,
Sparkles,
FileText,
Gift,
TrendingUp,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';

type BillingPeriod = 'monthly' | 'yearly';

type IconName = 'FileText' | 'Star' | 'TrendingUp' | 'Users' | 'Gift';

type FeatureGroup = {
icon: IconName;
label: string;
shortLabel?: string;
features: string[];
showByDefault?: boolean;
};

type PlanDefinition = {
id: 'free' | 'premium';
name: string;
description: string;
badge?: string;
recommended?: boolean;
themeColor: 'gray' | 'blue';
billing: {
monthly: {
price: number;
priceId?: string;
status: string;
};
yearly?: {
price: number;
priceId?: string;
status: string;
savings?: string;
};
};
featureGroups: FeatureGroup[];
};

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
FileText,
Star,
TrendingUp,
Users,
Gift,
};

const plans: PlanDefinition[] = [
{
id: 'free',
name: 'iTruth Free',
description: 'Essential access for readers who want to stay informed.',
themeColor: 'gray',
billing: {
monthly: {
price: 0,
status: 'free',
},
},
featureGroups: [
{
icon: 'FileText',
label: 'Core access',
shortLabel: 'Core access',
showByDefault: true,
features: [
'Access to all public articles and reporting',
'Essential breaking news alerts',
],
},
{
icon: 'Star',
label: 'Reading experience',
shortLabel: 'Experience',
showByDefault: true,
features: [
'Standard on-site advertising',
'Save up to 10 articles per month',
],
},
],
},
{
id: 'premium',
name: 'iTruth Premium',
description: 'For readers who want the full, independent iTruth experience.',
badge: 'RECOMMENDED',
recommended: true,
themeColor: 'blue',
billing: {
monthly: {
price: 9.99,
priceId: 'price_premium_monthly_xxxxx',
status: 'premium_monthly',
},
yearly: {
price: 99.99,
priceId: 'price_premium_yearly_xxxxx',
status: 'premium_yearly',
savings: '17% off',
},
},
featureGroups: [
{
icon: 'Star',
label: 'Reading experience',
shortLabel: 'Experience',
showByDefault: true,
features: [
'Ad-free reading on all devices',
'Offline reading with unlimited saves',
'Audio versions of articles',
'Enhanced sharing with rich previews',
],
},
{
icon: 'FileText',
label: 'Exclusive content',
shortLabel: 'Content',
showByDefault: true,
features: [
'Subscriber-only newsletters and briefings',
'Complete archive dating back 10+ years',
'Exclusive deep-dive reports and whitepapers',
'Early access to major investigations',
],
},
{
icon: 'TrendingUp',
label: 'Business & markets',
shortLabel: 'Markets',
showByDefault: false,
features: [
'Full access to iTruth Business & Markets',
'Real-time market data and analysis',
'Daily Market Briefings',
'Company profiles and earnings coverage',
],
},
{
icon: 'Users',
label: 'Community & interaction',
shortLabel: 'Community',
showByDefault: false,
features: [
'Commenting privileges on articles',
'Monthly Q&A sessions with editors',
'Direct messaging with select journalists',
'Virtual events with journalists and experts',
],
},
{
icon: 'Gift',
label: 'Perks & alerts',
shortLabel: 'Perks',
showByDefault: false,
features: [
'Discounted tickets to iTruth Live events',
'Priority customer support',
'Custom news alerts on companies and topics',
],
},
],
},
];

export default function MembershipPage() {
const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
const [loading, setLoading] = useState(false);
const [showAllPremiumFeatures, setShowAllPremiumFeatures] = useState(false);

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
subscriptionStatus,
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

const freePlan = plans.find((p) => p.id === 'free')!;
const premiumPlan = plans.find((p) => p.id === 'premium')!;

const premiumBilling =
billingPeriod === 'yearly' && premiumPlan.billing.yearly
? premiumPlan.billing.yearly
: premiumPlan.billing.monthly;

const premiumMonthlyDisplay =
billingPeriod === 'yearly' && premiumPlan.billing.yearly
? (premiumPlan.billing.yearly.price / 12).toFixed(2)
: premiumBilling.price.toFixed(2);

const allGroups = Array.from(
new Set(
plans.flatMap((plan) =>
plan.featureGroups.map((g) => g.shortLabel || g.label),
),
),
);

const hasFeature = (planId: string, groupLabel: string) => {
const plan = plans.find((p) => p.id === planId);
if (!plan) return false;
return plan.featureGroups.some(
(g) => (g.shortLabel || g.label) === groupLabel,
);
};

const FreeFeatures = () => (
<div className="space-y-4">
<h3 className="font-semibold text-gray-700 text-sm">What’s included:</h3>
<div className="space-y-3">
{freePlan.featureGroups.map((group) => {
const IconComponent = iconMap[group.icon];
return (
<div key={group.label}>
<div className="flex items-center gap-2 mb-1">
<div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 hover:scale-110">
<IconComponent className="w-4 h-4 text-gray-500" />
</div>
<span className="font-medium text-gray-800 text-xs md:text-sm">
{group.label}
</span>
</div>
<div className="space-y-1 pl-9">
{group.features.map((feature, idx) => (
<div
key={idx}
className="flex items-start gap-2 transition-transform duration-200 hover:translate-x-1"
>
<Check className="w-3 h-3 text-gray-400 mt-0.5" />
<span className="text-gray-600 text-xs md:text-sm">
{feature}
</span>
</div>
))}
</div>
</div>
);
})}
</div>
</div>
);

const PremiumFeatures = () => {
const visibleGroups = premiumPlan.featureGroups.filter(
(g) => g.showByDefault || showAllPremiumFeatures,
);
const hasHiddenGroups = premiumPlan.featureGroups.some(
(g) => !g.showByDefault,
);

return (
<div className="space-y-4">
<h3 className="font-semibold text-gray-700 text-sm">
Everything included:
</h3>

<div className="space-y-4">
{visibleGroups.map((group) => {
const IconComponent = iconMap[group.icon];
return (
<details
key={group.label}
className="group rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-300"
open={group.showByDefault}
>
<summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors duration-200 group-hover:bg-gray-100">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
<IconComponent className="w-4 h-4 text-blue-600" />
</div>
<span className="font-medium text-gray-900 text-sm">
{group.label}
</span>
</div>

<span className="text-xs text-gray-500 transition-opacity duration-200 group-open:opacity-0">
Show
</span>
<span className="text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-open:opacity-100">
Hide
</span>
</summary>

<div className="px-4 pb-4 pt-1 space-y-2">
{group.features.map((feature, idx) => (
<div
key={idx}
className="flex items-start gap-2 transition-transform duration-200 hover:translate-x-1"
>
<div className="bg-green-100 rounded-full p-1 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
<Check className="w-3 h-3 text-green-600" />
</div>
<span className="text-gray-700 text-xs md:text-sm">
{feature}
</span>
</div>
))}
</div>
</details>
);
})}
</div>

{hasHiddenGroups && (
<button
type="button"
onClick={() => setShowAllPremiumFeatures((prev) => !prev)}
className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
>
{showAllPremiumFeatures ? 'Show fewer features' : 'Show all features'}
</button>
)}
</div>
);
};

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
Support Independent
<br />
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
<div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
<Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
<div className="text-3xl font-bold text-gray-900 mb-1">10,000+</div>
<div className="text-gray-600 text-sm">Active Members</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
<Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
<div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
<div className="text-gray-600 text-sm">Exclusive Reports</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
<Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
<div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
<div className="text-gray-600 text-sm">Independent</div>
</div>
</div>

{/* Billing Toggle */}
<div className="flex justify-center items-center gap-4 mb-10">
<span
className={`text-lg font-semibold transition-colors ${
billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-400'
}`}
>
Monthly
</span>
<button
onClick={() =>
setBillingPeriod(
billingPeriod === 'monthly' ? 'yearly' : 'monthly',
)
}
className="relative w-20 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer shadow-inner group hover:shadow-md"
style={{
backgroundColor:
billingPeriod === 'yearly' ? '#2563eb' : '#d1d5db',
}}
>
<div
className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg transition-transform duration-300 ease-out group-hover:scale-105"
style={{
transform:
billingPeriod === 'yearly'
? 'translateX(40px)'
: 'translateX(0)',
}}
/>
</button>
<span
className={`text-lg font-semibold transition-colors ${
billingPeriod === 'yearly' ? 'text-blue-600' : 'text-gray-400'
}`}
>
Yearly
</span>
{billingPeriod === 'yearly' && premiumPlan.billing.yearly && (
<span className="bg-linear-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md animate-pulse">
{premiumPlan.billing.yearly.savings || 'Save 17%'}
</span>
)}
</div>

{/* Pricing Cards */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
{/* Free Tier */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
<div className="p-8">
<div className="flex items-center gap-2 mb-2">
<Star className="w-6 h-6 text-gray-400" />
<h2 className="text-2xl font-bold text-gray-900">
{freePlan.name}
</h2>
</div>
<p className="text-sm text-gray-600 mb-4">
{freePlan.description}
</p>
<div className="flex items-baseline gap-2 mb-6">
<span className="text-5xl font-bold text-gray-900">$0</span>
<span className="text-gray-500">/month</span>
</div>

<button
className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 mb-6 cursor-pointer"
>
Current Plan
</button>

<FreeFeatures />
</div>
</div>

{/* Premium Tier */}
<div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-500 transition-all duration-300 hover:shadow-3xl hover:-translate-y-1.5 lg:scale-105 relative">
{premiumPlan.badge && (
<div className="absolute top-0 right-0 bg-linear-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg animate-pulse">
{premiumPlan.badge}
</div>
)}
<div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-8">
<div className="flex items-center gap-2 mb-3">
<Sparkles className="w-7 h-7 text-blue-100" />
<h2 className="text-3xl font-bold">{premiumPlan.name}</h2>
</div>
<p className="text-sm text-blue-100 mb-4">
{premiumPlan.description}
</p>
<div className="flex items-baseline justify-center gap-2">
<span className="text-6xl font-bold">
${premiumMonthlyDisplay}
</span>
<span className="text-xl text-blue-100">/month</span>
</div>
{billingPeriod === 'yearly' && premiumPlan.billing.yearly && (
<p className="text-blue-100 mt-3 text-sm text-center">
${premiumPlan.billing.yearly.price} billed annually
</p>
)}
</div>

<div className="p-8">
<button
onClick={() => {
if (!premiumBilling.priceId) return;
handleSubscribe(premiumBilling.priceId, premiumBilling.status);
}}
disabled={loading || !premiumBilling.priceId}
className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg cursor-pointer"
>
{loading ? 'Processing...' : 'Get Premium →'}
</button>

<PremiumFeatures />
</div>
</div>
</div>

{/* Compare Plans Table */}
<div className="mt-16 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
<div className="px-6 py-4 border-b border-gray-200">
<h3 className="text-lg font-semibold text-gray-900">
Compare plans
</h3>
<p className="text-sm text-gray-600">
See how iTruth Free compares to iTruth Premium.
</p>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="bg-gray-50">
<th className="text-left px-6 py-3 font-semibold text-gray-700">
Feature category
</th>
{plans.map((plan) => (
<th
key={plan.id}
className="text-center px-6 py-3 font-semibold text-gray-700"
>
{plan.name}
</th>
))}
</tr>
</thead>
<tbody>
{allGroups.map((groupLabel) => (
<tr key={groupLabel} className="border-t border-gray-100">
<td className="px-6 py-3 text-gray-800">{groupLabel}</td>
{plans.map((plan) => {
const included = hasFeature(plan.id, groupLabel);
return (
<td
key={plan.id}
className="px-6 py-3 text-center"
>
{included ? (
<Check className="w-4 h-4 text-green-600 mx-auto" />
) : (
<X className="w-4 h-4 text-gray-300 mx-auto" />
)}
</td>
);
})}
</tr>
))}
</tbody>
</table>
</div>
</div>

{/* Trust Indicators */}
<div className="mt-12 bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 max-w-4xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
<div className="transition-all duration-300 hover:-translate-y-1">
<div className="text-3xl mb-2">🔒</div>
<p className="text-sm font-semibold text-gray-900 mb-1">
Secure Payments
</p>
<p className="text-xs text-gray-600">Protected by Stripe</p>
</div>
<div className="transition-all duration-300 hover:-translate-y-1">
<div className="text-3xl mb-2">↩️</div>
<p className="text-sm font-semibold text-gray-900 mb-1">
Money-Back Guarantee
</p>
<p className="text-xs text-gray-600">
30 days, no questions asked
</p>
</div>
<div className="transition-all duration-300 hover:-translate-y-1">
<div className="text-3xl mb-2">✓</div>
<p className="text-sm font-semibold text-gray-900 mb-1">
Cancel Anytime
</p>
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
