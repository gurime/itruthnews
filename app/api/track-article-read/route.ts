// api/track-article-read/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import supabase from '@/app/supabase/supabase';

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const today = new Date().toLocaleDateString("en-CA");
  
  // Check current count from database
  const { data: existing } = await supabase
    .from('guest_article_reads')
    .select('count')
    .eq('ip_address', ip)
    .eq('date', today)
    .single();
  
  const currentCount = existing?.count || 0;
  
  if (currentCount >= 5) {
    return NextResponse.json({ allowed: false, count: currentCount });
  }
  
  // Increment or insert
  await supabase
    .from('guest_article_reads')
    .upsert({ 
      ip_address: ip, 
      date: today, 
      count: currentCount + 1 
    });
  
  return NextResponse.json({ allowed: true, count: currentCount + 1 });
}