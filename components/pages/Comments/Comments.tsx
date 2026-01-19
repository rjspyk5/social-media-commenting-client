'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Reply, Lock, Edit, Trash2, Loader2 } from "lucide-react"
import { CommentType } from '@/types/comments/comment.types'
import { useTransition, useState, useEffect } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useForm } from 'react-hook-form'
import { giveLike, giveDislike, createComment, editComment, deleteComment } from '@/services/comments'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    const [comments, setComments] = useState<CommentType[]>(data.allComments)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [editingLoading, setEditingLoading] = useState(false)
    useEffect(() => {
        setComments(data.allComments)
    }, [data.allComments])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<{ text: string }>()

    const currentPage = Number(searchParams.get('page')) || 1
    const currentSort = searchParams.get('sort') || 'newest'

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        startTransition(() => router.push(`?${params.toString()}`))
    }

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', value)
        params.set('page', '1')
        router.push(`?${params.toString()}`)
    }

    const onSubmit = async ({ text }: { text: string }) => {
        if (!user) return
        try {
            await createComment(text)
            reset()
            startTransition(() => {
                router.refresh()
            })
        } catch {
            alert("Failed to create comment")
        }
    }

    const handleLike = async (id: string, liked: boolean | null) => {
        if (!user) return router.push("/login")
        if (liked) return alert("You have already liked this")

        const prev = comments
        setComments(comments =>
            comments.map(c =>
                c._id === id
                    ? {
                        ...c,
                        likes: c.likes.includes(user.id)
                            ? c.likes.filter(i => i !== user.id)
                            : [...c.likes, user.id],
                        dislikes: c.dislikes.filter(i => i !== user.id),
                        likesCount: c.likes.includes(user.id)
                            ? c.likesCount - 1
                            : c.likesCount + 1,
                        dislikesCount: c.dislikes.includes(user.id)
                            ? c.dislikesCount - 1
                            : c.dislikesCount,
                    }
                    : c
            )
        )

        try {
            await giveLike(id)
        } catch {
            setComments(prev)
            alert("Like failed")
        }
    }

    const handleDislike = async (id: string, alreadyDislike: boolean | null) => {
        if (!user) return router.push("/login")
        if (alreadyDislike) return alert("You have already disliked this")

        const prev = comments

        setComments(comments =>
            comments.map(c =>
                c._id === id
                    ? {
                        ...c,
                        dislikes: c.dislikes.includes(user.id)
                            ? c.dislikes.filter(i => i !== user.id)
                            : [...c.dislikes, user.id],
                        likes: c.likes.filter(i => i !== user.id),
                        dislikesCount: c.dislikes.includes(user.id)
                            ? c.dislikesCount - 1
                            : c.dislikesCount + 1,
                        likesCount: c.likes.includes(user.id)
                            ? c.likesCount - 1
                            : c.likesCount,
                    }
                    : c
            )
        )

        try {
            await giveDislike(id)
        } catch {
            setComments(prev)
            alert("Dislike failed")
        }
    }

    const startEdit = (comment: CommentType) => {
        setEditingId(comment._id)
        setEditText(comment.text)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditText('')
    }

    const handleEdit = async (id: string) => {
        if (!editText.trim() || editText.length < 3) {
            alert("Comment must be at least 3 characters")
            return
        }

        setEditingLoading(true)
        try {
            await editComment(id, editText)
            setComments(comments =>
                comments.map(c =>
                    c._id === id ? { ...c, text: editText } : c
                )
            )
            cancelEdit()
            startTransition(() => {
                router.refresh()
            })
        } catch (error) {
            alert("Failed to edit comment")
        } finally {
            setEditingLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return

        setDeletingId(id)
        try {
            await deleteComment(id)
            setComments(comments => comments.filter(c => c._id !== id))
            startTransition(() => {
                router.refresh()
            })
        } catch (error) {
            alert("Failed to delete comment")
            startTransition(() => {
                router.refresh()
            })
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6 px-2 sm:px-4 md:px-0">
            {user ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="border p-3 sm:p-4 rounded-xl space-y-3"
                >
                    <textarea
                        rows={3}
                        {...register("text", { required: true, minLength: 3 })}
                        className="w-full border rounded-md p-2"
                        placeholder="Write a comment..."
                    />
                    {errors.text && (
                        <p className="text-red-500 text-xs">Invalid comment</p>
                    )}

                    <div className="flex justify-end">
                        <Button disabled={isSubmitting} className="w-full sm:w-auto">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post"
                            )}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border p-4 rounded-xl">
                    <div className="flex gap-2 items-center">
                        <Lock size={16} />
                        <span>Login to comment</span>
                    </div>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </Button>
                </div>
            )}


            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <span className="text-sm text-gray-600">
                    {data.total} {data.total === 1 ? "comment" : "comments"}
                </span>

                <Select
                    value={currentSort}
                    onValueChange={handleSortChange}
                    disabled={isPending}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="mostLiked">Most Liked</SelectItem>
                        <SelectItem value="mostDisliked">Most Disliked</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isPending && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
            )}

            {comments.map((comment) => {
                const liked = user && comment.likes.includes(user.id)
                const disliked = user && comment.dislikes.includes(user.id)
                const isAuthor = user && comment.author._id === user.id
                const isDeleting = deletingId === comment._id

                return (
                    <div
                        key={comment._id}
                        className={`border p-3 sm:p-4 rounded-xl space-y-2 break-words transition-opacity ${isDeleting ? "opacity-50" : "opacity-100"
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                            <span className="font-medium">
                                {comment.author.name}
                            </span>
                            <span className="text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {editingId === comment._id ? (
                            <div className="space-y-2">
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full border rounded-md p-2"
                                    rows={3}
                                    disabled={editingLoading}
                                />

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleEdit(comment._id)}
                                        disabled={editingLoading}
                                        className="w-full sm:w-auto"
                                    >
                                        {editingLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEdit}
                                        disabled={editingLoading}
                                        className="w-full sm:w-auto"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm sm:text-base">{comment.text}</p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleLike(comment._id, liked)
                                    }
                                    disabled={!user || isDeleting}
                                    className="text-xs sm:text-sm"
                                >
                                    <ThumbsUp
                                        size={16}
                                        className={liked ? "text-green-500" : ""}
                                    />
                                    <span className="ml-1">
                                        {comment.likesCount}
                                    </span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleDislike(comment._id, disliked)
                                    }
                                    disabled={!user || isDeleting}
                                    className="text-xs sm:text-sm"
                                >
                                    <ThumbsDown
                                        size={16}
                                        className={
                                            disliked ? "text-red-500" : ""
                                        }
                                    />
                                    <span className="ml-1">
                                        {comment.dislikesCount}
                                    </span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    className="text-xs sm:text-sm"
                                >
                                    <Reply size={14} />
                                    <span className="ml-1">Reply</span>
                                </Button>
                            </div>

                            {isAuthor && editingId !== comment._id && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => startEdit(comment)}
                                        disabled={isDeleting}
                                    >
                                        <Edit size={14} />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(comment._id)
                                        }
                                        disabled={isDeleting}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}

            {data.totalPages > 1 && (
                <div className="flex  justify-between items-center gap-3">
                    <Button
                        className=""
                        disabled={currentPage === 1 || isPending}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {data.totalPages}
                    </span>

                    <Button
                        className=""
                        disabled={
                            currentPage === data.totalPages || isPending
                        }
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>

    )
}