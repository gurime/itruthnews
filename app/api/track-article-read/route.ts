// api/track-article-read/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import supabase from '@/app/supabase/supabase';

export async function POST(request: Request) {
try {
const headersList = await headers();
const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() 
|| headersList.get('x-real-ip') 
|| 'unknown';


const today = new Date().toLocaleDateString("en-CA");

// Get body
const body = await request.json();

// Check current count from database
const { data: existing, error: fetchError } = await supabase
.from('guest_article_reads')
.select('count')
.eq('ip_address', ip)
.eq('date', today)
.maybeSingle();


if (fetchError) {
return NextResponse.json({ 
allowed: false, 
count: 0,
error: 'Database fetch error',
details: fetchError.message
}, { status: 500 });
}

const currentCount = existing?.count || 0;

// Check if limit reached
if (currentCount >= 5) {
console.log('🚫 Limit reached');
return NextResponse.json({ 
allowed: false, 
count: currentCount 
});
}

// Increment count
const newCount = currentCount + 1;

const upsertData = { 
ip_address: ip, 
date: today, 
count: newCount
};


const { data: upsertResult, error: upsertError } = await supabase
.from('guest_article_reads')
.upsert(upsertData, { 
onConflict: 'ip_address,date'
})
.select();


if (upsertError) {
return NextResponse.json({ 
allowed: false, 
count: currentCount,
error: 'Database upsert error',
details: upsertError.message
}, { status: 500 });
}

return NextResponse.json({ 
allowed: true, 
count: newCount 
});

} catch (error) {
return NextResponse.json({ 
allowed: false, 
count: 0,
error: 'Server error',
details: error instanceof Error ? error.message : 'Unknown error'
}, { status: 500 });
}
}