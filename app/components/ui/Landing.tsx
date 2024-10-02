import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { InfoCards } from "./InfoCards";
import { Testimony } from "./Testimony";

export const Landing = () => {
  return (
    <div>
      <Hero />
      <InfoCards />
      <Testimony />
      <FAQ />
      <Footer />
    </div>
  );
};
