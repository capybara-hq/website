import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { IconSprite } from "@/components/icons";
import { Contact, Deploy, Features, Overview, Plugins } from "@/components/Sections";
import { SiteProvider } from "@/components/site";

export default function Home() {
  return (
    <SiteProvider>
      <IconSprite />
      <Header />
      <main className="wrap">
        <Hero />
      </main>
      <Overview />
      <Features />
      <Plugins />
      <Deploy />
      <Contact />
      <Footer />
    </SiteProvider>
  );
}
