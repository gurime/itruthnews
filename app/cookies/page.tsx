import { Cookie, Settings, Eye, BarChart3, Target, Shield, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Cookies() {
const cookieTypes = [
{
icon: <CheckCircle className="w-8 h-8" />,
title: "Strictly Necessary Cookies",
required: true,
description: "These cookies are essential for the website to function properly. They enable basic features like page navigation, secure areas access, and remember your cookie preferences.",
examples: [
"Authentication tokens to keep you logged in",
"Security cookies to prevent fraudulent activity",
"Load balancing cookies to distribute traffic"
],
canDisable: false
},
{
icon: <BarChart3 className="w-8 h-8" />,
title: "Performance & Analytics Cookies",
required: false,
description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.",
examples: [
"Google Analytics to track page views and user behavior",
"Performance monitoring tools to identify technical issues",
"A/B testing cookies to optimize user experience"
],
canDisable: true
},
{
icon: <Settings className="w-8 h-8" />,
title: "Functional Cookies",
required: false,
description: "These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and customized content.",
examples: [
"Language preference settings",
"Font size and display preferences",
"Newsletter subscription preferences",
"Recently viewed articles"
],
canDisable: true
},
{
icon: <Target className="w-8 h-8" />,
title: "Advertising & Targeting Cookies",
required: false,
description: "These cookies are used to deliver advertisements that are relevant to you and your interests. They also help measure the effectiveness of advertising campaigns.",
examples: [
"Third-party advertising networks",
"Retargeting cookies to show relevant ads",
"Social media advertising pixels",
"Frequency capping for ad display"
],
canDisable: true
}
];

const thirdPartyServices = [
{
name: "Google Analytics",
purpose: "Website analytics and user behavior tracking",
cookies: "_ga, _gid, _gat",
duration: "Up to 2 years",
privacy: "https://policies.google.com/privacy"
},
{
name: "Stripe",
purpose: "Payment processing for subscriptions",
cookies: "__stripe_sid, __stripe_mid",
duration: "Session to 1 year",
privacy: "https://stripe.com/privacy"
},
{
name: "Facebook Pixel",
purpose: "Social media advertising and analytics",
cookies: "_fbp, fr",
duration: "Up to 90 days",
privacy: "https://www.facebook.com/privacy/explanation"
},
{
name: "Twitter",
purpose: "Social media integration and analytics",
cookies: "personalization_id",
duration: "Up to 2 years",
privacy: "https://twitter.com/privacy"
}
];

return (
<>
<Navbar/>
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16 md:py-20">
<div className="max-w-4xl mx-auto text-center">
<Cookie className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-6">
Cookie Policy
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-4">
How we use cookies and similar technologies
</p>
<p className="text-sm text-blue-200">
Last Updated: December 8, 2024
</p>
</div>
</div>
</div>

{/* Introduction */}
<div className="bg-white py-12 border-b">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<div className="prose prose-lg max-w-none">
<p className="text-xl text-gray-700 leading-relaxed mb-6">
This Cookie Policy explains how iTruth News uses cookies and similar tracking technologies 
when you visit our website and use our services. This policy should be read alongside our 
Privacy Policy and Terms of Service.
</p>

<div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
<h2 className="text-2xl font-bold text-gray-900 mb-3">
What Are Cookies?
</h2>
<p className="text-gray-700 mb-3">
Cookies are small text files that are placed on your device (computer, smartphone, or tablet) 
when you visit a website. They are widely used to make websites work more efficiently and 
provide information to website owners.
</p>
<p className="text-gray-700">
Cookies can be "session" cookies (which are deleted when you close your browser) or 
"persistent" cookies (which remain on your device for a set period or until you delete them).
</p>
</div>
</div>
</div>
</div>
</div>

{/* Types of Cookies */}
<div className="py-16">
<div className="container mx-auto px-4">
<div className="max-w-6xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
Types of Cookies We Use
</h2>
<div className="space-y-8">
{cookieTypes.map((type, index) => (
<div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
<div className="p-8">
<div className="flex items-start justify-between mb-4">
<div className="flex items-start">
<div className="text-blue-900 mr-4 mt-1">
{type.icon}
</div>
<div>
<h3 className="text-2xl font-bold text-gray-900 mb-2">
{type.title}
</h3>
<div className="flex items-center gap-3 mb-3">
{type.required ? (
<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">
Always Active
</span>
) : (
<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
Optional
</span>
)}
</div>
</div>
</div>
{type.canDisable && (
<button className="px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm">
Manage
</button>
)}
</div>

<p className="text-gray-700 mb-4 ml-12">
{type.description}
</p>

<div className="ml-12">
<h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
<ul className="space-y-1">
{type.examples.map((example, idx) => (
<li key={idx} className="text-gray-600 text-sm flex items-start">
<span className="mr-2">•</span>
<span>{example}</span>
</li>
))}
</ul>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Third-Party Cookies */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-6xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
Third-Party Cookies & Services
</h2>
<p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
We work with trusted third-party services that may set cookies on your device. 
These services have their own privacy policies.
</p>

<div className="space-y-4">
{thirdPartyServices.map((service, index) => (
<div key={index} className="bg-white rounded-lg shadow-sm p-6">
<div className="grid md:grid-cols-4 gap-4">
<div>
<h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
<p className="text-xs text-gray-500">Third-Party Service</p>
</div>
<div>
<p className="text-sm font-semibold text-gray-700 mb-1">Purpose</p>
<p className="text-sm text-gray-600">{service.purpose}</p>
</div>
<div>
<p className="text-sm font-semibold text-gray-700 mb-1">Cookies</p>
<p className="text-sm text-gray-600 font-mono">{service.cookies}</p>
<p className="text-xs text-gray-500 mt-1">Duration: {service.duration}</p>
</div>
<div>
<a 
href={service.privacy}
target="_blank"
rel="noopener noreferrer"
className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
Privacy Policy →
</a>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Managing Cookies */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
How to Manage Cookies
</h2>

<div className="space-y-6">
<div className="bg-gray-50 p-6 rounded-lg">
<div className="flex items-start">
<Settings className="w-6 h-6 text-blue-900 mr-3 shrink-0 mt-1" />
<div>
<h3 className="text-xl font-bold text-gray-900 mb-3">
Cookie Preference Center
</h3>
<p className="text-gray-700 mb-4">
You can manage your cookie preferences at any time through our Cookie Preference Center. 
Note that disabling certain cookies may affect your experience on our site.
</p>
<button className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors">
Manage Cookie Preferences
</button>
</div>
</div>
</div>

<div className="bg-gray-50 p-6 rounded-lg">
<div className="flex items-start">
<Eye className="w-6 h-6 text-blue-900 mr-3 shrink-0 mt-1" />
<div>
<h3 className="text-xl font-bold text-gray-900 mb-3">
Browser Settings
</h3>
<p className="text-gray-700 mb-4">
Most web browsers allow you to control cookies through their settings. You can set your 
browser to refuse all cookies or indicate when a cookie is being sent.
</p>
<div className="space-y-2">
<p className="text-sm font-semibold text-gray-700">Popular browsers:</p>
<ul className="text-sm text-gray-600 space-y-1">
<li>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Chrome</a></li>
<li>• <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Mozilla Firefox</a></li>
<li>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Safari</a></li>
<li>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Microsoft Edge</a></li>
</ul>
</div>
</div>
</div>
</div>

<div className="bg-gray-50 p-6 rounded-lg">
<div className="flex items-start">
<Shield className="w-6 h-6 text-blue-900 mr-3 shrink-0 mt-1" />
<div>
<h3 className="text-xl font-bold text-gray-900 mb-3">
Opt-Out Tools
</h3>
<p className="text-gray-700 mb-4">
You can opt out of targeted advertising cookies through industry opt-out platforms:
</p>
<ul className="text-sm text-gray-600 space-y-1">
<li>• <a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Network Advertising Initiative (NAI)</a></li>
<li>• <a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Digital Advertising Alliance (DAA)</a></li>
<li>• <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">European Interactive Digital Advertising Alliance (EDAA)</a></li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

{/* Do Not Track */}
<div className="bg-blue-50 py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-2xl font-bold text-gray-900 mb-4">
Do Not Track Signals
</h2>
<p className="text-gray-700">
Some browsers include a "Do Not Track" (DNT) feature that signals websites you visit that you 
do not want your online activity tracked. Currently, there is no industry standard for how to 
respond to DNT signals. At this time, our website does not respond to DNT signals, but we 
provide you with the cookie management options described above.
</p>
</div>
</div>
</div>

{/* Updates */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-2xl font-bold text-gray-900 mb-4">
Updates to This Policy
</h2>
<p className="text-gray-700 mb-4">
We may update this Cookie Policy from time to time to reflect changes in our practices or 
for other operational, legal, or regulatory reasons. We encourage you to review this policy 
periodically.
</p>
<p className="text-gray-700">
If we make material changes to this policy, we will notify you by updating the "Last Updated" 
date at the top of this page.
</p>
</div>
</div>
</div>

{/* Contact */}
<div className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Cookie className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl font-bold mb-4">
Questions About Cookies?
</h2>
<p className="text-xl text-blue-100 mb-8">
If you have questions about our use of cookies or this policy
</p>
<div className="bg-blue-800 rounded-lg p-6 mb-8">
<p className="text-blue-100">
Email: <a href="mailto:privacy@itruthnews.com" className="text-white hover:text-blue-200 font-semibold">privacy@itruthnews.com</a>
</p>
</div>
<div className="flex flex-wrap justify-center gap-4">
<Link 
href="/privacy" 
className="px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-colors">
Privacy Policy
</Link>
<Link 
href="/contact" 
className="px-8 py-3 bg-blue-700 text-white rounded-full font-bold hover:bg-blue-600 transition-colors border-2 border-blue-500">
Contact Us
</Link>
</div>
</div>
</div>
</div>

{/* Related Links */}
<div className="bg-gray-100 py-8">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center">
<div className="flex flex-wrap justify-center gap-6 text-sm">
<Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-semibold">
Privacy Policy
</Link>
<Link href="/terms" className="text-blue-600 hover:text-blue-800 font-semibold">
Terms of Service
</Link>
<Link href="/faq" className="text-blue-600 hover:text-blue-800 font-semibold">
FAQ
</Link>
<Link href="/about" className="text-blue-600 hover:text-blue-800 font-semibold">
About Us
</Link>
</div>
</div>
</div>
</div>
</div>
<Footer/>
</>
);
}