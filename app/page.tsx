import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Howto from "@/components/landing-page/howto";
import Benefits from "@/components/landing-page/benefits";
import CTA from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/footer";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // If user is logged in, redirect to /home
  if (accessToken) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <Header />

      <main className="flex-1 pt-10">
        {/* Hero Section */}
        <Hero />

        {/* How It Works Section */}
        <Howto />

        {/* Benefits Section */}
        <Benefits />

        {/* CTA Section */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
