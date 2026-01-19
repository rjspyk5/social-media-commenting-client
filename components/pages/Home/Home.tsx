'use client'

import { Card, CardContent } from "@/components/ui/card"
import Comments from "../Comments/Comments"
import { CommentType } from "@/types/comments/comment.types"
import { Button } from "@/components/ui/button"
import { logOut } from "@/services/auth"
import { useAppSelector } from "@/redux/hooks"

export default function HomePage({
  data,
}: {
  data: {
    allComments: CommentType[]
    totalPages: number
    total: number
  }
}) {
  const user = useAppSelector(state => state.auth.user)

  return (
    <section className="relative min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 flex items-start sm:items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
      
      {user && (
        <span
          onClick={logOut}
          className="fixed right-2 md:right-5 bottom-5  z-50 text-red-500 underline hover:cursor-pointer"
        >
          Logout
        </span>
      )}

      <Card className="w-full max-w-4xl shadow-xl border border-black/5 bg-white/80 backdrop-blur-lg">
        <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full bg-orange-500/10 px-4 py-1 text-xs sm:text-sm font-medium text-orange-600">
              Rakibul Comment Zone
            </span>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Welcome to the{" "}
              <span className="bg-linear-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                Retro Forum
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              Share your thoughts, react to comments, and join meaningful discussions.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <Comments data={data} />
          </div>

        </CardContent>
      </Card>
    </section>
  )
}
