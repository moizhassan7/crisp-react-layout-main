import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Check,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Crown,
  Server,
  Network,
  Cctv,
  Smartphone,
  Wifi,
  Database,
  Monitor,
  FireExtinguisher,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/firebase/firebaseConfig'; // Adjust path to your firebase config
import { iconMap } from '@/common/IconPicker'; // Assuming IconPicker exports iconMap

// Interfaces to match Firestore data structure
interface AssociatedService {
  iconName: string;
  label: string;
}

interface PricingPlan {
  id: string; // Firestore document ID
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular: boolean;
  iconName: string; // Stored as a string name for the main plan icon
  color: string; // Tailwind gradient class (e.g., 'from-blue-500 to-indigo-500')
  features: string[];
  associatedServices: AssociatedService[]; // Renamed 'services' to 'associatedServices' to match admin
}

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to scroll to a section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch pricing plans from Firestore
  useEffect(() => {
    const fetchPricingPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "pricingPlans"), orderBy("monthlyPrice")); // Order by price
        const querySnapshot = await getDocs(q);
        const fetchedPlans: PricingPlan[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPlans.push({ id: doc.id, ...doc.data() } as PricingPlan);
        });
        setPricingPlans(fetchedPlans);
      } catch (err: any) {
        setError("Error fetching pricing plans: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricingPlans();
  }, []);

  // --- Animation Variants (Removed 'hidden' state) ---
  const fadeInSlideUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const scaleInVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } }
  };

  const containerStaggerVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // Stagger the cards
      }
    }
  };

  const cardItemVariants = {
    initial: {
      opacity: 0,
      y: 50,
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

  const featureItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  const getPrice = (plan: PricingPlan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12);
  };

  const getSavings = (plan: PricingPlan) => {
    // Calculate savings only if annual price is less than 12x monthly price
    const monthlyTotal = plan.monthlyPrice * 12;
    if (plan.annualPrice < monthlyTotal) {
      return Math.round(((monthlyTotal - plan.annualPrice) / monthlyTotal) * 100);
    }
    return 0;
  };

  // Format PKR currency
  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading pricing plans...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden">
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
            <Shield className="w-4 h-4 mr-2" />
            Transparent IT Solutions Pricing
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IT Solutions</span> for Every Business
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose from our specialized IT packages designed to meet your specific technology needs,
            with transparent pricing in Pakistani Rupees.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} // Direct animation
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center bg-white rounded-full p-1 border border-gray-300 shadow-sm"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Annual</span>
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                -20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards - Diagonal Layout */}
        {pricingPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 text-lg py-10"
          >
            No pricing plans available. Please add them from the admin panel!
          </motion.div>
        ) : (
          <motion.div
            variants={containerStaggerVariants}
            initial="visible" // Set initial to "visible" to ensure staggerChildren always runs on mount
            animate="visible" // Always animate to visible
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {/* Diagonal Decorative Line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-6xl">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              </div>
            </div>

            {pricingPlans.map((plan, index) => {
              const PlanIcon = iconMap[plan.iconName as keyof typeof iconMap] || Wifi; // Fallback
              const savings = getSavings(plan);

              return (
                <motion.div
                  key={plan.id} // Use unique Firestore document ID as key
                  variants={cardItemVariants}
                  initial="initial" // Animate from 'initial' state
                  animate="visible" // Animate to 'visible' state
                  className={`relative z-10 ${index % 2 === 0 ? 'md:-mt-8' : 'md:mt-8'}`}
                >
                  <Card className={`
                    h-full relative transition-all duration-500 hover:-translate-y-3 bg-white border border-gray-200
                    ${plan.popular
                      ? 'shadow-xl scale-[1.03] border-blue-500/30'
                      : 'hover:shadow-lg'
                    }
                  `}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full shadow-lg text-sm font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Diagonal accent */}
                    <div className={`absolute -top-1 -right-1 w-1/2 h-1/2 ${plan.color} transform rotate-45 translate-x-1/4 -translate-y-1/4`}></div>

                    <CardHeader className="text-center pb-6 pt-12">
                      <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${plan.color}`}>
                          <PlanIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-6">
                        {plan.description}
                      </p>

                      {/* Associated Service icons */}
                      <div className="flex justify-center space-x-2 mb-6">
                        {plan.associatedServices && plan.associatedServices.map((service, idx) => {
                          const ServiceIcon = iconMap[service.iconName as keyof typeof iconMap] || Wifi; // Fallback
                          return (
                            <div key={idx} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center" title={service.label}>
                              <ServiceIcon className="w-5 h-5 text-blue-600" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {formatPKR(getPrice(plan))}
                          </span>
                          <span className="text-gray-500 ml-2">
                            /month
                          </span>
                        </div>

                        {billingCycle === 'annual' && savings > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            Save {savings}% annually
                          </div>
                        )}

                        {billingCycle === 'annual' && (
                          <div className="text-xs text-gray-500">
                            Billed annually at {formatPKR(plan.annualPrice)}
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-8">
                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {plan.features && plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex} // Use index for key as feature strings might not be unique
                            initial={featureItemVariants.initial}
                            animate={featureItemVariants.animate} // Direct animation
                            transition={{ delay: 0.1 + featureIndex * 0.05 }} // Stagger features
                            className="flex items-start space-x-3"
                          >
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                            : 'bg-white border border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-600'
                        } transition-all duration-300 group/btn h-12`}
                        onClick={() => scrollToSection('#contact')}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        No hidden fees • Cancel anytime
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Included in All Plans */}
        <motion.div
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 border border-gray-200 max-w-5xl mx-auto"
        >
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">
            Core Benefits <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Included in All Plans</span>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Security First</h4>
              <p className="text-gray-600 text-sm">Proactive threat monitoring</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Data Protection</h4>
              <p className="text-gray-600 text-sm">Daily encrypted backups</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Performance</h4>
              <p className="text-gray-600 text-sm">24/7 system monitoring</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Dedicated Support</h4>
              <p className="text-gray-600 text-sm">Priority response team</p>
            </div>
          </div>
        </motion.div>

        {/* Custom Solutions */}
        <motion.div
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 lg:p-12 text-white shadow-xl max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Need a Custom IT Solution?
              </h3>
              <p className="text-blue-100 mb-8">
                We specialize in creating tailored technology packages that perfectly match your
                business requirements and budget.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Hybrid solutions combining multiple services</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Industry-specific security implementations</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Large-scale infrastructure deployments</span>
                </li>
              </ul>

              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-medium"
                onClick={() => scrollToSection('#contact')}
              >
                Request Custom Quote
              </Button>
            </div>

            <div className="bg-gradient-to-br from-blue-600/30 to-indigo-600/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-4">Enterprise Solutions</h4>
                <p className="text-blue-200 mb-6">
                  For organizations requiring complex integrations and dedicated resources
                </p>
                <div className="text-2xl font-bold mb-2">{formatPKR(499999)}</div>
                <p className="text-blue-200 text-sm">Starting monthly price</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;