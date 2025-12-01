'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
const [openSection, setOpenSection] = useState<string | null>(null);
const toggleSection = (section: string) => {
setOpenSection(openSection === section ? null : section);
};

  const scrollToTop = () => {
    // Scroll instantly to the top
window.scrollTo({ top: 0, behavior: 'smooth' });
    };


return (
<footer className=" text-white py-12 mt-12 dark:bg-blue-900">

<div className="container mx-auto px-4">

{/* Grid */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

{/* ABOUT */}
<div>
<Link href="/">
<Image
onClick={scrollToTop}
title='Back To Top'
src="/images/it_news.png"
alt="iTruth News Logo"
width={150}
height={50}
className="mb-4"/>
</Link>

<p className="text-blue-100 text-sm">
Delivering accurate coverage you can rely on. Stay informed with truly clear reporting.
</p>
</div>

{/* Company */}
<FooterCollapse
title="Company"
section="company"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/about" label="About Us" />
<FooterLink href="/contact" label="Contact" />
<FooterLink href="/advertise" label="Advertise" />
<FooterLink href="/careers" label="Careers" />
<FooterLink href="/press" label="Press & Media" />
<FooterLink href="/contributors" label="Become a Contributor" />
<FooterLink href="/editorial" label="Editorial Guidelines" />
</FooterCollapse>

{/* Support */}
<FooterCollapse
title="Support"
section="support"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/help" label="Help Center" />
<FooterLink href="/feedback" label="Send Feedback" />
<FooterLink href="/corrections" label="Report a Correction" />
<FooterLink href="/faq" label="FAQs" />
<FooterLink href="/submit-tip" label="Submit a Story Tip" />
<FooterLink href="/community" label="Community Guidelines" />
</FooterCollapse>

{/* Legal */}
<FooterCollapse
title="Legal"
section="legal"
openSection={openSection}
toggleSection={toggleSection}
>
<FooterLink href="/privacy" label="Privacy Policy" />
<FooterLink href="/terms" label="Terms of Service" />
<FooterLink href="/cookies" label="Cookie Policy" />
<FooterLink href="/licensing" label="Licensing & Permissions" />
<FooterLink href="/accessibility" label="Accessibility Statement" />
</FooterCollapse>
</div>

{/* COPYRIGHT */}
<div className="border-t border-blue-600 pt-6 text-center">
<p className="text-blue-100 text-sm">
&copy; {new Date().getFullYear()} iTruth News. All rights reserved.
</p>
</div>

</div>
</footer>
);
}

/* Collapse wrapper for mobile */
function FooterCollapse({
title,
section,
openSection,
toggleSection,
children,
}: {
title: string;
section: string;
openSection: string | null;
toggleSection: (s: string) => void;
children: React.ReactNode;
}) {

const isOpen = openSection === section;

return (
<div>
<button
onClick={() => toggleSection(section)}
className="w-full flex justify-between items-center md:cursor-default md:pointer-events-none md:mb-4">

<h4 className="text-lg font-semibold">{title}</h4>
<ChevronDown
className={`h-5 w-5 md:hidden transition-transform duration-300 cursor-pointer ${isOpen ? 'rotate-180' : ''}`}/>
</button>

<div
className={`overflow-hidden cursor-pointer transition-all duration-300 md:block ${isOpen ? 'max-h-40 mt-2' : 'max-h-0 md:max-h-none'}`}>
<ul className="space-y-2 text-sm">{children}</ul>
</div>
</div>
);
}

/* Simple link component */
function FooterLink({ href, label }: { href: string; label: string }) {
return (
<li>
<a
href={href} className="text-blue-100  hover:text-white transition-colors duration-200">{label}
</a>
</li>
);
}
