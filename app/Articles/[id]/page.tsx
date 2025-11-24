import Navbar from '@/app/components/nabar';
import supabase from '../../supabase/supabase';
import Link from 'next/link';
import { JSX } from "react";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<{ title: string }> {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('article')
      .select('title')
      .eq('id', id)
      .single();

    if (error || !data) {
      return { title: 'iTruth News | Page Not Found' };
    }

    return { title: `iTruth News | ${data.title}` };
  } catch (error) {
    return { title: 'iTruth News | Page Not Found' };
  }
}

export default async function DetailsPage({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const { id } = await params;

  // Fetch the article details from Supabase
  const { data, error } = await supabase
    .from('article')
    .select('title, image, content, created_at')
    .eq('id', id)
    .single();

  if (error) {
    return <div className="container mx-auto p-6">Error loading article.</div>;
  }

  if (!data) {
    return <div className="container mx-auto p-6">Article not found.</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <div className='flex items-center mb-4 '> 
        <p className="text-gray-600 mb-6 flex justify-between w-full">📅 {new Date(data.created_at).toLocaleDateString()}   <Link href="/" className="text-blue-600 hover:underline mt-6 inline-block">
        ← Back to Home
      </Link></p>
     
      </div>
     
      <img src={data.image} alt={data.title} className="w-full h-auto mb-6 object-cover" />
      <div className="prose max-w-none">
        <p>{data.content}</p>
      </div>
    
    </div>
    </>
  );
}