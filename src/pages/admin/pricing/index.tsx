// src/pages/admin/pricing/index.tsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { iconMap } from '@/common/IconPicker'; // Import iconMap

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular: boolean;
  iconName: string;
}

const AdminPricingPage = () => {
  const navigate = useNavigate();
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const fetchPricingPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = collection(db, "pricingPlans"); // query(collection(db, "pricingPlans"), orderBy("monthlyPrice"));
      const querySnapshot = await getDocs(q);
      const fetchedPlans: PricingPlan[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlans.push({ id: doc.id, ...doc.data() } as PricingPlan);
      });
      // Sort in memory if orderBy is not used in query
      fetchedPlans.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
      setPricingPlans(fetchedPlans);
    } catch (err: any) {
      setError("Error fetching pricing plans: " + err.message);
      console.error("Firestore fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete pricing plan "${name}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "pricingPlans", id));
        setPricingPlans(pricingPlans.filter(plan => plan.id !== id));
        alert(`Pricing plan "${name}" deleted successfully.`);
      } catch (err: any) {
        alert("Error deleting pricing plan: " + err.message);
        console.error("Firestore delete error:", err);
      }
    }
  };

  if (loading) return <AdminLayout><p>Loading pricing plans...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Pricing Plans</h1>
        <button
          onClick={() => navigate('/admin/pricing/add')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Plan
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {pricingPlans.length === 0 ? (
          <p className="text-gray-600">No pricing plans found. Click "Add New Plan" to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Icon
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popular
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pricingPlans.map((plan) => {
                  const PlanIcon = iconMap[plan.iconName as keyof typeof iconMap];
                  return (
                    <tr key={plan.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {PlanIcon ? (
                          <PlanIcon className="w-6 h-6 text-blue-600" />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">?</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {plan.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPKR(plan.monthlyPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPKR(plan.annualPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.popular ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/pricing/edit/${plan.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id, plan.name)}
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

export default AdminPricingPage;
