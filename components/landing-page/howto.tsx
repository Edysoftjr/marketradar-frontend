import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, MapPinned, Clock } from "lucide-react";

const Howto = () => {
  const features = [
    {
      icon: MapPinned,
      title: "Share Your Location",
      description:
        "Allow MarketRadar to access your location to find restaurants near you",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      icon: Utensils,
      title: "Set Your Budget",
      description:
        "Tell us your budget range to find meals that fit your wallet",
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      icon: Clock,
      title: "Discover & Order",
      description: "Browse restaurants, view meals, and place your order",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">
            How It Works
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl mb-3">
            Find your next meal in{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              three simple steps
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Our streamlined process makes finding great food effortless
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-br from-card to-card/50"
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="relative">
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary/20 rounded-full animate-ping"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Howto;
