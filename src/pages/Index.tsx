// src/pages/Index.tsx
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ImageGallery from '@/components/ImageGallery';
import AboutSection from '@/components/AboutSection';
import TeamSection from '@/components/TeamSection';
import PricingSection from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection'; // Assuming you have this component
import Footer from '@/components/Footer'; // Assuming you have this component
import ProjectSection from '@/components/ProjectSection';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background" // Ensure 'bg-background' is defined in your CSS or Tailwind config
    >
      <Header />
      <>
        <HeroSection />
        <ServicesSection />
        <ImageGallery />
        <ProjectSection/>
        <AboutSection />
        <TeamSection />
        <PricingSection />
        <ContactSection /> 
      </>
      <Footer />
    </motion.div>
  );
};

export default Index;
