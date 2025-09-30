import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Users, Zap, Server, Cctv, Smartphone, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const HeroSection = () => {
  // Helper function to scroll to a section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Shield, value: '99.9%', label: 'Service Uptime' },
    { icon: Zap, value: '24/7', label: 'Support Team' }
  ];

  const services = [
    { icon: Server, label: 'Software Development' },
    { icon: Network, label: 'Networking' },
    { icon: Smartphone, label: 'Hardware Solutions' },
    { icon: Cctv, label: 'Security Systems' }
  ];

  return (
    <section id="home" className="relative pt-20 lg:pt-24 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-soft-light"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-soft-light"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      {/* Floating Tech Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-6 h-6 bg-blue-500 rounded-full"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-4 h-4 bg-indigo-400 rounded-full"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center bg-blue-800/30 backdrop-blur px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-blue-300 font-medium">Innovating Since 2011</span>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              >
                Your One-Stop IT Solutions Partner Company
                {/* <span className="block mt-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Your Business Growth
                </span> */}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-2xl"
              >
            Switch2ITech, founded in 2011, is a leading IT company from Sargodha with a nationwide reach. We deliver custom software, management systems, and complete IT services under one roof & switching lives to technology.
              </motion.p>
            </div>

            {/* Service Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="bg-blue-800/30 backdrop-blur border border-blue-700/30 rounded-lg p-3 text-center hover:bg-blue-700/40 transition-colors"
                >
                  <service.icon className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                  <span className="text-sm text-blue-100">{service.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium group shadow-lg hover:shadow-xl transition-all"
                onClick={() => scrollToSection('#contact')} // Scrolls to contact section
              >
                Request Consultation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 group transition-colors"
                onClick={() => scrollToSection('#services')} // Scrolls to services section
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                View Services
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image with Floating Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
              >
                <img
                  src={heroImage}
                  alt="Switch2iTech IT Solutions Team"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  loading="eager"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-indigo-900/50"></div>
                
                {/* Floating Tech Elements */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 w-14 h-14 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center"
                >
                  <Server className="h-6 w-6 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-6 left-6 w-12 h-12 bg-indigo-500 rounded-full shadow-lg flex items-center justify-center"
                >
                  <Cctv className="h-5 w-5 text-white" />
                </motion.div>
              </motion.div>

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-6 left-0 right-0 mx-auto bg-gradient-to-r from-blue-800 to-indigo-800 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-xl w-4/5"
              >
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-1">
                        <stat.icon className="h-5 w-5 text-blue-300" />
                      </div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-blue-200">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Animated Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <motion.svg 
          className="relative block w-full h-20"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="#f3f4f6" 
                opacity="0.2" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                fill="#f3f4f6" 
                opacity="0.5" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                fill="#f3f4f6" />
        </motion.svg>
      </div>
    </section>
  );
};

export default HeroSection;
