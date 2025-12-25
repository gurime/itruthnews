import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import supabase from '@/app/supabase/supabase';

export async function GET() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const today = new Date().toLocaleDateString("en-CA");
  
  const { data } = await supabase
    .from('guest_article_reads')
    .select('count')
    .eq('ip_address', ip)
    .eq('date', today)
    .single();
  
  return NextResponse.json({ count: data?.count || 0 });
}