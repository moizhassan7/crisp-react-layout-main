// src/pages/admin/about/index.tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { iconMap } from '@/common/IconPicker'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

const AdminServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = collection(db, "services"); // query(collection(db, "services"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      const fetchedServices: Service[] = [];
      querySnapshot.forEach((doc) => {
        fetchedServices.push({ id: doc.id, ...doc.data() } as Service);
      });
      // Sort in memory if orderBy is not used in query
      fetchedServices.sort((a, b) => a.title.localeCompare(b.title));
      setServices(fetchedServices);
    } catch (err: any) {
      setError("Error fetching services: " + err.message);
      console.error("Firestore fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete service "${title}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "services", id));
        setServices(services.filter(service => service.id !== id));
        alert(`Service "${title}" deleted successfully.`);
      } catch (err: any) {
        alert("Error deleting service: " + err.message);
        console.error("Firestore delete error:", err);
      }
    }
  };

  if (loading) return <AdminLayout><p>Loading services...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>
        <button
          onClick={() => navigate('/admin/services/add')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Service
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {services.length === 0 ? (
          <p className="text-gray-600">No services found. Click "Add New Service" to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Icon
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => {
                  const ServiceIcon = iconMap[service.iconName as keyof typeof iconMap];
                  return (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ServiceIcon ? (
                          <ServiceIcon className="w-6 h-6 text-blue-600" />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">?</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {service.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.title)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServicesPage;
