'use client';


import { Shield, AlertCircle, Users, BookOpen, Eye, CheckCircle, Scale, Globe } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function EthicsPolicy() {
const sections = [
{
icon: <Shield className="w-8 h-8" />,
title: "Editorial Independence",
content: [
{
subtitle: "Newsroom Autonomy",
text: "Our newsroom operates with complete independence from our business operations, ownership, and funding sources. Editorial decisions are made solely by our journalists based on news value, public interest, and journalistic merit."
},
{
subtitle: "No Outside Influence",
text: "We do not allow advertisers, donors, political parties, or other external entities to influence our coverage. Our commitment is to our readers and the truth, not to special interests."
},
{
subtitle: "Separation of News and Opinion",
text: "We maintain a clear distinction between news reporting and opinion content. Opinion pieces are clearly labeled, and our news coverage strives for impartiality and balance."
}
]
},
{
icon: <CheckCircle className="w-8 h-8" />,
title: "Accuracy & Verification",
content: [
{
subtitle: "Multi-Source Verification",
text: "We verify all factual claims through multiple independent sources whenever possible. Single-source stories are clearly identified and contextualized appropriately."
},
{
subtitle: "Expert Consultation",
text: "For technical, scientific, or specialized topics, we consult with relevant experts and subject matter specialists to ensure accuracy and proper context."
},
{
subtitle: "Documentation",
text: "We maintain thorough documentation of our reporting process, including sources, interviews, and research materials, to support the accuracy of our journalism."
},
{
subtitle: "Fact-Checking Process",
text: "Every story undergoes editorial review and fact-checking before publication. Breaking news stories are updated as new information becomes available, with changes clearly noted."
}
]
},
{
icon: <AlertCircle className="w-8 h-8" />,
title: "Corrections & Accountability",
content: [
{
subtitle: "Prompt Corrections",
text: "When we make errors, we correct them quickly and transparently. Corrections are published prominently and include an explanation of what was wrong and why."
},
{
subtitle: "Clarifications",
text: "If a story is unclear or potentially misleading, even if technically accurate, we will publish a clarification to ensure our readers have the full picture."
},
{
subtitle: "Correction Policy",
text: "All corrections are time-stamped and preserved in the article. We do not silently edit articles or remove content without clear notation of what was changed and why."
},
{
subtitle: "Reader Feedback",
text: "We welcome and review reader feedback about our coverage. Concerns about accuracy can be submitted to corrections@itruthnews.com."
}
]
},
{
icon: <Users className="w-8 h-8" />,
title: "Sources & Attribution",
content: [
{
subtitle: "On-the-Record Priority",
text: "We prioritize on-the-record sources who are willing to be identified. Anonymous sources are used sparingly and only when the information is essential and cannot be obtained otherwise."
},
{
subtitle: "Anonymous Source Standards",
text: "When we use anonymous sources, at least one editor must know the source's identity. We provide readers with as much context as possible about why the source requires anonymity and what their motivation might be."
},
{
subtitle: "Proper Attribution",
text: "We clearly attribute information to its source. When we rely on reporting from other news organizations, we credit them appropriately."
},
{
subtitle: "Source Protection",
text: "We are committed to protecting confidential sources and will defend their anonymity, including in legal proceedings if necessary."
}
]
},
{
icon: <Scale className="w-8 h-8" />,
title: "Conflicts of Interest",
content: [
{
subtitle: "Disclosure Requirements",
text: "Our journalists disclose any personal, financial, or professional relationships that could represent actual or perceived conflicts of interest with their coverage."
},
{
subtitle: "Financial Interests",
text: "Journalists are prohibited from covering companies or industries in which they or their immediate family members have significant financial interests."
},
{
subtitle: "Political Activity",
text: "Journalists covering politics may not engage in partisan political activities, make political contributions, or publicly advocate for candidates or parties."
},
{
subtitle: "Gifts & Hospitality",
text: "Our journalists do not accept gifts, free travel, or other benefits from sources or subjects of coverage that could compromise or appear to compromise their independence."
}
]
},
{
icon: <Eye className="w-8 h-8" />,
title: "Privacy & Sensitivity",
content: [
{
subtitle: "Respect for Privacy",
text: "We respect individuals' privacy and only intrude on it when there is clear public interest. We are especially careful with vulnerable individuals and victims of crime or tragedy."
},
{
subtitle: "Informed Consent",
text: "We identify ourselves as journalists and explain the purpose of our reporting when interviewing sources, except in rare cases where public interest clearly outweighs this standard."
},
{
subtitle: "Trauma-Informed Reporting",
text: "When covering traumatic events or interviewing trauma survivors, we approach subjects with sensitivity and allow them control over what they share."
},
{
subtitle: "Minors Protection",
text: "We exercise special care when reporting on or about minors, balancing newsworthiness with the potential impact on young people."
}
]
},
{
icon: <Globe className="w-8 h-8" />,
title: "Diversity & Inclusion",
content: [
{
subtitle: "Diverse Perspectives",
text: "We actively seek diverse voices and perspectives in our reporting, including from communities that are often underrepresented in media."
},
{
subtitle: "Inclusive Newsroom",
text: "We are committed to building a newsroom that reflects the diversity of our audience in terms of race, ethnicity, gender, age, religion, sexual orientation, disability, and background."
},
{
subtitle: "Stereotypes & Bias",
text: "We work to identify and challenge our own biases and avoid perpetuating stereotypes in our coverage."
},
{
subtitle: "Cultural Competence",
text: "We strive for cultural competence in our reporting, consulting with community members and experts to ensure accurate and respectful coverage."
}
]
},
{
icon: <BookOpen className="w-8 h-8" />,
title: "Transparency",
content: [
{
subtitle: "Methodology Disclosure",
text: "For investigations, surveys, and data journalism, we explain our methodology so readers can evaluate our work."
},
{
subtitle: "Funding Transparency",
text: "We are transparent about our funding model and sources of revenue. We clearly distinguish between editorial content and sponsored content."
},
{
subtitle: "Behind the Story",
text: "We often provide readers with information about how a story was reported, including challenges encountered and decisions made."
},
{
subtitle: "Open Dialogue",
text: "Our editors and journalists are available to discuss our coverage and answer questions from readers about our editorial process."
}
]
}
];

return (
<>
<Navbar/>
<div className="bg-gray-100 py-8"></div>

<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="bg-linear-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
<div className="container mx-auto px-4 py-16">
<div className="max-w-4xl mx-auto text-center">
<Shield className="w-16 h-16 mx-auto mb-6" />
<h1 className="text-4xl md:text-5xl font-bold mb-4">
Ethics & Standards Policy
</h1>
<p className="text-xl text-blue-100 mb-4">
Our commitment to journalistic integrity and ethical reporting
</p>
<p className="text-sm text-blue-200">
Last Updated: {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}

</p>
</div>
</div>
</div>

{/* Introduction */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<div className="prose prose-lg max-w-none">
<p className="text-xl text-gray-700 leading-relaxed mb-6">
At iTruth News, our credibility is our most valuable asset. These ethical standards guide 
every aspect of our journalism, from how we gather information to how we present it to our readers.
</p>
<p className="text-xl text-gray-700 leading-relaxed mb-6">
These guidelines apply to all iTruth News journalists, editors, and contributors. They are 
not merely aspirational—they are the foundation of our work and the basis of the trust our 
readers place in us.
</p>
<p className="text-xl text-gray-700 leading-relaxed">
While every situation presents unique challenges, these principles provide a framework for 
ethical decision-making. When in doubt, we err on the side of transparency and public interest.
</p>
</div>
</div>
</div>
</div>

{/* Core Principles */}
<div className="bg-blue-50 py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
Core Principles
</h2>
<div className="grid md:grid-cols-2 gap-6">
<div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<h3 className="text-xl font-bold text-gray-900 mb-2">Seek Truth</h3>
<p className="text-gray-700">
Report information as accurately and completely as possible. Verify before publishing.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<h3 className="text-xl font-bold text-gray-900 mb-2">Act Independently</h3>
<p className="text-gray-700">
Maintain independence from sources, subjects, and special interests.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<h3 className="text-xl font-bold text-gray-900 mb-2">Minimize Harm</h3>
<p className="text-gray-700">
Balance the public's need to know with potential harm to individuals and communities.
</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
<h3 className="text-xl font-bold text-gray-900 mb-2">Be Accountable</h3>
<p className="text-gray-700">
Take responsibility for our work and be transparent with our readers.
</p>
</div>
</div>
</div>
</div>
</div>

{/* Detailed Standards */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-5xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
Detailed Standards
</h2>
<div className="space-y-12">
{sections.map((section, index) => (
<div key={index} className="border-b border-gray-200 pb-12 last:border-b-0">
<div className="flex items-start mb-6">
<div className="text-blue-900 mr-4 mt-1">
{section.icon}
</div>
<div>
<h3 className="text-2xl font-bold text-gray-900 mb-4">
{section.title}
</h3>
</div>
</div>
<div className="space-y-6 ml-12">
{section.content.map((item, idx) => (
<div key={idx}>
<h4 className="text-lg font-semibold text-gray-900 mb-2">
  {item.subtitle}
</h4>
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

{/* Special Considerations */}
<div className="bg-gray-100 py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
Special Considerations
</h2>
<div className="space-y-6">
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">User-Generated Content</h3>
<p className="text-gray-700 mb-3">
When we publish user-generated content, including comments, photos, or videos, we verify 
its authenticity and clearly label it as such. We moderate comments to remove spam, abuse, 
and material that violates our community guidelines.
</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">Social Media</h3>
<p className="text-gray-700 mb-3">
Our journalists maintain professional standards on social media. While they may share their 
work and engage with readers, they avoid partisan advocacy and statements that could compromise 
their credibility or the perception of iTruth News's independence.
</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">Artificial Intelligence</h3>
<p className="text-gray-700 mb-3">
We may use AI tools to assist with research, data analysis, or routine tasks, but all content 
published under the iTruth News name is reported, written, and edited by human journalists. 
When AI tools are used in our journalism, we disclose this to readers.
</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold text-gray-900 mb-3">Partnerships & Collaborations</h3>
<p className="text-gray-700 mb-3">
We occasionally collaborate with other news organizations on major investigations or coverage. 
These partnerships are disclosed, and we maintain editorial control over content published 
under our name.
</p>
</div>
</div>
</div>
</div>
</div>

{/* Enforcement */}
<div className="bg-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
Enforcement & Review
</h2>
<div className="prose prose-lg max-w-none">
<p className="text-gray-700 mb-4">
Our Editor-in-Chief and Editorial Board are responsible for ensuring these standards are 
upheld throughout our newsroom. Violations of these ethical standards may result in 
disciplinary action, up to and including termination.
</p>
<p className="text-gray-700 mb-4">
This ethics policy is reviewed annually and updated as needed to address new challenges 
and reflect evolving best practices in journalism.
</p>
<p className="text-gray-700 mb-4">
We welcome feedback from our readers about our adherence to these standards. Questions 
or concerns can be directed to our Standards Editor.
</p>
</div>
</div>
</div>
</div>

{/* Contact Section */}
<div className="bg-blue-900 text-white py-12">
<div className="container mx-auto px-4">
<div className="max-w-4xl mx-auto text-center">
<h2 className="text-3xl font-bold mb-6">Questions or Concerns?</h2>
<p className="text-xl text-blue-100 mb-8">
We take our ethical standards seriously and welcome your feedback.
</p>
<div className="grid md:grid-cols-3 gap-6">
<div>
<h3 className="font-bold mb-2">Corrections</h3>
<a href="mailto:corrections@itruthnews.com" className="text-blue-200 hover:text-white">
corrections@itruthnews.com
</a>
</div>
<div>
<h3 className="font-bold mb-2">Ethics Questions</h3>
<a href="mailto:standards@itruthnews.com" className="text-blue-200 hover:text-white">
standards@itruthnews.com
</a>
</div>
<div>
<h3 className="font-bold mb-2">General Feedback</h3>
<a href="mailto:feedback@itruthnews.com" className="text-blue-200 hover:text-white">
feedback@itruthnews.com
</a>
</div>
</div>
</div>
</div>
</div>

{/* Footer Links */}
<div className="bg-gray-100 py-8"></div>
</div>

<Footer/>
</>
);
}