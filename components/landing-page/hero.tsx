import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      <div className="container relative px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-5">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit animate-pulse">
                🚀 Discover items within your budget
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Your Smart{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                  Radar
                </span>
                {" "}for Local Deals.
              </h1>
              <p className="text-base text-muted-foreground md:text-lg max-w-2xl leading-relaxed">
                Discover meals, products, and services from stalls and shops around you.
                MarketRadar helps you save time, cut costs, and shop with confidence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/home">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-full sm:w-auto border-2 hover:bg-accent/50 transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Explore
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10"></div>
              <Image
                alt="MarketRadar App"
                className="object-cover w-full h-auto"
                src="/landingp.png"
                width={400}
                height={280}
                priority
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
