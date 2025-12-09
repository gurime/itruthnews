import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { CheckCircle, Contrast, Eye, FileText, Keyboard, Mail, MousePointer, Type, Volume2 } from "lucide-react";

export default function Accessiblity() {
const features = [
{
icon: <Keyboard className="w-8 h-8" />,
title: "Keyboard Navigation",
description: "Our website can be fully navigated using only a keyboard. Use Tab to move forward, Shift+Tab to move backward, and Enter or Space to activate links and buttons.",
details: [
"Logical tab order throughout the site",
"Visible focus indicators on interactive elements",
"Skip navigation links to jump to main content",
"Keyboard shortcuts for common actions"
]
},
{
icon: <Eye className="w-8 h-8" />,
title: "Screen Reader Support",
description: "We use semantic HTML and ARIA labels to ensure our content is accessible to screen readers like JAWS, NVDA, and VoiceOver.",
details: [
"Alternative text for all images",
"Properly labeled form fields and buttons",
"Descriptive link text",
"Structured headings for easy navigation",
"ARIA landmarks for page sections"
]
},
{
icon: <Type className="w-8 h-8" />,
title: "Text Customization",
description: "You can adjust text size and spacing according to your preferences without losing functionality or readability.",
details: [
"Text can be resized up to 200% without loss of content",
"Adjustable line spacing and paragraph spacing",
"No text images that can't be resized",
"Responsive design adapts to zoom levels"
]
},
{
icon: <Contrast className="w-8 h-8" />,
title: "Color & Contrast",
description: "We maintain high contrast ratios and never rely solely on color to convey information.",
details: [
"WCAG AA compliant color contrast ratios (4.5:1 minimum)",
"Visual indicators beyond color alone",
"High contrast mode compatibility",
"Clear distinction between text and background"
]
},
{
icon: <MousePointer className="w-8 h-8" />,
title: "Interactive Elements",
description: "All interactive elements are designed to be easy to identify and use, with sufficient target sizes.",
details: [
"Large click/tap targets (minimum 44x44 pixels)",
"Clear hover and focus states",
"Adequate spacing between interactive elements",
"Descriptive labels for all controls"
]
},
{
icon: <Volume2 className="w-8 h-8" />,
title: "Multimedia Accessibility",
description: "Videos and audio content include captions, transcripts, and audio descriptions where appropriate.",
details: [
"Closed captions for all video content",
"Transcripts for audio content",
"Audio descriptions for visual content",
"Media player controls are keyboard accessible"
]
}
];

const standards = [
{
name: "WCAG 2.1 Level AA",
description: "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA"
},
{
name: "Section 508",
description: "Our website meets Section 508 standards for federal government websites"
},
{
name: "ADA Compliance",
description: "We work to comply with the Americans with Disabilities Act (ADA) Title III requirements"
}
];

const browserTools = [
{
browser: "Google Chrome",
features: ["Zoom: Ctrl/Cmd + Plus/Minus", "Full screen: F11", "High contrast: Chrome extensions available"]
},
{
browser: "Mozilla Firefox",
features: ["Zoom: Ctrl/Cmd + Plus/Minus", "Reader View: F9", "High contrast: Built-in accessibility features"]
},
{
browser: "Safari",
features: ["Zoom: Cmd + Plus/Minus", "Reader View: Cmd + Shift + R", "VoiceOver: Cmd + F5"]
},
{
browser: "Microsoft Edge",
features: ["Zoom: Ctrl + Plus/Minus", "Read Aloud: Ctrl + Shift + U", "Immersive Reader: F9"]
}
];

return (
<>
<Navbar />
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="dark:bg-blue-900 text-white">
<div className="container mx-auto px-4 py-16 md:py-20">
<div className="max-w-4xl mx-auto text-center">
<Eye className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-6">
Accessibility Statement
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-4">
Our commitment to making journalism accessible to everyone
</p>
<p className="text-sm text-blue-200">
Last Updated: December 8, 2024
</p>
</div>
</div>
</div>

{/* Our Commitment */}
<div className="bg-white py-12 border-b">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<div className="prose prose-lg max-w-none">
<p className="text-xl text-gray-700 leading-relaxed mb-6">
iTruth News is committed to ensuring digital accessibility for people with disabilities. 
We believe everyone has the right to access quality journalism, regardless of their abilities 
or the technology they use.
</p>
<p className="text-xl text-gray-700 leading-relaxed mb-6">
We continuously work to improve the accessibility of our website and mobile applications, 
applying relevant accessibility standards and best practices. Our goal is to meet or exceed 
Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
</p>
<p className="text-xl text-gray-700 leading-relaxed">
While we strive for full accessibility, we recognize that some areas of our site may not 
yet meet all guidelines. We are actively working to address these issues and welcome your 
feedback to help us improve.
</p>
</div>
</div>
</div>
</div>

{/* Accessibility Features */}
<div className="py-16">
<div className="container mx-auto px-4">
<div className="max-w-6xl mx-auto">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
Accessibility Features
</h2>
<div className="grid md:grid-cols-2 gap-8">
{features.map((feature, index) => (
<div key={index} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
<div className="flex items-start mb-4">
<div className="text-blue-900 mr-4 mt-1">
{feature.icon}
</div>
<div>
<h3 className="text-xl font-bold text-gray-900 mb-2">
{feature.title}
</h3>
</div>
</div>
<p className="text-gray-700 mb-4">
{feature.description}
</p>
<ul className="space-y-2">
{feature.details.map((detail, idx) => (
<li key={idx} className="text-sm text-gray-600 flex items-start">
<CheckCircle className="w-4 h-4 text-green-600 mr-2 shrink-0 mt-0.5" />
<span>{detail}</span>
</li>
))}
</ul>
</div>
))}
</div>
</div>
</div>
</div>

{/* Standards Compliance */}
<div className="bg-blue-50 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
Standards & Compliance
</h2>
<div className="space-y-6">
{standards.map((standard, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<h3 className="text-xl font-bold text-gray-900 mb-2">
{standard.name}
</h3>
<p className="text-gray-700">
{standard.description}
</p>
</div>
))}
</div>
</div>
</div>
</div>

{/* Browser & Assistive Technology Support */}
<div className="bg-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
Browser & Assistive Technology Support
</h2>
<p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
Our website works with commonly used browsers and assistive technologies
</p>

<div className="mb-12">
<h3 className="text-2xl font-bold text-gray-900 mb-6">
Supported Assistive Technologies
</h3>
<div className="grid md:grid-cols-2 gap-4">
<div className="bg-gray-50 p-6 rounded-lg">
<h4 className="font-bold text-gray-900 mb-3">Screen Readers</h4>
<ul className="space-y-2 text-gray-700">
<li>• JAWS (Windows)</li>
<li>• NVDA (Windows)</li>
<li>• VoiceOver (macOS, iOS)</li>
<li>• TalkBack (Android)</li>
</ul>
</div>
<div className="bg-gray-50 p-6 rounded-lg">
<h4 className="font-bold text-gray-900 mb-3">Other Tools</h4>
<ul className="space-y-2 text-gray-700">
<li>• Speech recognition software</li>
<li>• Screen magnification software</li>
<li>• Switch controls</li>
<li>• Eye-tracking devices</li>
</ul>
</div>
</div>
</div>

<div>
<h3 className="text-2xl font-bold text-gray-900 mb-6">
Browser Accessibility Features
</h3>
<div className="space-y-4">
{browserTools.map((tool, index) => (
<div key={index} className="bg-gray-50 p-6 rounded-lg">
<h4 className="font-bold text-gray-900 mb-3">{tool.browser}</h4>
<ul className="space-y-1 text-sm text-gray-700">
{tool.features.map((feature, idx) => (
<li key={idx}>• {feature}</li>
))}
</ul>
</div>
))}
</div>
</div>
</div>
</div>
</div>

{/* Known Issues */}
<div className="bg-gray-100 py-16">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
Known Issues & Limitations
</h2>
<div className="bg-white rounded-lg shadow-md p-8">
<p className="text-gray-700 mb-6">
While we work to maintain full accessibility, some areas of our website may have limitations:
</p>
<ul className="space-y-3 mb-6">
<li className="text-gray-700 flex items-start">
<span className="mr-2">•</span>
<span>Some third-party embedded content (social media posts, videos) may not be fully accessible</span>
</li>
<li className="text-gray-700 flex items-start">
<span className="mr-2">•</span>
<span>Older archived content may not meet current accessibility standards</span>
</li>
<li className="text-gray-700 flex items-start">
<span className="mr-2">•</span>
<span>Some PDF documents may require additional accessibility improvements</span>
</li>
<li className="text-gray-700 flex items-start">
<span className="mr-2">•</span>
<span>Live breaking news updates may have a brief delay in accessibility features</span>
</li>
</ul>
<p className="text-gray-700">
We are actively working to address these limitations and improve accessibility across all our content.
</p>
</div>
</div>
</div>
</div>

{/* Feedback & Contact */}
<div className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl font-bold mb-4">
Help Us Improve Accessibility
</h2>
<p className="text-xl text-blue-100 mb-8">
Your feedback is essential to our accessibility efforts
</p>

<div className="bg-blue-800 rounded-lg p-8 mb-8 text-left">
<h3 className="font-bold text-lg mb-4">We Want to Hear From You</h3>
<p className="text-blue-100 mb-4">
If you encounter accessibility barriers on our website or have suggestions for improvement, 
please let us know. Your feedback helps us identify issues and prioritize improvements.
</p>

<div className="space-y-4">
<div>
<p className="font-semibold mb-2">Accessibility Team</p>
<p className="text-blue-100">
Email: <a href="mailto:accessibility@itruthnews.com" className="text-white hover:text-blue-200 font-semibold">accessibility@itruthnews.com</a>
</p>
</div>
<div>
<p className="font-semibold mb-2">Phone</p>
<p className="text-blue-100">(212) 555-0123</p>
<p className="text-blue-200 text-sm">Monday-Friday, 9 AM - 5 PM EST</p>
</div>
<div>
<p className="font-semibold mb-2">Mail</p>
<p className="text-blue-100">
iTruth News Accessibility Team<br />
123 Press Avenue<br />
New York, NY 10001
</p>
</div>
</div>

<p className="text-blue-100 text-sm mt-6">
We aim to respond to accessibility feedback within 3 business days.
</p>
</div>

<Link 
href="/contact" 
className="inline-block px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
Submit Accessibility Feedback
</Link>
</div>
</div>
</div>

{/* Additional Resources */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
Additional Resources
</h2>
<div className="grid md:grid-cols-3 gap-6">
<div className="bg-gray-50 p-6 rounded-lg text-center">
<FileText className="w-8 h-8 text-blue-900 mx-auto mb-3" />
<h3 className="font-bold text-gray-900 mb-2">WCAG Guidelines</h3>
<a 
href="https://www.w3.org/WAI/WCAG21/quickref/"
target="_blank"
rel="noopener noreferrer"
className="text-blue-600 hover:text-blue-800 text-sm">
Learn More →
</a>
</div>
<div className="bg-gray-50 p-6 rounded-lg text-center">
<Eye className="w-8 h-8 text-blue-900 mx-auto mb-3" />
<h3 className="font-bold text-gray-900 mb-2">WebAIM</h3>
<a 
href="https://webaim.org/"
target="_blank"
rel="noopener noreferrer"
className="text-blue-600 hover:text-blue-800 text-sm">
Learn More →
</a>
</div>
<div className="bg-gray-50 p-6 rounded-lg text-center">
<Keyboard className="w-8 h-8 text-blue-900 mx-auto mb-3" />
<h3 className="font-bold text-gray-900 mb-2">ADA Resources</h3>
<a 
href="https://www.ada.gov/"
target="_blank"
rel="noopener noreferrer"
className="text-blue-600 hover:text-blue-800 text-sm">
Learn More →
</a>
</div>
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
<Link href="/contact" className="text-blue-600 hover:text-blue-800 font-semibold">
Contact Us
</Link>
</div>
</div>
</div>
</div>
</div>
<Footer />
</>
);
}