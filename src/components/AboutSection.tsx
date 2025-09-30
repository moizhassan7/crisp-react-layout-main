import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  Target,
  Users,
  Award,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Server,
  Network,
  Shield,
  Cctv,
  Zap,
  BarChart // Make sure BarChart is imported if used
} from 'lucide-react';
// import businessPerson1 from '@/assets/business-person-1.jpg'; // This will be replaced by imageUrl from Firestore
import { collection, getDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/firebase/firebaseConfig'; // Adjust path to your firebase config
import { iconMap } from '@/common/IconPicker'; // Assuming IconPicker exports iconMap

// New CountingNumber component for animation (Remains the same)
interface CountingNumberProps {
  targetValue: string; // Can be '500+', '99.9%', '24/7', '5+'
  duration?: number; // Animation duration in milliseconds
  isInView: boolean; // Prop to trigger animation when section is in view
}

const CountingNumber: React.FC<CountingNumberProps> = ({ targetValue, duration = 2000, isInView }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const animationRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!isInView) {
      setCurrentNumber(0); // Reset number when out of view
      return;
    }

    const animateCount = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;

      const numMatch = targetValue.match(/(\d+\.?\d*)(.*)/);
      if (!numMatch) {
        setCurrentNumber(parseFloat(targetValue) || 0);
        return;
      }
      const targetNum = parseFloat(numMatch[1]);
      const suffix = numMatch[2] || '';

      const easedProgress = Math.min(1, progress / duration);
      const animatedValue = easedProgress * targetNum;

      if (targetValue.includes('%') || targetValue.includes('.')) {
        // Ensure correct decimal places for percentages/decimals
        const decimalPlaces = targetValue.includes('.') ? targetValue.split('.')[1]?.length || 0 : 0;
        setCurrentNumber(parseFloat(animatedValue.toFixed(decimalPlaces)));
      } else {
        setCurrentNumber(Math.floor(animatedValue));
      }

      if (progress < duration) {
        animationRef.current = requestAnimationFrame(animateCount);
      } else {
        setCurrentNumber(targetNum);
      }
    };

    animationRef.current = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(animationRef.current);
      startTimeRef.current = 0;
    };
  }, [targetValue, duration, isInView]);

  const displayValue = () => {
    const numMatch = targetValue.match(/(\d+\.?\d*)(.*)/);
    if (!numMatch) return targetValue;

    const suffix = numMatch[2] || '';
    return `${currentNumber}${suffix}`;
  };

  return <>{displayValue()}</>;
};

// Define interfaces to match Firestore data structure
interface AboutValue {
  iconName: string;
  title: string;
  description: string;
  color: string; // Tailwind class string (e.g., 'bg-gradient-to-br from-blue-500 to-indigo-600')
}

interface AboutStat {
  iconName: string;
  number: string; // Stored as string to handle '500+'
  label: string;
}

interface CoreCapability {
  iconName: string;
  text: string;
}

interface AboutContent {
  mainTitle: string;
  subtitle: string;
  description1: string;
  description2: string;
  quote: string; // You have this in admin but not used in frontend, adding it for consistency
  mainImageUrl: string;
  statsSectionImageUrl: string;
  values: AboutValue[];
  stats: AboutStat[];
  coreCapabilities: CoreCapability[];
}

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "about", "content"); // Assuming 'about' collection and 'content' document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data() as AboutContent);
        } else {
          setError("About content not found in Firestore. Please add it from the admin panel.");
        }
      } catch (err: any) {
        setError("Error fetching about data: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Helper function to scroll to a section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Animation Variants (Removed 'hidden' state) ---
  const fadeInSlideUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const scaleInVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } }
  };

  const itemStaggerVariants = {
    // No explicit 'initial' for the container itself, stagger is applied by children's 'initial' and 'animate'
    // 'visible' will trigger staggerChildren
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const individualItemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // If data is loading or there's an error, show appropriate message
  if (loading) {
    return (
      <section id="about" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading About section...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </section>
    );
  }

  // Ensure aboutData is available before rendering main content
  if (!aboutData) {
    return (
      <section id="about" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">No About section content available. Please check the admin settings.</p>
      </section>
    );
  }

  return (
    <section id="about" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref} // Attach ref to the motion.div to observe its in-view status
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={scaleInVariants.initial}
            animate={scaleInVariants.animate}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm mb-6 rounded-full shadow-md"
          >
            <Target className="w-4 h-4 mr-2" />
            {aboutData.subtitle}
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            {aboutData.mainTitle.split('Empowering Businesses Through')[0]}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {aboutData.mainTitle.split('Empowering Businesses Through')[1] || 'Integrated IT Solutions'}
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {aboutData.description1}
          </p>
        </motion.div>

        {/* Main Content - Diagonal Layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 py-10 mb-20">
          {/* Diagonal Decorative Line */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-4xl">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            </div>
          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }} // Direct animation
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 md:mt-20"
          >
            <div className="relative">
              {/* Main Image with Diagonal Cut */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-white">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={aboutData.mainImageUrl} // Dynamic Image
                    alt="Technology expert discussing IT solutions"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Diagonal overlay */}
                <div className="absolute -bottom-1 -left-1 w-1/2 h-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 transform rotate-45 translate-x-1/4 translate-y-1/4"></div>

                {/* Floating Icon */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* Floating Stats Card - Animates independently */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-xs"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-gray-900">Industry-Leading</div>
                    <div className="text-sm text-gray-600">IT Solutions</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }} // Direct animation
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Technology Journey
              </h3>

              <p className="text-gray-600 mb-6 border-l-2 border-blue-200 pl-4 py-1">
                {aboutData.description1} {/* Reusing description1 here as per original template */}
              </p>

              <p className="text-gray-600 mb-8">
                {aboutData.description2}
              </p>

              {/* Core Capabilities */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Our Core Capabilities</h4>
                <div className="grid grid-cols-2 gap-4">
                  {aboutData.coreCapabilities.map((cap, index) => {
                    const CapIcon = iconMap[cap.iconName as keyof typeof iconMap] || Lightbulb; // Fallback
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <CapIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-700">{cap.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => scrollToSection('#contact')}
                >
                  Start Your Project
                </button>
                <button
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition-all"
                  onClick={() => scrollToSection('#services')}
                >
                  Explore Services
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl mb-20"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 lg:p-12 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6">
                Our Impact in Numbers
              </h3>

              <div className="grid grid-cols-2 gap-8">
                {aboutData.stats.map((stat, index) => {
                  const StatIcon = iconMap[stat.iconName as keyof typeof iconMap] || BarChart; // Fallback
                  return (
                    <div key={index} className="flex items-start">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <StatIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        {/* Use the new CountingNumber component */}
                        <div className="text-3xl font-bold mb-1">
                          <CountingNumber targetValue={stat.number} isInView={isInView} />
                        </div>
                        <div className="text-blue-200">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 text-blue-200 italic">
                "{aboutData.quote}"
              </p>
            </div>

            {/* Right - Image */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-indigo-600/30 backdrop-blur-sm rounded-2xl border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                  <BarChart className="w-12 h-12 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">
                    Consistent Growth & Excellence
                  </h3>
                  <p className="text-blue-200">
                    Year-over-year improvement in client satisfaction and project delivery
                  </p>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            These principles guide our commitment to excellence, innovation, and client satisfaction
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {aboutData.values.map((value, index) => {
            const ValueIcon = iconMap[value.iconName as keyof typeof iconMap] || Lightbulb; // Fallback
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }} // Direct animation
                transition={{ delay: 0.9 + index * 0.1 }}
                className="h-full"
              >
                <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all">
                  {/* Icon header with gradient */}
                  <div className={`${value.color} p-6 relative`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto">
                      <ValueIcon className="w-8 h-8 text-white" />
                    </div>

                    {/* Diagonal element */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {value.title}
                    </h4>

                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 lg:p-12 text-white shadow-xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Our experts are ready to design a custom technology solution for your unique needs
            </p>

            <button
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
              onClick={() => scrollToSection('#contact')}
            >
              Schedule a Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;