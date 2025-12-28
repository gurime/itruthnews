// api/get-article-count/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import supabase from '@/app/supabase/supabase';

export async function GET() {
try {
const headersList = await headers();
const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() 
|| headersList.get('x-real-ip') 
|| 'unknown';

const today = new Date().toLocaleDateString("en-CA");

console.log(`📊 Getting article count for IP: ${ip}`);

// Get count of unique articles read today by this IP
const { data: allReads, error } = await supabase
.from('guest_article_reads')
.select('article_id')
.eq('ip_address', ip)
.eq('date', today);

if (error) {
console.error('Database error:', error);
return NextResponse.json({ 
count: 0,
error: 'Database error',
details: error.message
}, { status: 500 });
}

const count = allReads?.length || 0;

console.log(`✅ Current count: ${count}/5`);

return NextResponse.json({ count });

} catch (error) {
console.error('Server error:', error);
return NextResponse.json({ 
count: 0,
error: 'Server error',
details: error instanceof Error ? error.message : 'Unknown error'
}, { status: 500 });
}
}