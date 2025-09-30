import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/firebase/firebaseConfig'; // Adjust path to your firebase config

// Define the structure of an image object fetched from Firestore
interface GalleryImage {
  id: string; // Document ID from Firestore
  imageUrl: string; // URL of the uploaded image
  altText: string;
  title: string;
  category: string;
}

const ImageGallery = () => {
  const ref = useRef(null);
  // useInView is kept for potential future use or if you want to log when the section comes into view,
  // but it no longer gates the initial animation visibility.
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to scroll to a section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch gallery images from Firestore
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "imageGallery"));
        const fetchedImages: GalleryImage[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<GalleryImage, 'id'> // Cast data to GalleryImage interface
        }));
        setImages(fetchedImages);
      } catch (err: any) {
        console.error("Error fetching gallery images:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []); // Empty dependency array means this runs once on mount

  // --- Animation Variants (Removed 'hidden' state) ---
  const containerVariants = {
    visible: { // Only 'visible' state is defined
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { // Renamed from 'hidden' to 'initial'
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading gallery images...</p>
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

  // The logic for distributing images into columns remains the same
  // Note: For a truly robust masonry layout with dynamic images,
  // consider a dedicated masonry library or a more advanced CSS Grid/Flexbox approach.
  const column1Images = images.slice(0, Math.ceil(images.length / 4));
  const column2Images = images.slice(Math.ceil(images.length / 4), Math.ceil(images.length / 2));
  const column3Images = images.slice(Math.ceil(images.length / 2), Math.ceil(images.length * 3 / 4));
  const column4Images = images.slice(Math.ceil(images.length * 3 / 4));

  // The original column slicing was fixed for a static number of images.
  // With dynamic content, you might want to adjust how images are distributed
  // into columns to ensure an even or desired distribution.
  // For simplicity, I've kept a similar fixed-slice approach for the first 3 columns,
  // and the 4th column will have remaining images + the CTA.
  // This will work well if you typically have 6-8 images.
  // If you have many more, you'd need a more dynamic column distribution.

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
            Behind the Scenes
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Innovation Culture</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the environment where cutting-edge IT solutions are crafted through
            collaboration, expertise, and a passion for technology.
          </p>
        </motion.div>

        {/* Gallery Grid - Masonry Layout */}
        {images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 text-lg py-10"
          >
            No gallery images available at the moment.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="visible" // Set initial to "visible" to ensure staggerChildren always runs on mount
            animate="visible" // Always animate to visible
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Column 1: Display first 2 images */}
            <div className="space-y-6">
              {images.slice(0, 2).map((image) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  initial="initial" // Animate from 'initial' state
                  animate="visible" // Animate to 'visible' state
                  className="relative group overflow-hidden rounded-2xl bg-gray-200 shadow-lg aspect-[3/4]"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="text-xs font-medium text-blue-300 mb-1">
                      {image.category}
                    </div>
                    <h3 className="text-xl font-bold">
                      {image.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Column 2: Display next 2 images */}
            <div className="space-y-6">
              {images.slice(2, 4).map((image) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  initial="initial"
                  animate="visible"
                  className="relative group overflow-hidden rounded-2xl bg-gray-200 shadow-lg aspect-square"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="text-xs font-medium text-blue-300 mb-1">
                      {image.category}
                    </div>
                    <h3 className="text-xl font-bold">
                      {image.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Column 3: Display next 2 images */}
            <div className="space-y-6">
              {images.slice(4, 6).map((image) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  initial="initial"
                  animate="visible"
                  className="relative group overflow-hidden rounded-2xl bg-gray-200 shadow-lg aspect-[4/5]"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="text-xs font-medium text-blue-300 mb-1">
                      {image.category}
                    </div>
                    <h3 className="text-xl font-bold">
                      {image.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Column 4: Display remaining images + static CTA */}
            <div className="space-y-6">
              {images.slice(6, 7).map((image) => ( // Display one image (if available)
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  initial="initial"
                  animate="visible"
                  className="relative group overflow-hidden rounded-2xl bg-gray-200 shadow-lg aspect-[2/3]"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="text-xs font-medium text-blue-300 mb-1">
                      {image.category}
                    </div>
                    <h3 className="text-xl font-bold">
                      {image.title}
                    </h3>
                  </div>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                initial="initial" // Animate from 'initial' state
                animate="visible" // Animate to 'visible' state
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 shadow-xl aspect-square flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="text-white mb-6">
                  <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
                  <p className="text-blue-200">
                    Become part of our success story with innovative IT solutions
                  </p>
                </div>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition-colors flex items-center"
                >
                  Start Partnership
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }} // Always animates on mount
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={() => scrollToSection('contact')}
            >
              Request a Consultation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white border border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-600 rounded-xl font-medium shadow-sm transition-all"
              onClick={() => scrollToSection('services')}
            >
              Explore Our Services
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageGallery;