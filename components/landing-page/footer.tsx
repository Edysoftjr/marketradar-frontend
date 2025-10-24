import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t bg-gradient-to-r from-muted/30 to-background py-8 md:py-10">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center group">
            <div className="relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-primary/10 to-primary/5">
              <Image
                alt="FoodRadar App"
                src="/foodrlogo.png"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent ml-2">
              MarketRadar
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              <p>© {new Date().getFullYear()} MarketRadar. All rights reserved. Empowering local commerce, one community at a time.</p>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
