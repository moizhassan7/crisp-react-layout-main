import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react'; // Import useEffect and useState
import { ArrowRight, FolderKanban } from 'lucide-react'; // Removed unused icons for cleaner import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/firebase/firebaseConfig'; // Adjust path to your firebase config

// Define the Project interface to match your Firestore document structure
interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string; // Short description
  fullDescription: string; // Full description
  technologies: string[];
  client: string;
  challenge: string;
  solution: string;
  results: string;
}

const ProjectSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" }); // Keep useInView for other potential effects
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to scroll to a section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc")); // Order by creation date for recent projects
        const querySnapshot = await getDocs(q);
        const fetchedProjects: Project[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
        });
        setProjects(fetchedProjects);
      } catch (err: any) {
        setError("Error fetching projects: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount

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
    visible: { // Only 'visible' state is defined
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardItemVariants = {
    initial: { // Renamed from 'hidden' to 'initial'
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

  // Function to handle project click (e.g., navigate to project detail page)
  const handleProjectClick = (project: Project) => {
    console.log("Clicked project:", project.title);
    // You would typically navigate to a dedicated project detail page here, like:
    // navigate(`/projects/${project.id}`);
    alert(`Navigating to details for: ${project.title} (ID: ${project.id})\n\nFull Description: ${project.fullDescription}\nTechnologies: ${project.technologies.join(', ')}\nClient: ${project.client}\nChallenge: ${project.challenge}\nSolution: ${project.solution}\nResults: ${project.results}`);
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading projects...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref} // Attach ref to the motion.div to observe its in-view status
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <motion.div
            initial={scaleInVariants.initial}
            animate={scaleInVariants.animate}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm mb-6 rounded-full shadow-md"
          >
            <FolderKanban className="w-4 h-4 mr-2" />
            Our Success Stories
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Showcasing Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Impactful Projects</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore a selection of our recent projects where we delivered innovative technology solutions,
            driving significant value and growth for our clients.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 text-lg py-10"
          >
            No projects found. Please add projects from the admin panel!
          </motion.div>
        ) : (
          <motion.div
            variants={containerStaggerVariants}
            initial="visible" // Set initial to "visible" to ensure staggerChildren always runs on mount
            animate="visible" // Always animate to visible
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardItemVariants}
                initial="initial" // Animate from 'initial' state
                animate="visible" // Animate to 'visible' state
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card className="h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.imageUrl} // Dynamic Image URL
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }}
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {project.category}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>

                    <CardDescription className="text-gray-600 mb-4">
                      {project.description}
                    </CardDescription>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => ( // Show max 3 technologies
                          <span key={techIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA - Uses handleProjectClick */}
                    <Button
                      variant="outline"
                      className="group/btn w-full border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300"
                      onClick={() => handleProjectClick(project)} // Pass the full project object
                    >
                      <span className="font-medium">Explore Project</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={fadeInSlideUpVariants.initial}
          animate={fadeInSlideUpVariants.animate}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 lg:p-12 text-center shadow-xl"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Have a Project Idea in Mind?
            </h3>
            <p className="text-blue-100 mb-8">
              Let's discuss your vision and turn it into a successful technology solution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-medium"
                onClick={() => scrollToSection('#contact')}
              >
                Request a Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => console.log('View all case studies clicked!')}
              >
                View All Case Studies
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectSection;