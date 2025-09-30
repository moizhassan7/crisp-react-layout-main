// src/pages/admin/projects/index.tsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  technologies: string[];
  client: string;
}

const AdminProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = collection(db, "projects"); // query(collection(db, "projects"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      const fetchedProjects: Project[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });
      // Sort in memory if orderBy is not used in query
      fetchedProjects.sort((a, b) => a.title.localeCompare(b.title));
      setProjects(fetchedProjects);
    } catch (err: any) {
      setError("Error fetching projects: " + err.message);
      console.error("Firestore fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(project => project.id !== id));
        alert(`Project "${title}" deleted successfully.`);
      } catch (err: any) {
        alert("Error deleting project: " + err.message);
        console.error("Firestore delete error:", err);
      }
    }
  };

  if (loading) return <AdminLayout><p>Loading projects...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Projects</h1>
        <button
          onClick={() => navigate('/admin/projects/add')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Project
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects found. Click "Add New Project" to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-12 h-12 rounded-md object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjectsPage;
