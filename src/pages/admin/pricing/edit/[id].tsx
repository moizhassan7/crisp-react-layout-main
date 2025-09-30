// src/pages/admin/pricing/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout'; // Adjust path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig'; // Adjust path
import { useParams, useNavigate } from 'react-router-dom';
import { IconPicker } from '@/common/IconPicker'; // Adjust path
import { PlusCircle, MinusCircle } from 'lucide-react';

interface AssociatedService {
  iconName: string;
  label: string;
}

const AdminEditPricingPlan = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
  const [annualPrice, setAnnualPrice] = useState<number>(0);
  const [popular, setPopular] = useState(false);
  const [iconName, setIconName] = useState('Wifi');
  const [color, setColor] = useState('from-blue-500 to-indigo-500');
  const [features, setFeatures] = useState<string[]>(['']);
  const [associatedServices, setAssociatedServices] = useState<AssociatedService[]>([{ iconName: 'Network', label: '' }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No pricing plan ID provided.");
      return;
    }

    const fetchPricingPlan = async () => {
      try {
        const docRef = doc(db, "pricingPlans", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setDescription(data.description || '');
          setMonthlyPrice(Number(data.monthlyPrice) || 0);
          setAnnualPrice(Number(data.annualPrice) || 0);
          setPopular(data.popular || false);
          setIconName(data.iconName || 'Wifi');
          setColor(data.color || 'from-blue-500 to-indigo-500');
          setFeatures(data.features || ['']);
          setAssociatedServices(data.associatedServices || [{ iconName: 'Network', label: '' }]);
        } else {
          setError("Pricing plan not found.");
        }
      } catch (err: any) {
        setError("Error fetching pricing plan: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricingPlan();
  }, [id]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAssociatedServiceChange = (index: number, field: keyof AssociatedService, value: string) => {
    const newServices = [...associatedServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setAssociatedServices(newServices);
  };

  const handleAddAssociatedService = () => {
    setAssociatedServices([...associatedServices, { iconName: 'Network', label: '' }]);
  };

  const handleRemoveAssociatedService = (index: number) => {
    setAssociatedServices(associatedServices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Cannot update: Pricing plan ID is missing.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const filteredFeatures = features.filter(f => f.trim() !== '');
    const filteredAssociatedServices = associatedServices.filter(s => s.label.trim() !== '');

    try {
      const docRef = doc(db, "pricingPlans", id);
      await updateDoc(docRef, {
        name,
        description,
        monthlyPrice: Number(monthlyPrice),
        annualPrice: Number(annualPrice),
        popular,
        iconName,
        color,
        features: filteredFeatures,
        associatedServices: filteredAssociatedServices,
        updatedAt: new Date(),
      });

      alert("Pricing plan updated successfully!");
      navigate('/admin/pricing'); // Redirect to pricing list
    } catch (err: any) {
      setError("Failed to update pricing plan: " + err.message);
      console.error("Firestore update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading pricing plan data...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;
  if (!id) return <AdminLayout><p>Invalid Pricing Plan ID.</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Pricing Plan</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Plan Name</label>
          <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Monthly Price (PKR)</label>
          <input type="number" className="form-input" value={monthlyPrice} onChange={(e) => setMonthlyPrice(Number(e.target.value))} required min="0" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Annual Price (PKR)</label>
          <input type="number" className="form-input" value={annualPrice} onChange={(e) => setAnnualPrice(Number(e.target.value))} required min="0" />
        </div>
        <div className="mb-4 flex items-center">
          <input type="checkbox" id="popular" className="mr-2" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
          <label htmlFor="popular" className="text-gray-700 text-sm font-bold">Mark as Popular</label>
        </div>
        
        <div className="mb-4">
          <IconPicker
            label="Plan Icon"
            value={iconName}
            onChange={setIconName}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Background Color (Tailwind Class)</label>
          <input type="text" className="form-input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g., from-blue-500 to-indigo-500" />
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-gray-800">Features</h2>
        {features.map((feature, index) => (
          <div key={index} className="flex items-center mb-3">
            <input
              type="text"
              className="form-input flex-grow mr-2"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              placeholder={`Feature ${index + 1}`}
            />
            {features.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove Feature"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddFeature}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-6"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Feature
        </button>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-gray-800">Associated Services</h2>
        {associatedServices.map((service, index) => (
          <div key={index} className="border border-gray-200 p-3 rounded-md mb-3 relative">
            <h3 className="text-md font-medium mb-2">Service {index + 1}</h3>
            {associatedServices.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAssociatedService(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Remove Service"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
            )}
            <div className="mb-3">
              <IconPicker
                label="Service Icon"
                value={service.iconName}
                onChange={(iconName) => handleAssociatedServiceChange(index, 'iconName', iconName)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Label</label>
              <input
                type="text"
                className="form-input"
                value={service.label}
                onChange={(e) => handleAssociatedServiceChange(index, 'label', e.target.value)}
                placeholder="e.g., Networking"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAssociatedService}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-6"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Associated Service
        </button>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Pricing Plan'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditPricingPlan;
