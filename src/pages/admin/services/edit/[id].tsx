// src/pages/admin/services/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout'; // Adjust path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig'; // Adjust path
import { useParams, useNavigate } from 'react-router-dom';
import { IconPicker } from '@/common/IconPicker'; // Adjust path
import { PlusCircle, MinusCircle } from 'lucide-react';

const AdminEditService = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code2');
  const [features, setFeatures] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No service ID provided.");
      return;
    }

    const fetchService = async () => {
      try {
        const docRef = doc(db, "services", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setDescription(data.description || '');
          setIconName(data.iconName || 'Code2');
          setFeatures(data.features || ['']); // Ensure it's an array, default to empty string if null/undefined
        } else {
          setError("Service not found.");
        }
      } catch (err: any) {
        setError("Error fetching service: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Cannot update: Service ID is missing.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const filteredFeatures = features.filter(f => f.trim() !== ''); // Remove empty features

    try {
      const docRef = doc(db, "services", id);
      await updateDoc(docRef, {
        title,
        description,
        iconName,
        features: filteredFeatures,
        updatedAt: new Date(),
      });

      alert("Service updated successfully!");
      navigate('/admin/services'); // Redirect to services list
    } catch (err: any) {
      setError("Failed to update service: " + err.message);
      console.error("Firestore update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading service data...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;
  if (!id) return <AdminLayout><p>Invalid Service ID.</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Service</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Service Title</label>
          <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required></textarea>
        </div>
        
        <div className="mb-4">
          <IconPicker
            label="Service Icon"
            value={iconName}
            onChange={setIconName}
          />
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

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Service'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditService;
