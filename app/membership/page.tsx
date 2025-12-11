'use client'
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';



export default function MembershipPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
const [loading, setLoading] = useState(false);

const plans = {
monthly: {
price: 9.99,
priceId: 'price_monthly_xxxxx', // Replace with your Stripe Price ID
savings: null
},
yearly: {
price: 99.99,
priceId: 'price_yearly_xxxxx', // Replace with your Stripe Price ID
savings: '17% off'
}
};

const handleSubscribe = async (priceId: unknown) => {
setLoading(true);

try {
// Call your backend API to create a Checkout session
const response = await fetch('/api/create-checkout-session', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
priceId: priceId,
}),
});

const { sessionId } = await response.json();

// Redirect to Stripe Checkout
// You'll need to load Stripe.js first
// const stripe = await loadStripe('your_publishable_key');
// await stripe.redirectToCheckout({ sessionId });

console.log('Checkout session created:', sessionId);
toast('This would redirect to Stripe Checkout.');
} catch (error) {
console.error('Error:', error);
toast('Something went wrong. Please try again.');
} finally {
setLoading(false);
}
};

const currentPlan = plans[billingPeriod];
const monthlyEquivalent = billingPeriod === 'yearly' 
? (currentPlan.price / 12).toFixed(2) 
: currentPlan.price;

const benefits = [
'Unlimited access to all articles',
'Ad-free reading experience',
'Exclusive investigative reports',
'Early access to breaking news',
'Member-only newsletters',
'Support independent journalism',
'Access to archived content',
'Priority customer support'
];

const freeTierLimitations = [
'Limited to 5 articles per month',
'Advertisements displayed',
'No access to premium content',
'No newsletters'
];

return (
<>
<Navbar />
<Toaster position="top-center" />

<div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-4">
<div className="max-w-4xl mx-auto">

{/* Hero Section */}
<div className="text-center mb-12">
<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
Support Independent Journalism
</h1>
<p className="text-xl text-gray-600 max-w-2xl mx-auto">
Join thousands of readers who believe in truth and transparency. 
Your membership keeps our journalism free from corporate influence.
</p>
</div>

{/* Billing Toggle */}
<div className="flex justify-center items-center gap-4 mb-8">
<span className={`text-lg font-medium ${billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
Monthly
</span>
<button
onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
className="relative w-16 h-8 bg-gray-300 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
style={{ backgroundColor: billingPeriod === 'yearly' ? '#2563eb' : '#d1d5db' }}
>
<div
className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
style={{ transform: billingPeriod === 'yearly' ? 'translateX(32px)' : 'translateX(0)' }}
/>
</button>
<span className={`text-lg font-medium ${billingPeriod === 'yearly' ? 'text-blue-600' : 'text-gray-500'}`}>
Yearly
</span>
{billingPeriod === 'yearly' && (
<span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
Save 17%
</span>
)}
</div>

{/* Pricing Card */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100 mb-8">
<div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
<h2 className="text-3xl font-bold mb-2">iTruth Member</h2>
<div className="flex items-baseline justify-center gap-2">
<span className="text-5xl font-bold">${monthlyEquivalent}</span>
<span className="text-xl text-blue-100">/month</span>
</div>
{billingPeriod === 'yearly' && (
<p className="text-blue-100 mt-2">
${currentPlan.price} billed annually
</p>
)}
</div>

<div className="p-8">
<button
onClick={() => handleSubscribe(currentPlan.priceId)}
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg cursor-pointer"
>
{loading ? 'Processing...' : `Become a Member`}
</button>

<div className="space-y-3">
<h3 className="font-semibold text-gray-900 text-lg mb-4">Member Benefits:</h3>
{benefits.map((benefit, index) => (
<div key={index} className="flex items-start gap-3">
<Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
<span className="text-gray-700">{benefit}</span>
</div>
))}
</div>
</div>
</div>

{/* Free Tier Comparison */}
<div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
<h3 className="font-semibold text-gray-900 text-lg mb-4">
Continue with Free Access:
</h3>
<div className="space-y-3">
{freeTierLimitations.map((limitation, index) => (
<div key={index} className="flex items-start gap-3">
<X className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
<span className="text-gray-600">{limitation}</span>
</div>
))}
</div>
</div>

{/* Trust Indicators */}
<div className="mt-12 text-center space-y-4 text-gray-600">
<p className="text-sm">
🔒 Secure payment processing by Stripe
</p>
<p className="text-sm">
Cancel anytime. No hidden fees. 30-day money-back guarantee.
</p>
</div>

</div>
</div>

<Footer />
</>
);
}