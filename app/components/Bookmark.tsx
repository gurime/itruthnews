'use client'

import { Bookmark } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import supabase from '../supabase/supabase'
import toast from 'react-hot-toast'

interface BookmarkButtonProps {
articleId: string
articleTitle: string
articleUrl: string
articleImage?: string
articleExcerpt?: string
}

export default function BookmarkButton({
articleId,
articleTitle,
articleUrl,
articleImage,
articleExcerpt
}: BookmarkButtonProps) {
const [isSaved, setIsSaved] = useState(false)
const [isLoading, setIsLoading] = useState(false)
const [userId, setUserId] = useState<string | null>(null)

useEffect(() => {
checkSavedStatus()
}, [articleId])

const checkSavedStatus = async () => {
const { data: { session } } = await supabase.auth.getSession()

if (!session?.user) {
setUserId(null)
return
}

setUserId(session.user.id)

const { data } = await supabase
.from('bookmarks')
.select('id')
.eq('user_id', session.user.id)
.eq('article_id', articleId)
.maybeSingle()

setIsSaved(!!data)
}

const handleSaveArticle = async () => {
const { data: { session } } = await supabase.auth.getSession()

if (!session?.user) {
toast.error('Please sign in to save articles')
return
}

setIsLoading(true)

try {
if (isSaved) {
const { error } = await supabase
.from('bookmarks')
.delete()
.eq('user_id', session.user.id)
.eq('article_id', articleId)

if (error) throw error

setIsSaved(false)
toast.success('Removed from saved articles')
} else {
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
}])

if (error) throw error

setIsSaved(true)
toast.success('Article saved')
}
} catch (error: any) {
toast.error(`Failed: ${error.message}`)
} finally {
setIsLoading(false)
}
}

return (
<button
onClick={handleSaveArticle}
disabled={isLoading}
className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
isSaved
? 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
: 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
>
<Bookmark className={`w-5 h-5 cursor-pointer ${isSaved ? 'fill-current' : ''}`} />
<span className="hidden sm:inline">
{isSaved ? 'Article Saved' : 'Save Article'}
</span>
</button>

)
}
