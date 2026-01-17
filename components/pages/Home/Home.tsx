import { Card, CardContent } from "@/components/ui/card"
import Comments from "../Comments/Comments"
import { CommentType } from "@/types/comments/comment.types"

export default function HomePage({ data }: { data: { allComments
: CommentType[], totalPages: number, total: number } }) {

    return (
        <section className="relative min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center px-4 py-10">


            <Card className="w-full max-w-4xl shadow-xl border border-black/5 bg-white/80 backdrop-blur-lg">
                <CardContent className="p-6 sm:p-8 md:p-10 space-y-8">


                    <div className="flex justify-center">
                        <span className="inline-flex items-center rounded-full bg-orange-500/10 px-4 py-1 text-sm font-medium text-orange-600">
                            Rakibul Comment Zone
                        </span>
                    </div>


                    <div className="text-center space-y-3">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                            Welcome to the{" "}
                            <span className="bg-linear-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                                Retro Forum
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
                            Share your thoughts, react to comments, and join meaningful discussions.
                            Built with modern technologies for speed, security, and scalability.
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
