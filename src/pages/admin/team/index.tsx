// src/pages/admin/team/index.tsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  expertise: string[];
  iconName: string;
  color: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

const AdminTeamPage = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Note: orderBy is commented out as per previous instructions to avoid index issues.
      // If you need sorting, fetch all and sort in memory.
      const q = collection(db, "teamMembers"); // query(collection(db, "teamMembers"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const members: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() } as TeamMember);
      });
      // Sort in memory if orderBy is not used in query
      members.sort((a, b) => a.name.localeCompare(b.name));
      setTeamMembers(members);
    } catch (err: any) {
      setError("Error fetching team members: " + err.message);
      console.error("Firestore fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "teamMembers", id));
        setTeamMembers(teamMembers.filter(member => member.id !== id));
        alert(`Team member "${name}" deleted successfully.`);
      } catch (err: any) {
        alert("Error deleting team member: " + err.message);
        console.error("Firestore delete error:", err);
      }
    }
  };

  if (loading) return <AdminLayout><p>Loading team members...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Team Members</h1>
        <button
          onClick={() => navigate('/admin/team/add')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Member
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {teamMembers.length === 0 ? (
          <p className="text-gray-600">No team members found. Click "Add New Member" to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expertise
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.expertise?.join(', ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/team/edit/${member.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
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

export default AdminTeamPage;
