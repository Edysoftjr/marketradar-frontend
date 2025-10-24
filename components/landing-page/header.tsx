import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 shadow-lg inset-x-0 z-50 bg-background/95 backdrop-blur-lg transition-all duration-300">
      <div className="container flex h-14 items-center justify-between px-3 w-full">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
              <Image
                alt="FoodRadar App"
                src="/foodrlogo.png"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              MarketRadar
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 hover:bg-accent/60 transition-all duration-200 rounded-lg"
            >
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="h-9 px-6 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
