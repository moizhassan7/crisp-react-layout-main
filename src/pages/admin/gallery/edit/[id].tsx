// src/pages/admin/gallery/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout'; // Adjust path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig'; // Adjust path
import { useParams, useNavigate } from 'react-router-dom';
import ImageUpload from "@/common/ImageUpload"

const AdminEditGalleryImage = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Current image URL
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No gallery image ID provided.");
      return;
    }

    const fetchGalleryImage = async () => {
      try {
        const docRef = doc(db, "imageGallery", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setAltText(data.altText || '');
          setCategory(data.category || '');
          setImageUrl(data.imageUrl || '');
        } else {
          setError("Gallery image not found.");
        }
      } catch (err: any) {
        setError("Error fetching gallery image: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImage();
  }, [id]);

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Cannot update: Gallery image ID is missing.");
      return;
    }
    setSubmitting(true);
    setError(null);

    if (!imageUrl) {
      setError("Image URL is missing. Please upload an image.");
      setSubmitting(false);
      return;
    }

    try {
      const docRef = doc(db, "imageGallery", id);
      await updateDoc(docRef, {
        title,
        altText,
        category,
        imageUrl,
        updatedAt: new Date(),
      });

      alert("Gallery image updated successfully!");
      navigate('/admin/gallery'); // Redirect to gallery list
    } catch (err: any) {
      setError("Failed to update gallery image: " + err.message);
      console.error("Firestore update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading gallery image data...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;
  if (!id) return <AdminLayout><p>Invalid Gallery Image ID.</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Gallery Image</h1>
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
          folderPath="gallery"
          currentImageUrl={imageUrl}
        />
        {imageUrl && <p className="text-sm text-green-600 mb-4">Current Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Image'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditGalleryImage;
