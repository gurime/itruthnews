'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Goback() {
const router = useRouter()

return (
<div>
<button 
onClick={() => router.back()}
className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase cursor-pointer"
>
← Go Back
</button>

</div>
)
}
