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
    
    // Get articleId from request body
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ 
        allowed: false, 
        count: 0,
        error: 'Article ID required'
      }, { status: 400 });
    }

    console.log(`📖 Tracking article: ${articleId} for IP: ${ip}`);

    // Check if this specific article has already been read today by this IP
    const { data: existingRead, error: checkError } = await supabase
      .from('guest_article_reads')
      .select('*')
      .eq('ip_address', ip)
      .eq('date', today)
      .eq('article_id', articleId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check error:', checkError);
      return NextResponse.json({ 
        allowed: false, 
        count: 0,
        error: 'Database check error',
        details: checkError.message
      }, { status: 500 });
    }

    // If already read, just return the current count without incrementing
    if (existingRead) {
      console.log('✅ Article already read, not incrementing');
      
      // Get total count of unique articles read today
      const { data: allReads, error: countError } = await supabase
        .from('guest_article_reads')
        .select('article_id')
        .eq('ip_address', ip)
        .eq('date', today);

      if (countError) {
        console.error('Count error:', countError);
        return NextResponse.json({ 
          allowed: false, 
          count: 0,
          error: 'Database count error',
          details: countError.message
        }, { status: 500 });
      }

      const count = allReads?.length || 0;
      
      return NextResponse.json({ 
        allowed: true, 
        count,
        alreadyRead: true
      });
    }

    // Get current count of unique articles read today
    const { data: allReads, error: fetchError } = await supabase
      .from('guest_article_reads')
      .select('article_id')
      .eq('ip_address', ip)
      .eq('date', today);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ 
        allowed: false, 
        count: 0,
        error: 'Database fetch error',
        details: fetchError.message
      }, { status: 500 });
    }

    const currentCount = allReads?.length || 0;

    // Check if limit reached
    if (currentCount >= 5) {
      console.log('🚫 Limit reached');
      return NextResponse.json({ 
        allowed: false, 
        count: currentCount 
      });
    }

    // Insert new article read record
    const { error: insertError } = await supabase
      .from('guest_article_reads')
      .insert({
        ip_address: ip,
        date: today,
        article_id: articleId
      });

    if (insertError) {
      // If it's a unique constraint error, the article was already tracked
      if (insertError.code === '23505') {
        console.log('✅ Article already tracked (race condition)');
        const count = currentCount;
        return NextResponse.json({ 
          allowed: true, 
          count,
          alreadyRead: true
        });
      }

      console.error('Insert error:', insertError);
      return NextResponse.json({ 
        allowed: false, 
        count: currentCount,
        error: 'Database insert error',
        details: insertError.message
      }, { status: 500 });
    }

    const newCount = currentCount + 1;

    console.log(`✅ Article tracked. New count: ${newCount}/5`);

    return NextResponse.json({ 
      allowed: newCount < 5, 
      count: newCount 
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      allowed: false, 
      count: 0,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}