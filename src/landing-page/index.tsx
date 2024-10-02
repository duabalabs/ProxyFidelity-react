
import { Route, Routes } from "react-router-dom";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";

import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { FeaturesSection } from "./FeaturesSection";
import { FloatingButton } from "./FloatingButton";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { resources } from "./resources";
import { ServicesSection } from "./ServicesSection";
import { TeamSection } from "./TeamSection";
import { ValuesSection } from "./ValuesSection";

export default function LandingPage() {
  return (
    <Refine
      routerProvider={routerProvider}
      resources={resources}
    >
      <Routes>
        <Route path="/" element={<LandingPageComponent />} />
      </Routes>
    </Refine>
  );
}

const LandingPageComponent = () => {
  return <div>
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ValuesSection />
      {/* <FeaturesSection /> */}
      <ContactSection />
    </main>
    <FloatingButton />
    {/* <Footer />  */}
  </div>
}