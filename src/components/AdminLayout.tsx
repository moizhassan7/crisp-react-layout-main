// src/components/AdminLayout.tsx
import React, { ReactNode } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig' // Adjusted path: assuming firebaseConfig is in src/firebase
import { useNavigate, Link } from 'react-router-dom'; // Changed from next/router/Link

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/admin/dashboard" className="flex items-center text-blue-200 hover:text-white transition-colors">
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/admin/about" className="flex items-center text-blue-200 hover:text-white transition-colors">
                About Section
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/admin/team" className="flex items-center text-blue-200 hover:text-white transition-colors">
                Team Members
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/admin/services" className="flex items-center text-blue-200 hover:text-white transition-colors">
                Services
              </Link>
            </li>
             <li className="mb-4">
              <Link to="/admin/pricing" className="flex items-center text-blue-200 hover:text-white transition-colors">
                Pricing Plans
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/admin/projects" className="flex items-center text-blue-200 hover:text-white transition-colors">
                Projects
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/admin/gallery" className="flex items-center text-blue-200 hover:text-white transition-colors">
                Image Gallery
              </Link>
            </li>
            {/* Add more links for other sections as you create their admin pages */}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
