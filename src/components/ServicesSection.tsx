// src/components/ServicesSection.tsx
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Adjust path if needed
import { iconMap } from '@/common/IconPicker'; // Adjust path if needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Shield } from 'lucide-react';

// Define the Service interface to match your Firestore document structure
interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Stored as a string name in Firestore
  features: string[];
}

const ServicesSection = () => {
  const ref = useRef(null);
  // Keep useInView if you want to use it for other effects or for tracking section visibility
  // but it will no longer directly gate the initial render's visibility.
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "services"), orderBy("title"));
        const querySnapshot = await getDocs(q);
        const fetchedServices: Service[] = [];
        querySnapshot.forEach((doc) => {
          fetchedServices.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(fetchedServices);
      } catch (err: any) {
        setError("Error fetching services: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Removed 'hidden' state from variants
  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Removed 'hidden' state from variants
  const cardVariants = {
    initial: { // Renamed from hidden to initial for clarity
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section id="services" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-gray-700">Loading services...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-red-500">Error: {error}</p>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEwwIDIwTDAgNDBMMjAgNjBMNDAgNjBMNjAgNDBMNjAgMjBMNDAgMFoiIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref} // Ref for useInView (if you still want to track visibility)
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // Always animate to visible state on mount
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }} // Always animate to visible state on mount
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm mb-6 rounded-full shadow-md"
          >
            <Shield className="w-4 h-4 mr-2" />
            Comprehensive Solutions
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Technology Services</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We deliver end-to-end IT solutions designed to optimize operations, enhance security,
            and drive business growth through innovative technology.
          </p>
        </motion.div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 text-lg py-10"
          >
            No services available at the moment. Please add services from the admin panel!
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="visible" // Set initial to visible if you want no stagger animation on mount
            animate="visible" // Always animate to visible
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const ServiceIcon = iconMap[service.iconName as keyof typeof iconMap];
              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  initial="initial" // Reference the new 'initial' state
                  animate="visible" // Always animate to visible
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {/* Icon header with gradient */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        {ServiceIcon ? (
                          <ServiceIcon className="w-8 h-8 text-white" />
                        ) : (
                          <span className="text-white text-xs">N/A</span>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <CardTitle className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </CardTitle>

                      <CardDescription className="text-gray-600 mb-4">
                        {service.description}
                      </CardDescription>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <motion.li
                              key={featureIndex}
                              initial={{ opacity: 0, x: -10 }} // Individual feature animation
                              animate={{ opacity: 1, x: 0 }} // Always animate to visible
                              transition={{
                                delay: 0.3 + index * 0.1 + featureIndex * 0.05,
                                duration: 0.5
                              }}
                              className="flex items-start text-gray-700"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}

                      {/* CTA */}
                      <Button
                        variant="outline"
                        className="group/btn w-full border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300"
                        onClick={() => scrollToSection('#contact')}
                      >
                        <span className="font-medium">Explore Service</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // Always animate to visible state on mount
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 lg:p-12 text-center shadow-xl"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Ready to Transform Your IT Infrastructure?
            </h3>
            <p className="text-blue-100 mb-8">
              Our experts will design a custom solution tailored to your business needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-medium"
                onClick={() => scrollToSection('#contact')}
              >
                Request Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => console.log('View Case Studies clicked!')}
              >
                View Case Studies
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;