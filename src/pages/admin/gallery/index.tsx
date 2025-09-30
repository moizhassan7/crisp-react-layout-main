// src/pages/admin/gallery/index.tsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  category: string;
}

const AdminImageGalleryPage = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = collection(db, "imageGallery"); // query(collection(db, "imageGallery"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      const fetchedImages: GalleryImage[] = [];
      querySnapshot.forEach((doc) => {
        fetchedImages.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      // Sort in memory if orderBy is not used in query
      fetchedImages.sort((a, b) => a.title.localeCompare(b.title));
      setGalleryImages(fetchedImages);
    } catch (err: any) {
      setError("Error fetching gallery images: " + err.message);
      console.error("Firestore fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete image "${title}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "imageGallery", id));
        setGalleryImages(galleryImages.filter(image => image.id !== id));
        alert(`Image "${title}" deleted successfully.`);
      } catch (err: any) {
        alert("Error deleting image: " + err.message);
        console.error("Firestore delete error:", err);
      }
    }
  };

  if (loading) return <AdminLayout><p>Loading image gallery...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Image Gallery</h1>
        <button
          onClick={() => navigate('/admin/gallery/add')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Image
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {galleryImages.length === 0 ? (
          <p className="text-gray-600">No images found in the gallery. Click "Add New Image" to get started!</p>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {galleryImages.map((image) => (
                  <tr key={image.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {image.imageUrl ? (
                        <img src={image.imageUrl} alt={image.altText} className="w-16 h-12 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {image.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {image.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/gallery/edit/${image.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id, image.title)}
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

export default AdminImageGalleryPage;
