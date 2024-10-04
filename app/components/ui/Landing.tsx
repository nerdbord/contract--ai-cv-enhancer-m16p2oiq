import { FAQ } from "./FAQ";
import { Hero } from "./Hero";
import { InfoCards } from "./InfoCards";
import { Testimony } from "./Testimony";

export const Landing = () => {
  return (
    <div className="w-full">
      <Hero />
      <InfoCards />
      <Testimony />
      <FAQ />
    </div>
  );
};
