import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FileText, AlertTriangle, Scale, Shield, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
export default function Terms() {
const sections = [
{
icon: <CheckCircle className="w-8 h-8" />,
title: "Acceptance of Terms",
content: [
{
text: "By accessing or using iTruth News services, including our website, mobile applications, newsletters, and any other services we provide (collectively, the 'Services'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, please do not use our Services."
},
{
text: "These Terms constitute a legally binding agreement between you and iTruth News. We may modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Services after any changes indicates your acceptance of the modified Terms."
}
]
},
{
icon: <FileText className="w-8 h-8" />,
title: "Use of Services",
content: [
{
subtitle: "Eligibility",
text: "You must be at least 13 years old to use our Services. If you are under 18, you represent that you have your parent or guardian's permission to use the Services. By using our Services, you represent and warrant that you meet these eligibility requirements."
},
{
subtitle: "Account Registration",
text: "Some features of our Services require you to create an account. You agree to provide accurate, current, and complete information during registration and to update your information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
},
{
subtitle: "Prohibited Uses",
text: "You may not use our Services to: (a) violate any applicable law or regulation; (b) infringe the rights of others; (c) transmit harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable content; (d) impersonate any person or entity; (e) interfere with or disrupt the Services; (f) attempt to gain unauthorized access to our systems; or (g) use automated systems to access the Services without our permission."
}
]
},
{
icon: <Scale className="w-8 h-8" />,
title: "Intellectual Property Rights",
content: [
{
subtitle: "Our Content",
text: "All content on our Services, including articles, photographs, graphics, videos, and other materials (collectively, 'Content'), is protected by copyright, trademark, and other intellectual property laws. iTruth News and our licensors own all rights, title, and interest in and to the Content."
},
{
subtitle: "Limited License",
text: "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for personal, non-commercial purposes. You may share our articles through social media and other platforms, but you may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit our Content without our express written permission."
},
{
subtitle: "User Submissions",
text: "If you submit content to us (such as comments, letters to the editor, or story tips), you grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in any media. You represent that you own or have the necessary rights to submit such content and that it does not violate any third-party rights."
},
{
subtitle: "Copyright Infringement",
text: "We respect intellectual property rights. If you believe your work has been copied in a way that constitutes copyright infringement, please contact us at copyright@itruthnews.com with detailed information about the alleged infringement."
}
]
},
{
icon: <Shield className="w-8 h-8" />,
title: "Subscriptions & Payments",
content: [
{
subtitle: "Subscription Plans",
text: "We offer various subscription plans that provide access to premium content and features. Subscription terms, including pricing and features, are described on our membership page and may be changed from time to time."
},
{
subtitle: "Billing",
text: "Subscriptions are billed on a recurring basis (monthly or annually, depending on your plan). You authorize us to charge your payment method on the applicable billing cycle. If your payment method fails, we may suspend or terminate your subscription."
},
{
subtitle: "Cancellation & Refunds",
text: "You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period. We do not provide refunds for partial subscription periods, except as required by law or at our sole discretion."
},
{
subtitle: "Free Trials",
text: "We may offer free trial periods for new subscribers. If you do not cancel before the end of the trial period, your payment method will be charged for the subscription plan you selected. Free trial offers are limited to one per customer."
}
]
},
{
icon: <AlertTriangle className="w-8 h-8" />,
title: "Disclaimers & Limitations",
content: [
{
subtitle: "Content Accuracy",
text: "While we strive for accuracy in our reporting, we make no warranties or representations about the accuracy, reliability, completeness, or timeliness of any Content. We are not liable for any errors or omissions in the Content or for any actions taken in reliance on such Content."
},
{
subtitle: "Third-Party Links",
text: "Our Services may contain links to third-party websites or resources. We are not responsible for the content, accuracy, or practices of such third-party sites. Your use of third-party sites is at your own risk and subject to their terms and policies."
},
{
subtitle: "Service Availability",
text: "We strive to keep our Services available at all times, but we do not guarantee uninterrupted or error-free service. We may suspend or discontinue any part of the Services at any time without notice. We are not liable for any interruption, suspension, or termination of the Services."
},
{
subtitle: "Disclaimer of Warranties",
text: "THE SERVICES ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT."
}
]
},
{
icon: <Scale className="w-8 h-8" />,
title: "Limitation of Liability",
content: [
{
text: "TO THE FULLEST EXTENT PERMITTED BY LAW, ITRUTH NEWS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES ARISING OUT OF YOUR USE OF THE SERVICES."
},
{
text: "IN NO EVENT WILL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS PRIOR TO THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER."
},
{
text: "Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you."
}
]
},
{
icon: <FileText className="w-8 h-8" />,
title: "Indemnification",
content: [
{
text: "You agree to indemnify, defend, and hold harmless iTruth News and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any content you submit to us."
}
]
},
{
icon: <Scale className="w-8 h-8" />,
title: "Dispute Resolution",
content: [
{
subtitle: "Governing Law",
text: "These Terms are governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law principles."
},
{
subtitle: "Arbitration",
text: "Any dispute arising out of or relating to these Terms or the Services will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration will take place in New York, New York. You and iTruth News agree to waive the right to a jury trial or to participate in a class action."
},
{
subtitle: "Exceptions",
text: "Either party may seek injunctive or other equitable relief in court to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights."
}
]
},
{
icon: <FileText className="w-8 h-8" />,
title: "Termination",
content: [
{
text: "We may terminate or suspend your account and access to the Services at any time, with or without cause, with or without notice. Upon termination, your right to use the Services will immediately cease. Sections of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability."
}
]
},
{
icon: <CheckCircle className="w-8 h-8" />,
title: "General Provisions",
content: [
{
subtitle: "Entire Agreement",
text: "These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and iTruth News regarding the Services and supersede all prior agreements and understandings."
},
{
subtitle: "Severability",
text: "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect."
},
{
subtitle: "Waiver",
text: "Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision."
},
{
subtitle: "Assignment",
text: "You may not assign or transfer these Terms or your rights under these Terms without our prior written consent. We may assign these Terms without restriction."
},
{
subtitle: "Contact",
text: "If you have questions about these Terms, please contact us at legal@itruthnews.com."
}
]
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
<Scale className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-6">
Terms of Service
</h1>
<p className="text-xl md:text-2xl text-blue-100 mb-4">
Please read these terms carefully before using our services
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
<div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8">
<div className="flex items-start">
<AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 shrink-0 mt-1" />
<div>
<h2 className="text-xl font-bold text-gray-900 mb-2">
Important Legal Information
</h2>
<p className="text-gray-700">
These Terms of Service contain important information about your rights and obligations. 
By using iTruth News services, you agree to these terms. Please read them carefully.
</p>
</div>
</div>
</div>

<div className="prose prose-lg max-w-none">
<p className="text-lg text-gray-700 leading-relaxed">
Welcome to iTruth News. These Terms of Service govern your access to and use of our 
website, mobile applications, newsletters, and all related services. By accessing or using 
our services, you acknowledge that you have read, understood, and agree to be bound by 
these Terms.
</p>
</div>
</div>
</div>
</div>

{/* Terms Sections */}
<div className="py-16">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<div className="space-y-12">
{sections.map((section, index) => (
<div key={index} className="bg-white rounded-lg shadow-md p-8">
<div className="flex items-start mb-6">
<div className="text-blue-900 mr-4 mt-1">
{section.icon}
</div>
<div className="flex-1">
<h2 className="text-2xl font-bold text-gray-900">
{section.title}
</h2>
</div>
</div>
<div className="space-y-6 ml-12">
{section.content.map((item, idx) => (
<div key={idx}>
{item.subtitle && (
<h3 className="text-lg font-semibold text-gray-900 mb-2">
{item.subtitle}
</h3>
)}
<p className="text-gray-700 leading-relaxed">
{item.text}
</p>
</div>
))}
</div>
</div>
))}
</div>
</div>
</div>
</div>

{/* Contact Section */}
<div className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
<Mail className="w-16 h-16 mx-auto mb-6" />
<h2 className="text-3xl font-bold mb-4">
Questions About These Terms?
</h2>
<p className="text-xl text-blue-100 mb-8">
If you have questions or concerns about our Terms of Service
</p>
<div className="bg-blue-800 rounded-lg p-6 mb-8">
<h3 className="font-bold text-lg mb-3">Contact Our Legal Team</h3>
<div className="space-y-2">
<p className="text-blue-100">
Email: <a href="mailto:legal@itruthnews.com" className="text-white hover:text-blue-200 font-semibold">legal@itruthnews.com</a>
</p>
<p className="text-blue-100">
Mail: iTruth News Legal Department<br />
123 Press Avenue<br />
New York, NY 10001
</p>
</div>
</div>
<div className="flex flex-wrap justify-center gap-4">
<Link 
href="/contact" 
className="px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-colors">
Contact Us
</Link>
<Link 
href="/faq" 
className="px-8 py-3 bg-blue-700 text-white rounded-full font-bold hover:bg-blue-600 transition-colors border-2 border-blue-500">
View FAQ
</Link>
</div>
</div>
</div>
</div>

{/* Related Policies */}
<div className="bg-gray-100 py-8">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center">
<p className="text-gray-600 mb-4 font-semibold">Related Policies</p>
<div className="flex flex-wrap justify-center gap-6 text-sm">
<Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-semibold">
Privacy Policy
</Link>
<Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 font-semibold">
Cookie Policy
</Link>
<Link href="/ethics-policy" className="text-blue-600 hover:text-blue-800 font-semibold">
Editorial Standards
</Link>
<Link href="/about" className="text-blue-600 hover:text-blue-800 font-semibold">
About Us
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