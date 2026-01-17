import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
    return (
        <section className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-[#f7ebeb] via-[#ffffff] slate-900 to-[[#ffffff]] text-white overflow-hidden">
            <Card className="relative z-10 w-full max-w-3xl border-slate-800 bg-[#1e1d1d81] backdrop-blur">
                <CardContent className="p-10 text-center space-y-6">

                    <span className="inline-block rounded-full bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400">
                        Rakibul Comment Zone
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Welcome to the{" "}
                        <span className="bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            Retro Forum
                        </span>
                    </h1>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Share your thoughts, react to comments, and join meaningful
                        discussions. Built with modern technologies for speed, security,
                        and scalability.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <Button size="lg" className="bg-linear-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90">
                            Create Comment
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-slate-700 text-slate-200 hover:bg-slate-800"
                        >
                            View Comments
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </section>
    );
}
