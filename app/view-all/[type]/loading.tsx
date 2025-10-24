
export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 mb-8 animate-pulse">
                    <div className="h-10 w-48 bg-muted rounded-lg" />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 h-10 bg-muted rounded-lg" />
                        <div className="w-32 h-10 bg-muted rounded-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-muted rounded-2xl mb-4" />
                            <div className="space-y-3">
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-4 bg-muted rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}