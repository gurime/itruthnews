'use client'
import { Bookmark } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import supabase from '../supabase/supabase'
import toast from 'react-hot-toast'

interface BookmarkButtonProps {
articleId: string;
articleTitle: string;
articleUrl: string;
articleImage?: string;
articleExcerpt?: string;
}

export default function BookmarkButton({ 
articleId, 
articleTitle, 
articleUrl,
articleImage,
articleExcerpt 
}: BookmarkButtonProps) {
const [isBookmarked, setIsBookmarked] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
checkBookmarkStatus();
}, [articleId]);

const checkBookmarkStatus = async () => {
const { data: { session } } = await supabase.auth.getSession();

if (!session?.user) {
setUserId(null);
return;
}

setUserId(session.user.id);

// Check if article is already bookmarked
const { data } = await supabase
.from('bookmarks')
.select('id')
.eq('user_id', session.user.id)
.eq('article_id', articleId)
.single();

setIsBookmarked(!!data);
};

const handleBookmark = async () => {
// Check if user is logged in
const { data: { session } } = await supabase.auth.getSession();

if (!session?.user) {
toast.error('Please sign in to bookmark articles');
return;
}

setIsLoading(true);

try {
if (isBookmarked) {
// Remove bookmark
const { error } = await supabase
.from('bookmarks')
.delete()
.eq('user_id', session.user.id)
.eq('article_id', articleId);

if (error) throw error;

setIsBookmarked(false);
toast.success('Bookmark removed');
} else {
// Add bookmark
const { error } = await supabase
.from('bookmarks')
.insert([{
user_id: session.user.id,
article_id: articleId,
article_title: articleTitle,
article_url: articleUrl,
article_image: articleImage,
article_excerpt: articleExcerpt,
created_at: new Date().toISOString()
}]);

if (error) throw error;

setIsBookmarked(true);
toast.success('Article bookmarked!');
}
} catch (error: any) {
toast.error(`Failed: ${error.message}`);
} finally {
setIsLoading(false);
}
};

return (
<button
onClick={handleBookmark}
disabled={isLoading}
className={`p-2 rounded-full transition-colors ${
isBookmarked
? 'bg-blue-900 text-white hover:bg-blue-800'
: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}>
<Bookmark 
className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
/>
</button>
);
}