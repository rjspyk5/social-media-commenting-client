'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Reply, Lock } from "lucide-react"
import { CommentType } from '@/types/comments/comment.types'
import { useTransition } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useForm } from 'react-hook-form'

interface Props {
    data: {
        allComments: CommentType[]
        totalPages: number
        total: number
    }
}


export default function Comments({ data }: Props) {
    const user = useAppSelector(state => state.auth.user)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<{ text: string }>()

    const currentPage = Number(searchParams.get('page')) || 1

    const goToPage = (page: number) => {
        startTransition(() => {
            router.push(`?page=${page}`)
        })
    }

    const onSubmit = async (data: { text: string }) => {

        console.log('Create comment:', data)

        reset()
    }

    return (
        <div className="space-y-6">


            {user ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="border rounded-xl p-4 bg-white shadow-sm space-y-3"
                >
                    <p className="text-sm font-medium">
                        Comment as <span className="font-semibold">{user.name}</span>
                    </p>

                    <textarea
                        rows={3}
                        placeholder="Write your comment..."
                        className="w-full resize-none rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('text', {
                            required: 'Comment cannot be empty',
                            minLength: {
                                value: 3,
                                message: 'Comment must be at least 3 characters',
                            },
                        })}
                    />

                    {errors.text && (
                        <p className="text-xs text-red-500">{errors.text.message}</p>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : 'Create Comment'}
                        </Button>
                    </div>
                </form>
            ) : (

                <div className="border rounded-xl p-6 bg-muted/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-muted">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                Join the conversation
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Please log in to write a comment and engage with others.
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => router.push('/login')}>
                        Log in
                    </Button>
                </div>
            )}

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
