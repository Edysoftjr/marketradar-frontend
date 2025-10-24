import { Zap, Shield, Heart } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Find nearby stalls in seconds, not minutes",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Heart,
      title: "Personalized",
      description: "Get recommendations tailored to your taste and budget",
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl mb-3">
            Why choose{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              MarketRadar?
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Discover and support businesses in your locality with ease. <br></br>Boost the local economy and get the best deals.<br></br>
            Eliminate the fear of overspending.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="group text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
