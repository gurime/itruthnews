'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import supabase from '../supabase/supabase';
import type { User } from "@supabase/supabase-js";
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
export default function Profile() {
const [menuOpen, setMenuOpen] = useState(false);
const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const [user, setUser] = useState<User | null>(null);
const [email, setEmail] = useState('');
const [firstname, setFirstName] = useState('');
const [isSubscribed, setIsSubscribed] = useState(false);
const [cookieSettings, setCookieSettings] = useState({
necessary: true, // Always true, can't be disabled
analytics: true,
marketing: false,
functional: true,
preferences: true
});


useEffect(() => {
let mounted = true;

const loadProfile = async () => {
const { data: { session } } = await supabase.auth.getSession();
if (!mounted) return;

setUser(session?.user ?? null);

if (session?.user) {
const { data: profileData } = await supabase
.from("profiles")
.select("full_name, email, subscription_status")
.eq("id", session.user.id)
.single();

if (profileData) {
setFirstName(profileData.full_name);
setEmail(profileData.email);

if (profileData.subscription_status !== "free") {
setIsSubscribed(true);
}
}
}

setIsLoading(false);
};

loadProfile();
return () => {
mounted = false;
};
}, []);
return (
<>
<Navbar/>
<h2 className="text-4xl font-bold text-gray-800">
<Link className="hover:underline" href='/profile'>{user ? firstname : ''}</Link>
</h2>
<Footer/>
</>
)
}
