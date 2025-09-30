import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Linkedin,
  Twitter,
  Github,
  Star,
  Server,
  Network,
  Shield,
  Cctv,
  Zap,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Adjust path to your firebase config

// Map icon names from database to Lucide React components
const iconComponents: { [key: string]: React.ElementType } = {
  Server: Server,
  Network: Network,
  Shield: Shield,
  Cctv: Cctv,
  Zap: Zap,
  Lightbulb: Lightbulb,
  Star: Star,
  // Add other icons as needed from your IconPicker
};

// Define the structure of a team member object fetched from Firestore
interface TeamMember {
  id: string; // Document ID from Firestore
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  iconName: string; // Stored as string in Firestore
  color: string; // Assuming 'color' is a string like 'bg-blue-500'
  imageUrl: string; // URL of the uploaded image
  linkedin?: string;
  twitter?: string;
  github?: string;
}

const TeamSection = () => {
  const ref = useRef(null);
  // useInView is kept for potential future use or if you want to track section visibility,
  // but it no longer directly gates the initial animation visibility.
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team members from Firestore
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teamMembers"));
        const members: TeamMember[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<TeamMember, 'id'> // Cast data to TeamMember interface
        }));
        setTeamMembers(members);
      } catch (err: any) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []); // Empty dependency array means this runs once on mount

  // Helper function to scroll to a section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Animation Variants (Removed 'hidden' state) ---
  const containerVariants = {
    visible: { // Only 'visible' state is defined
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    initial: { // Renamed from 'hidden' to 'initial'
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

  if (loading) {
    return (
      <section id="team" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading team members...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="team" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section id="team" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref} // Still attaches the ref for isInView, though it's not gating initial animation
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // Always animates on mount
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }} // Always animates on mount
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm mb-6 rounded-full shadow-md"
          >
            <Star className="w-4 h-4 mr-2" />
            Technology Leadership
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Experts</span> Behind Your Solutions
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our multidisciplinary team combines deep expertise across software, infrastructure,
            hardware, and security to deliver comprehensive technology solutions.
          </p>
        </motion.div>

        {/* Team Grid - Diagonal Layout */}
        {teamMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 text-lg py-10"
          >
            No team members available at the moment.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="visible" // Set initial to "visible" to ensure staggerChildren always runs on mount
            animate="visible" // Always animate to visible
            className="relative grid grid-cols-1 md:grid-cols-2 gap-16 py-10"
          >
            {/* Diagonal Decorative Line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-4xl">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              </div>
            </div>

            {teamMembers.map((member, index) => {
              const IconComponent = iconComponents[member.iconName] || Lightbulb; // Fallback icon
              return (
                <motion.div
                  key={member.id} // Use unique Firestore document ID as key
                  variants={cardVariants}
                  initial="initial" // Animate from 'initial' state
                  animate="visible" // Animate to 'visible' state
                  className={`relative z-10 ${index % 2 === 0 ? 'md:-mt-20' : 'md:mt-20'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Image with diagonal cut */}
                    <div className="relative w-full md:w-2/5">
                      <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-white">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={member.imageUrl} // Use imageUrl from Firestore
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Diagonal overlay - use member.color dynamic class */}
                        <div className={`absolute -bottom-1 -right-1 w-1/2 h-1/2 ${member.color} transform rotate-45 translate-x-1/4 translate-y-1/4`}></div>

                        {/* Expertise icon */}
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-3/5">
                      <div className="bg-white rounded-2xl shadow-lg p-6 relative">
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-blue-600 font-medium mb-6">
                          {member.role}
                        </p>

                        <p className="text-gray-600 mb-6 border-l-2 border-blue-200 pl-4 py-1">
                          {member.bio}
                        </p>

                        {/* Expertise */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Areas of Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {member.twitter && (
                            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Capabilities Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // Always animates on mount
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 lg:p-12 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6">
                Unified Technology Expertise
              </h3>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Software Development</h4>
                    <p className="text-blue-200">
                      Custom solutions for desktop, web, and mobile platforms tailored to your needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Networking & Infrastructure</h4>
                    <p className="text-blue-200">
                      Complete networking services and server management for reliable performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Cctv className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Security Systems</h4>
                    <p className="text-blue-200">
                      CCTV, fire alarm, and public address systems for comprehensive protection.
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="mt-8 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition-colors flex items-center"
                onClick={() => scrollToSection('#services')}
              >
                View Our Full Capabilities
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Right - Image */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-indigo-600/30 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Collaborative Technology Solutions
                    </h3>
                    <p className="text-blue-200 mb-6">
                      Our cross-functional teams work together to deliver integrated solutions.
                    </p>
                    <div className="flex justify-center">
                      {/* Dynamically display first 3 team members' images for demonstration */}
                      {teamMembers.slice(0, 3).map((member) => (
                        <div key={member.id} className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg mx-2">
                          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // Always animates on mount
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-200 shadow-lg">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to Partner With Our Experts?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Our team is ready to design and implement comprehensive technology solutions for your business.
            </p>

            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
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

export default TeamSection;