// src/pages/admin/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase/firebaseConfig'; // Adjust path as per your project structure
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout'; // Adjust path as per your project structure

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/admin/login'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Admin Dashboard! 👋</h1>
      <p className="text-gray-600 mb-8">Here you can manage your website content. Use the sidebar on the left to navigate to different sections.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick links/stats cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-600 mb-3">Content Management</h3>
          <p className="text-gray-700 mb-4">Edit sections like About, Services, Projects, and Team.</p>
          <button 
            onClick={() => navigate('/admin/about')}
            className="text-blue-500 hover:underline text-sm"
          >
            Go to Sections &rarr;
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-green-600 mb-3">User Management (Future)</h3>
          <p className="text-gray-700 mb-4">View and manage admin users (requires more advanced setup).</p>
          <span className="text-gray-400 text-sm">Coming Soon</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-purple-600 mb-3">Settings (Future)</h3>
          <p className="text-gray-700 mb-4">Configure global website settings.</p>
          <span className="text-gray-400 text-sm">Coming Soon</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
