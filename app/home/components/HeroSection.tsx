import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const HeroSection = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    loading,
}: {
    searchQuery: string
    setSearchQuery: (value: string) => void
    handleSearch: (e: React.FormEvent) => void
    loading: boolean
}) => (
    <section className="pt-8 sm:pt-16 mb-0">
        <div className="container px-3 sm:px-4 mb-0 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
                <div className="space-y-4 sm:space-y-6">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Your Local{" "}
                        <span className="bg-gradient-to-r from-primary via-primary/90 to-purple-600 bg-clip-text text-transparent">
                            Markets
                        </span>
                    </h1>
                    <p className="text-sm sm:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
                        Explore stalls without wandering all over town
                    </p>
                </div>

                <form onSubmit={handleSearch} className="mt-6 sm:mt-10">
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        <div className="relative">
                            <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                            <Input
                                type="search"
                                placeholder="Search for stalls, food, or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 sm:pl-14 min-h-[50px] pr-20 sm:pr-32 py-4 sm:py-7 text-sm sm:text-lg rounded-xl sm:rounded-2xl border-0 shadow-lg shadow-black/5 dark:shadow-black/20 group-focus-within:shadow-xl group-focus-within:shadow-primary/10 transition-all bg-background/80 backdrop-blur-sm ring-1 ring-border/40 focus-visible:ring-2 focus-visible:ring-primary/50"
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-4 sm:px-8 text-sm rounded-lg sm:rounded-xl bg-gradient-to-r from-primary via-primary/95 to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span className="font-medium hidden sm:inline">Searching...</span>
                                        <span className="font-medium sm:hidden">...</span>
                                    </div>
                                ) : (
                                    <span className="font-medium">Search</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
)

export default HeroSection