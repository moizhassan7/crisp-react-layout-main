// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your page components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./pages/admin/dashboard";
import AdminAboutPage from "./pages/admin/about";

// Imports for Team Management
import AdminTeamPage from "./pages/admin/team";
import AdminAddTeamMember from "./pages/admin/team/add";
import AdminEditTeamMember from "./pages/admin/team/edit/[id]";

// Imports for Services Management
import AdminServicesPage from "./pages/admin/services";
import AdminAddService from "./pages/admin/services/add";
import AdminEditService from "./pages/admin/services/edit/[id]";

// Imports for Project Management
import AdminProjectsPage from "./pages/admin/projects";
import AdminAddProject from "./pages/admin/projects/add";
import AdminEditProject from "./pages/admin/projects/edit/[id]";

// Imports for Pricing Management
import AdminPricingPage from "./pages/admin/pricing";
import AdminAddPricingPlan from "./pages/admin/pricing/add";
import AdminEditPricingPlan from "./pages/admin/pricing/edit/[id]";

// --- NEW IMPORTS FOR IMAGE GALLERY MANAGEMENT ---
import AdminImageGalleryPage from "./pages/admin/gallery";
import AdminAddGalleryImage from "./pages/admin/gallery/add";
import AdminEditGalleryImage from "./pages/admin/gallery/edit/[id]"; // Dynamic route component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/about" element={<AdminAboutPage />} />

          {/* Routes for Team Management */}
          <Route path="/admin/team" element={<AdminTeamPage />} />
          <Route path="/admin/team/add" element={<AdminAddTeamMember />} />
          <Route path="/admin/team/edit/:id" element={<AdminEditTeamMember />} />

          {/* Routes for Services Management */}
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/services/add" element={<AdminAddService />} />
          <Route path="/admin/services/edit/:id" element={<AdminEditService />} />

          {/* Routes for Project Management */}
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/projects/add" element={<AdminAddProject />} />
          <Route path="/admin/projects/edit/:id" element={<AdminEditProject />} />

          {/* Routes for Pricing Management */}
          <Route path="/admin/pricing" element={<AdminPricingPage />} />
          <Route path="/admin/pricing/add" element={<AdminAddPricingPlan />} />
          <Route path="/admin/pricing/edit/:id" element={<AdminEditPricingPlan />} />

          {/* --- NEW ROUTES FOR IMAGE GALLERY MANAGEMENT --- */}
          <Route path="/admin/gallery" element={<AdminImageGalleryPage />} />
          <Route path="/admin/gallery/add" element={<AdminAddGalleryImage />} />
          <Route path="/admin/gallery/edit/:id" element={<AdminEditGalleryImage />} /> {/* Dynamic route */}

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
