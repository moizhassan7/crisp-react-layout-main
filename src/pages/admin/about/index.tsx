// src/pages/admin/about/index.tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { IconPicker, iconMap } from '@/common/IconPicker'; // Adjust path
import ImageUpload from '@/common/ImageUpload'; // Import ImageUpload
import { PlusCircle, MinusCircle } from 'lucide-react';

interface AboutValue {
  iconName: string;
  title: string;
  description: string;
  color: string; // Tailwind class string
}

interface AboutStat {
  iconName: string;
  number: string;
  label: string;
}

interface CoreCapability {
  iconName: string;
  text: string;
}

interface AboutContent {
  mainTitle: string;
  subtitle: string;
  description1: string;
  description2: string;
  quote: string;
  mainImageUrl: string; // Added
  statsSectionImageUrl: string; // Added
  values: AboutValue[];
  stats: AboutStat[];
  coreCapabilities: CoreCapability[];
}

const AdminAboutPage = () => {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "about", "content");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data() as AboutContent);
        } else {
          setError("No 'about' content found. Please create a 'content' document in the 'about' collection in Firestore.");
          setAboutData({ // Initialize with empty structure for new content
            mainTitle: '',
            subtitle: '',
            description1: '',
            description2: '',
            quote: '',
            mainImageUrl: '', // Initialize
            statsSectionImageUrl: '', // Initialize
            values: [],
            stats: [],
            coreCapabilities: []
          });
        }
      } catch (err: any) {
        setError("Error fetching about data: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageUploadSuccess = (field: keyof AboutContent, url: string) => {
    setAboutData(prev => prev ? { ...prev, [field]: url } : null);
    setError(null);
  };

  const handleValueChange = (index: number, field: keyof AboutValue, value: string) => {
    setAboutData(prev => {
      if (!prev) return null;
      const newValues = [...prev.values];
      newValues[index] = { ...newValues[index], [field]: value };
      return { ...prev, values: newValues };
    });
  };

  const handleAddValue = () => {
    setAboutData(prev => prev ? {
      ...prev,
      values: [...prev.values, { iconName: 'Target', title: '', description: '', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' }]
    } : null);
  };

  const handleRemoveValue = (index: number) => {
    setAboutData(prev => prev ? {
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    } : null);
  };

  const handleStatChange = (index: number, field: keyof AboutStat, value: string) => {
    setAboutData(prev => {
      if (!prev) return null;
      const newStats = [...prev.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, stats: newStats };
    });
  };

  const handleAddStat = () => {
    setAboutData(prev => prev ? {
      ...prev,
      stats: [...prev.stats, { iconName: 'CheckCircle', number: '', label: '' }]
    } : null);
  };

  const handleRemoveStat = (index: number) => {
    setAboutData(prev => prev ? {
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    } : null);
  };

  const handleCapabilityChange = (index: number, field: keyof CoreCapability, value: string) => {
    setAboutData(prev => {
      if (!prev) return null;
      const newCapabilities = [...prev.coreCapabilities];
      newCapabilities[index] = { ...newCapabilities[index], [field]: value };
      return { ...prev, coreCapabilities: newCapabilities };
    });
  };

  const handleAddCapability = () => {
    setAboutData(prev => prev ? {
      ...prev,
      coreCapabilities: [...prev.coreCapabilities, { iconName: 'Server', text: '' }]
    } : null);
  };

  const handleRemoveCapability = (index: number) => {
    setAboutData(prev => prev ? {
      ...prev,
      coreCapabilities: prev.coreCapabilities.filter((_, i) => i !== index)
    } : null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;

    setSubmitting(true);
    setError(null);

    try {
      const docRef = doc(db, "about", "content");
      await updateDoc(docRef, { ...aboutData, updatedAt: new Date() });
      alert("About section updated successfully!"); // Using alert for simplicity, consider a Toast
    } catch (err: any) {
      setError("Failed to update about section: " + err.message);
      console.error("Firestore update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading About section data...</p></AdminLayout>;
  if (error && !aboutData) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage About Section</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Main Content</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Main Title</label>
          <input
            type="text"
            name="mainTitle"
            value={aboutData?.mainTitle || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={aboutData?.subtitle || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description Paragraph 1</label>
          <textarea
            name="description1"
            value={aboutData?.description1 || ''}
            onChange={handleChange}
            className="form-textarea"
            rows={4}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description Paragraph 2</label>
          <textarea
            name="description2"
            value={aboutData?.description2 || ''}
            onChange={handleChange}
            className="form-textarea"
            rows={4}
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Quote</label>
          <textarea
            name="quote"
            value={aboutData?.quote || ''}
            onChange={handleChange}
            className="form-textarea"
            rows={2}
          ></textarea>
        </div>

        <ImageUpload
          label="Main Content Image"
          onUploadSuccess={(url) => handleImageUploadSuccess('mainImageUrl', url)}
          folderPath="about_images"
          currentImageUrl={aboutData?.mainImageUrl}
        />
        {aboutData?.mainImageUrl && <p className="text-sm text-green-600 mb-4">Current Main Image: <a href={aboutData.mainImageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

        <h2 className="text-2xl font-semibold mb-6 mt-8 text-blue-700">Core Values</h2>
        {aboutData?.values.map((val, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 relative">
            <h3 className="text-lg font-medium mb-3">Value {index + 1}</h3>
            <button
              type="button"
              onClick={() => handleRemoveValue(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Remove Value"
            >
              <MinusCircle className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <IconPicker
                label="Icon"
                value={val.iconName}
                onChange={(iconName) => handleValueChange(index, 'iconName', iconName)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={val.title}
                onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                value={val.description}
                onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                className="form-textarea"
                rows={2}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Color (Tailwind Class)</label>
              <input
                type="text"
                value={val.color}
                onChange={(e) => handleValueChange(index, 'color', e.target.value)}
                className="form-input"
                placeholder="e.g., bg-gradient-to-br from-blue-500 to-indigo-600"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddValue}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-8"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Value
        </button>

        <h2 className="text-2xl font-semibold mb-6 mt-8 text-blue-700">Stats Section</h2>
        <ImageUpload
          label="Stats Section Image"
          onUploadSuccess={(url) => handleImageUploadSuccess('statsSectionImageUrl', url)}
          folderPath="about_images"
          currentImageUrl={aboutData?.statsSectionImageUrl}
        />
        {aboutData?.statsSectionImageUrl && <p className="text-sm text-green-600 mb-4">Current Stats Image: <a href={aboutData.statsSectionImageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

        {aboutData?.stats.map((stat, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 relative">
            <h3 className="text-lg font-medium mb-3">Stat {index + 1}</h3>
            <button
              type="button"
              onClick={() => handleRemoveStat(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Remove Stat"
            >
              <MinusCircle className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <IconPicker
                label="Icon"
                value={stat.iconName}
                onChange={(iconName) => handleStatChange(index, 'iconName', iconName)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Number (e.g., 500+, 99.9%)</label>
              <input
                type="text"
                value={stat.number}
                onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Label</label>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddStat}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-8"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Stat
        </button>

        <h2 className="text-2xl font-semibold mb-6 mt-8 text-blue-700">Core Capabilities</h2>
        {aboutData?.coreCapabilities.map((cap, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 relative">
            <h3 className="text-lg font-medium mb-3">Capability {index + 1}</h3>
            <button
              type="button"
              onClick={() => handleRemoveCapability(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Remove Capability"
            >
              <MinusCircle className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <IconPicker
                label="Icon"
                value={cap.iconName}
                onChange={(iconName) => handleCapabilityChange(index, 'iconName', iconName)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Text</label>
              <input
                type="text"
                value={cap.text}
                onChange={(e) => handleCapabilityChange(index, 'text', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCapability}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-8"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Capability
        </button>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save About Section'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminAboutPage;
