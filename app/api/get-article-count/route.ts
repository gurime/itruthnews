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

const { data, error } = await supabase
.from('guest_article_reads')
.select('count')
.eq('ip_address', ip)
.eq('date', today)
.maybeSingle(); // Use maybeSingle() to avoid error when no row exists

if (error) {
return NextResponse.json({ count: 0, error: 'Database error' }, { status: 500 });
}

return NextResponse.json({ 
count: data?.count || 0 
});

} catch (error) {
return NextResponse.json({ count: 0, error: 'Server error' }, { status: 500 });
}
}