// src/pages/admin/services/add.tsx
import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { IconPicker } from '@/common/IconPicker'; // Adjust path
import { PlusCircle, MinusCircle } from 'lucide-react'; // For adding/removing features

const AdminAddService = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code2'); // Default icon
  const [features, setFeatures] = useState<string[]>(['']); // Array of features, starting with one empty
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setSubmitting(true);
    setError(null);

    const filteredFeatures = features.filter(f => f.trim() !== ''); // Remove empty features

    try {
      await addDoc(collection(db, "services"), {
        title,
        description,
        iconName,
        features: filteredFeatures,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      alert("Service added successfully!");
      navigate('/admin/services'); // Redirect to services list
    } catch (err: any) {
      setError("Failed to add service: " + err.message);
      console.error("Firestore add error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Service</h1>
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
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Service'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminAddService;
