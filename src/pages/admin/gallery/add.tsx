// src/pages/admin/gallery/add.tsx
import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import ImageUpload from '@/common/ImageUpload'; // Adjust path

const AdminAddGalleryImage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Stores the URL from Firebase Storage
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!imageUrl) {
      setError("Please upload an image before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "imageGallery"), {
        title,
        altText,
        category,
        imageUrl, // Save the URL
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      alert("Gallery image added successfully!");
      navigate('/admin/gallery'); // Redirect to gallery list
    } catch (err: any) {
      setError("Failed to add gallery image: " + err.message);
      console.error("Firestore add error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Gallery Image</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Image Title</label>
          <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Alt Text (for accessibility)</label>
          <input type="text" className="form-input" value={altText} onChange={(e) => setAltText(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
          <input type="text" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Collaboration, Analytics & AI" />
        </div>
        
        <ImageUpload
          label="Upload Image File"
          onUploadSuccess={handleImageUploadSuccess}
          folderPath="gallery" // Folder in Firebase Storage
          currentImageUrl={imageUrl} // Show preview if image already uploaded
        />
        {imageUrl && <p className="text-sm text-green-600 mb-4">Image uploaded: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Image to Gallery'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminAddGalleryImage;
