import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Calendar,
  Server,
  Network,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: ''
  });

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Reach out to our team anytime',
      contact: 'info@switch2itech.com',
      action: 'mailto:info@switch2itech.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri, 9 AM to 7 PM',
      contact: '+92 321 123 4567',
      action: 'tel:+923211234567'
    },
    {
      icon: MapPin,
      title: 'Visit Our Office',
      description: 'Find us at our main headquarters',
      contact: '123 Tech Park, Karachi, Pakistan',
      action: 'https://www.google.com/maps/place/Mall+of+Sargodha/@32.0629774,72.6912441,17z/data=!3m1!4b1!4m6!3m5!1s0x392177f1c47ba11d:0x2f858c4ea5525a4e!8m2!3d32.0629774!4d72.693819!16s%2Fg%2F11b6_1j89t?entry=ttu' // Added a real Google Maps link
    },
    {
      icon: Clock,
      title: 'Business Hours',
      description: 'Our team is available',
      contact: 'Monday - Friday: 9:00 AM - 7:00 PM',
      action: '#' // No specific action for business hours
    }
  ];

  const services = [
    'Software Development (Desktop, Web, Mobile)',
    'Computer Networking Services', 
    'Server Management Solutions',
    'Computer Hardware Solutions',
    'CCTV Surveillance Systems',
    'Fire Alarm & Fire Fighting Systems',
    'Public Address Systems',
    'Custom IT Solutions'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    console.log('Form Data Submitted:', formData);
    toast({
      title: "Message Sent Successfully!",
      description: "We've received your inquiry and will get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      company: '',
      message: '',
      service: ''
    });
  };

  // Helper function to scroll to a section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm mb-6 rounded-full shadow-md"
          >
            <Send className="w-4 h-4 mr-2" />
            Get in Touch
          </motion.div>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Let's Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IT Solution</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our team is ready to discuss your software, networking, hardware, or security needs and 
            deliver a comprehensive solution for your business.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Contact Information
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Reach out through your preferred method - we're committed to providing prompt and effective communication.
              </p>
            </motion.div>

            {contactInfo.map((info, index) => (
              <motion.div key={info.title} variants={itemVariants}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {info.description}
                        </p>
                        <a
                          href={info.action}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300"
                          target={info.action.startsWith('http') ? "_blank" : "_self"}
                          rel={info.action.startsWith('http') ? "noopener noreferrer" : ""}
                        >
                          {info.contact}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">24h</div>
                      <div className="text-blue-100 text-sm">Average Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">99%</div>
                      <div className="text-blue-100 text-sm">Client Satisfaction Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Google Maps Integration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg"
            >

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.2318480082095!2d72.69124407532408!3d32.06297737397024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392177f1c47ba11d%3A0x2f858c4ea5525a4e!2sMall%20of%20Sargodha!5e0!3m2!1sen!2s!4v1752700202687!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-t-2xl"
              ></iframe>
              <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-gray-700 font-medium">Mall of Sargodha, Sargodha, Pakistan</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <Card className="shadow-xl border border-gray-200">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@gmail.com"
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-medium text-gray-700">
                        Service Interested In
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Tell Us About Your Project *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your needs, goals, and any specific requirements..."
                      rows={5}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>We aim to respond within 24 business hours</span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Send Your Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 lg:p-12 text-white shadow-xl"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Schedule a Free Consultation
              </h3>
              <p className="text-blue-100 mb-6">
                Book a 30-minute call with our experts to discuss your project requirements 
                and get personalized recommendations.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Personalized solution recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No-obligation project assessment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Preliminary cost estimation</span>
                </li>
              </ul>
              
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-medium"
                onClick={() => scrollToSection('#contact')} // Button to scroll to contact section
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Free Consultation
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <Server className="w-10 h-10 text-white mb-4" />
                <h4 className="font-bold mb-2">IT Infrastructure</h4>
                <p className="text-blue-200 text-sm">Networking, hardware, servers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <Shield className="w-10 h-10 text-white mb-4" />
                <h4 className="font-bold mb-2">Security Systems</h4>
                <p className="text-blue-200 text-sm">CCTV, fire safety, PA systems</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <Network className="w-10 h-10 text-white mb-4" />
                <h4 className="font-bold mb-2">Custom Software</h4>
                <p className="text-blue-200 text-sm">Desktop, web & mobile apps</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <MessageCircle className="w-10 h-10 text-white mb-4" />
                <h4 className="font-bold mb-2">Support & Maintenance</h4>
                <p className="text-blue-200 text-sm">Ongoing technical assistance</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
