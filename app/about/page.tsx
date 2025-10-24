import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb, Heart, Zap, TrendingUp } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
    const teamValues = [
        {
            icon: Target,
            title: "Our Mission",
            description:
                "To empower local communities by creating a unified marketplace where vendors of all kinds—from restaurants to fashion boutiques—can thrive, and where customers discover quality products and services within their budget.",
            color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description:
                "We're building the future of local commerce with smart recommendations, location-based discovery, and budget-conscious shopping at the intersection of technology and community.",
            color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
        },
        {
            icon: Heart,
            title: "Community",
            description:
                "We believe in supporting local businesses and fostering connections between vendors and customers who genuinely care about quality and fair pricing.",
            color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
        },
    ];

    const coreValues = [
        {
            icon: Users,
            title: "Community First",
            description:
                "Every decision is centered around empowering local vendors and serving our users' real needs.",
        },
        {
            icon: Zap,
            title: "Speed & Simplicity",
            description:
                "Fast, frictionless discovery that connects people to exactly what they're looking for in their neighborhood.",
        },
        {
            icon: TrendingUp,
            title: "Growth Mindset",
            description:
                "We're constantly evolving and learning from our users to build the marketplace that local commerce deserves.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="py-16 md:py-24 px-4 md:px-6">
                <div className="container max-w-6xl mx-auto">
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-block">
                            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                About MarketRadar
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                                Your Smart Radar for Local Deals
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            MarketRadar is reimagining local commerce by connecting communities with a diverse marketplace of stalls, shops, and vendors. From restaurants to fashion, food to services—discover what you need within your budget.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 md:py-24 px-4 md:px-6">
                <div className="container max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            What Drives Us
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Our mission, innovation spirit, and community focus guide everything we do
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {teamValues.map((value, index) => (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
                            >
                                <CardContent className="p-8 text-center space-y-4">
                                    <div className="relative">
                                        <div
                                            className={`w-16 h-16 mx-auto rounded-2xl ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <value.icon className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-muted/30 to-background">
                <div className="container max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            These principles shape how we serve our customers and empower vendors
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 bg-card/50 hover:bg-card hover:shadow-lg"
                            >
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <value.icon className="h-6 w-6 text-primary group-hover:text-purple-600 transition-colors duration-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 md:py-24 px-4 md:px-6">
                <div className="container max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                Our Journey
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                MarketRadar started with a simple observation: discovering local businesses within your budget shouldn&apos;t be difficult. Whether you&apos;re looking for a great meal, new clothes, or quality services, people were spending too much time searching and too much money overspending.
                            </p>

                            <p>
                                We realized that local commerce needed a smarter solution—one that works for both customers and vendors. A platform that empowers small business owners to reach their community directly, while helping customers discover exactly what they need at prices they can afford.
                            </p>

                            <p>
                                Today, we&apos;re at an exciting MVP stage, building the foundation of what MarketRadar will become. We&apos;re focused on getting the fundamentals right: seamless vendor onboarding, intelligent search and filtering, and genuine community connections. Our early users and vendors are helping us shape the future of local commerce.
                            </p>

                            <p>
                                We&apos;re committed to growing thoughtfully, listening to feedback, and continuously improving our platform. Whether you&apos;re a restaurant owner, boutique manager, or service provider—or a customer looking for local deals—MarketRadar is here to power your community&apos;s economy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MVP Stage Section */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-muted/30 to-background">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            We&apos;re Just Getting Started
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            MarketRadar is in MVP stage, and we&apos;re building this with our community
                        </p>
                    </div>

                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed bg-card/50 rounded-2xl p-8 border border-border/50">
                        <p>
                            We&apos;re a lean, passionate team focused on solving real problems for local communities and vendors. Every feature we build is informed by direct feedback from our early users and partners. We&apos;re transparent about where we are and excited about where we&apos;re going.
                        </p>
                        <p>
                            This is a critical time for MarketRadar, and we&apos;re actively shaping our roadmap based on what matters most to our community. If you&apos;re a vendor looking to reach customers or a customer eager to discover local gems, your feedback directly influences what we build next.
                        </p>
                        <p>
                            Join us in building the marketplace that local commerce deserves. Together, we&apos;re creating connections that matter and supporting the businesses that make our communities unique.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
                <div className="container max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Be Part of Something Local
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Whether you&apos;re looking to discover local deals or grow your business, MarketRadar is where communities connect.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/signup">
                            <Button className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group px-8 py-3">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/home">
                            <Button variant="outline" className="rounded-full border-2 px-8 py-3 hover:bg-accent/50 transition-all duration-300 transform hover:scale-105">
                                Explore Stalls
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Footer Section */}
            <section className="py-12 px-4 md:px-6 border-t border-border/40 bg-gradient-to-b from-background to-muted/10">
                <div className="container max-w-6xl mx-auto text-center text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} MarketRadar. All rights reserved. Empowering local commerce, one community at a time.</p>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
