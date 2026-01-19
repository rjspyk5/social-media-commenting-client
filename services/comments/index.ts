'use server'

import { axiosSequre } from "@/utils/axiosSequre"
import { revalidatePath } from "next/cache"

export async function giveLike(id: string) {
    const res = await axiosSequre.put(`/comments/like/${id}`)
    if (!res.success) throw new Error("Like failed")
    revalidatePath("/comments")
}

export async function giveDislike(id: string) {
    const res = await axiosSequre.put(`/comments/dislike/${id}`)
    if (!res.success) throw new Error("Dislike failed")
    revalidatePath("/comments")
}

export async function createComment(text: string) {
    const res = await axiosSequre.post("/comments", { text })
    if (!res.success) throw new Error("Create comment failed")
    revalidatePath("/comments")
}

export async function editComment(id: string, text: string) {
    const res = await axiosSequre.put(`/comments/${id}`, { text })
    if (!res.success) throw new Error("Edit comment failed")
    revalidatePath("/")
}

export async function deleteComment(id: string) {
    const res = await axiosSequre.delete(`/comments/${id}`)
    if (!res.success) throw new Error("Delete comment failed")
    revalidatePath("/")
}