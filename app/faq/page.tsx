  'use client'
  import { useState } from "react"
  import { HelpCircle, ChevronDown, Mail, Search } from "lucide-react"
  import Link from "next/link"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

  export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
  { value: "all", label: "All Questions" },
  { value: "subscription", label: "Membership & Subscription" },
  { value: "account", label: "Account & Login" },
  { value: "content", label: "Content & Access" },
  { value: "editorial", label: "Editorial & Standards" },
  { value: "technical", label: "Technical Support" },
  { value: "general", label: "General" }
  ];

  const faqs = [
  {
  category: "subscription",
  question: "How much does an iTruth News membership cost?",
  answer: "We offer flexible membership options starting at $5/month. Premium memberships are available at $10/month and include additional benefits like ad-free reading, exclusive content, and early access to major stories. Annual subscriptions offer a discount."
  },
  {
  category: "subscription",
  question: "What payment methods do you accept?",
  answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. All payments are processed securely through our payment provider."
  },
  {
  category: "subscription",
  question: "Can I cancel my membership at any time?",
  answer: "Yes! You can cancel your membership at any time from your account settings. There are no cancellation fees, and you'll retain access until the end of your current billing period."
  },
  {
  category: "subscription",
  question: "Do you offer a free trial?",
  answer: "Yes, we offer a 14-day free trial for new members. You can explore all premium features risk-free. If you decide it's not for you, simply cancel before the trial ends and you won't be charged."
  },
  {
  category: "subscription",
  question: "Can I gift a membership to someone?",
  answer: "Absolutely! Gift memberships are available for 3, 6, or 12-month periods. Visit our membership page and select 'Gift a Membership' to get started."
  },
  {
  category: "account",
  question: "How do I create an account?",
  answer: "Click 'Sign In' at the top of any page and select 'Create Account.' You'll need to provide an email address and create a password. You can also sign up using your Google or Apple account."
  },
  {
  category: "account",
  question: "I forgot my password. How do I reset it?",
  answer: "On the login page, click 'Forgot Password' and enter your email address. We'll send you a link to reset your password. If you don't receive the email within a few minutes, check your spam folder."
  },
  {
  category: "account",
  question: "How do I update my email or payment information?",
  answer: "Log in to your account and go to Settings. From there, you can update your email address, password, payment method, and other account preferences."
  },
  {
  category: "account",
  question: "Can I access my account on multiple devices?",
  answer: "Yes! Your account can be accessed on any device with an internet connection. Simply log in with your credentials on your phone, tablet, or computer."
  },
  {
  category: "content",
  question: "How much content is free vs. members-only?",
  answer: "We keep the majority of our news coverage free and accessible to everyone. Members get access to premium features including in-depth investigations, exclusive analysis, ad-free reading, and our complete archive."
  },
  {
  category: "content",
  question: "Can I read articles offline?",
  answer: "Yes! Our mobile app allows you to save articles for offline reading. Simply tap the bookmark icon on any article while connected to the internet, and access it later without a connection."
  },
  {
  category: "content",
  question: "Do you have a newsletter?",
  answer: "Yes! We offer several newsletters covering different topics. You can subscribe to our daily news briefing, weekly analysis, and specialized newsletters on politics, technology, and more. Manage your newsletter preferences in your account settings."
  },
  {
  category: "content",
  question: "How often do you publish new content?",
  answer: "We publish news articles throughout the day, every day. Major investigations and feature stories are published on a regular schedule. Our opinion section is updated daily with new perspectives."
  },
  {
  category: "editorial",
  question: "How do you ensure accuracy in your reporting?",
  answer: "Every story goes through multiple editorial reviews and fact-checking before publication. We verify information through multiple independent sources and maintain strict editorial standards. Learn more on our Ethics & Standards page."
  },
  {
  category: "editorial",
  question: "How is iTruth News funded?",
  answer: "We're a reader-funded publication. Our revenue comes primarily from member subscriptions and reader contributions, allowing us to maintain editorial independence from advertisers and special interests."
  },
  {
  category: "editorial",
  question: "How do I report an error in an article?",
  answer: "If you spot an error in our reporting, please email corrections@itruthnews.com with the article URL, the error you identified, and the correct information. We review all correction requests promptly and make corrections transparently."
  },
  {
  category: "editorial",
  question: "Can I pitch a story idea or submit an article?",
  answer: "Yes! We welcome story tips and pitches. Email tips@itruthnews.com with your idea. For opinion submissions, email opinion@itruthnews.com with your pitch and writing samples."
  },
  {
  category: "technical",
  question: "The website isn't loading properly. What should I do?",
  answer: "First, try clearing your browser cache and cookies. If that doesn't work, try using a different browser or device. If problems persist, contact our technical support team at support@itruthnews.com with details about your device and browser."
  },
  {
  category: "technical",
  question: "Why am I seeing ads if I'm a member?",
  answer: "Members should have an ad-free experience. If you're seeing ads, make sure you're logged in to your account. If you're logged in and still seeing ads, clear your browser cookies or contact support@itruthnews.com."
  },
  {
  category: "technical",
  question: "Is there a mobile app?",
  answer: "Yes! Our mobile app is available for both iOS and Android devices. Download it from the App Store or Google Play Store. The app offers offline reading, push notifications for breaking news, and a streamlined reading experience."
  },
  {
  category: "technical",
  question: "Do you support accessibility features?",
  answer: "Yes. Our website and app support screen readers, keyboard navigation, and adjustable text sizes. We're committed to making our journalism accessible to everyone. If you encounter accessibility issues, please contact us."
  },
  {
  category: "general",
  question: "How do I contact customer support?",
  answer: "You can reach our support team at support@itruthnews.com or use our contact form. We typically respond within 24-48 hours during business days."
  },
  {
  category: "general",
  question: "Do you offer student or educator discounts?",
  answer: "Yes! We offer 50% off memberships for students and educators with a valid .edu email address or student ID. Contact support@itruthnews.com to request your discount code."
  },
  {
  category: "general",
  question: "Can I share articles on social media?",
  answer: "Absolutely! We encourage sharing our journalism. Every article has social sharing buttons, or you can simply copy and paste the URL. Please respect our copyright by not reproducing entire articles without permission."
  },
  {
  category: "general",
  question: "How do I delete my account?",
  answer: "If you'd like to delete your account, please contact support@itruthnews.com. We'll process your request within 5 business days. Note that deleting your account is permanent and cannot be undone."
  }
  ];

  const filteredFAQs = faqs.filter(faq => {
  const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
  const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
  faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
  setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    
  <div className="min-h-screen bg-gray-50">
  {/* Header */}
  <div className="dark:bg-blue-900 text-white">
  <div className="container mx-auto px-4 py-16 md:py-20">
  <div className="max-w-4xl mx-auto text-center">
  <HelpCircle className="w-16 h-16 mx-auto mb-6" />
  <h1 className="text-4xl md:text-5xl font-bold mb-6">
  Frequently Asked Questions
  </h1>
  <p className="text-xl md:text-2xl text-blue-100 mb-8">
  Find answers to common questions about iTruth News
  </p>
  </div>
  </div>
  </div>

  {/* Search Bar */}
  <div className="bg-white py-8 border-b sticky top-0 z-10 shadow-sm">
  <div className="container mx-auto px-4">
  <div className="max-w-3xl mx-auto">
  <div className="relative">
  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  <input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search for answers..."
  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg"
  />
  </div>
  </div>
  </div>
  </div>

  {/* Category Filter */}
  <div className="bg-gray-100 py-6">
  <div className="container mx-auto px-4">
  <div className="max-w-5xl mx-auto">
  <div className="flex flex-wrap gap-2 justify-center">
  {categories.map((cat) => (
  <button
  key={cat.value}
  onClick={() => setSelectedCategory(cat.value)}
  className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
  selectedCategory === cat.value
  ? 'bg-blue-900 text-white'
  : 'bg-white text-gray-700 hover:bg-gray-200'
  }`}>
  {cat.label}
  </button>
  ))}
  </div>
  </div>
  </div>
  </div>

  {/* FAQ List */}
  <div className="py-12">
  <div className="container mx-auto px-4">
  <div className="max-w-4xl mx-auto">
  {filteredFAQs.length === 0 ? (
  <div className="text-center py-12">
  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  <p className="text-gray-600 text-lg">
  No results found. Try a different search term or category.
  </p>
  </div>
  ) : (
  <div className="space-y-3">
  {filteredFAQs.map((faq, index) => (
  <div
  key={index}
  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
  <button
  onClick={() => toggleFAQ(index)}
  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
  <span className="font-semibold text-gray-900 pr-4">
  {faq.question}
  </span>
  <ChevronDown
  className={`w-5 h-5 text-blue-900 shrink-0 transition-transform ${
  openIndex === index ? 'rotate-180' : ''
  }`}
  />
  </button>
  {openIndex === index && (
  <div className="px-6 pb-4 pt-2">
  <p className="text-gray-700 leading-relaxed">
  {faq.answer}
  </p>
  </div>
  )}
  </div>
  ))}
  </div>
  )}
  </div>
  </div>
  </div>

  {/* Still Have Questions */}
  <div className="bg-linear-to-br from-blue-900 to-blue-800 text-white py-16">
  <div className="container mx-auto px-4">
  <div className="max-w-3xl mx-auto text-center">
  <Mail className="w-16 h-16 mx-auto mb-6" />
  <h2 className="text-3xl font-bold mb-4">
  Still Have Questions?
  </h2>
  <p className="text-xl text-blue-100 mb-8">
  Can't find what you're looking for? We're here to help.
  </p>
  <div className="grid md:grid-cols-2 gap-4 mb-8">
  <div className="bg-blue-800 rounded-lg p-6">
  <h3 className="font-bold text-lg mb-2">Email Support</h3>
  <a href="mailto:support@itruthnews.com" className="text-blue-200 hover:text-white">
  support@itruthnews.com
  </a>
  <p className="text-blue-200 text-sm mt-2">Response within 24-48 hours</p>
  </div>
  <div className="bg-blue-800 rounded-lg p-6">
  <h3 className="font-bold text-lg mb-2">Contact Form</h3>
  <Link href="/contact" className="text-blue-200 hover:text-white">
  Submit a detailed inquiry
  </Link>
  <p className="text-blue-200 text-sm mt-2">For complex questions</p>
  </div>
  </div>
  <Link 
  href="/contact" 
  className="inline-block px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
  Contact Us
  </Link>
  </div>
  </div>
  </div>

  {/* Quick Links */}
  <div className="bg-white py-12">
  <div className="container mx-auto px-4">
  <div className="max-w-4xl mx-auto">
  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
  Helpful Resources
  </h3>
  <div className="grid md:grid-cols-4 gap-4 text-center">
  <Link href="/about" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
  <p className="font-semibold text-gray-900">About Us</p>
  </Link>
  <Link href="/ethics-policy" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
  <p className="font-semibold text-gray-900">Ethics Policy</p>
  </Link>
  <Link href="/membership" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
  <p className="font-semibold text-gray-900">Membership</p>
  </Link>
  <Link href="/corrections" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
  <p className="font-semibold text-gray-900">Corrections</p>
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