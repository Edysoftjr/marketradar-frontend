import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-muted/50 via-background to-muted/50">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-8 md:p-10 text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                Ready to Join{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  MarketRadar?
                </span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                At MarketRadar, We Promote local commerce, one community at a time
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  Sign Up Now - It&apos;s Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                No credit card required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTA;
