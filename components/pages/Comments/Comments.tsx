'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react"
import { CommentType } from '@/types/comments/comment.types'
import { useTransition } from 'react'

interface Props {
    data: {
        allComments: CommentType[]
        totalPages: number
        total: number
    }
}

export default function Comments({ data }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const currentPage = Number(searchParams.get('page')) || 1

    const goToPage = (page: number) => {
        startTransition(() => {
            router.push(`?page=${page}`)
        })
    }

    return (
        <div className="space-y-6">

            {/* Comments */}
            {data.allComments.map(comment => (
                <div
                    key={comment._id}
                    className="border rounded-xl p-4 bg-white shadow-sm space-y-2"
                >
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-gray-700">{comment.text}</p>

                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {comment.likesCount}
                        </Button>
                        <Button size="sm" variant="ghost">
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            {comment.dislikesCount}
                        </Button>
                        <Button size="sm" variant="ghost">
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                        </Button>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {data.totalPages}
                </p>

                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === 1 || isPending}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Previous
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === data.totalPages || isPending}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
