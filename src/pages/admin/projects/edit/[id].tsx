// src/pages/admin/projects/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout'; // Adjust path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig'; // Adjust path
import { useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '@/common/ImageUpload'; // Adjust path
import { PlusCircle, MinusCircle } from 'lucide-react';

const AdminEditProject = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['']);
  const [client, setClient] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Current image URL
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No project ID provided.");
      return;
    }

    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setCategory(data.category || '');
          setDescription(data.description || '');
          setFullDescription(data.fullDescription || '');
          setTechnologies(data.technologies || ['']); // Ensure it's an array
          setClient(data.client || '');
          setChallenge(data.challenge || '');
          setSolution(data.solution || '');
          setResults(data.results || '');
          setImageUrl(data.imageUrl || '');
        } else {
          setError("Project not found.");
        }
      } catch (err: any) {
        setError("Error fetching project: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    setError(null);
  };

  const handleTechnologyChange = (index: number, value: string) => {
    const newTechnologies = [...technologies];
    newTechnologies[index] = value;
    setTechnologies(newTechnologies);
  };

  const handleAddTechnology = () => {
    setTechnologies([...technologies, '']);
  };

  const handleRemoveTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Cannot update: Project ID is missing.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const filteredTechnologies = technologies.filter(tech => tech.trim() !== '');

    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        title,
        category,
        description,
        fullDescription,
        technologies: filteredTechnologies,
        client,
        challenge,
        solution,
        results,
        imageUrl,
        updatedAt: new Date(),
      });

      alert("Project updated successfully!");
      navigate('/admin/projects'); // Redirect to projects list
    } catch (err: any) {
      setError("Failed to update project: " + err.message);
      console.error("Firestore update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading project data...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;
  if (!id) return <AdminLayout><p>Invalid Project ID.</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Project</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Project Title</label>
          <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
          <input type="text" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g., Web Development, AI/ML" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Short Description</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Description</label>
          <textarea className="form-textarea" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={5}></textarea>
        </div>
        
        <ImageUpload
          label="Project Image"
          onUploadSuccess={handleImageUploadSuccess}
          folderPath="projects"
          currentImageUrl={imageUrl}
        />
        {imageUrl && <p className="text-sm text-green-600 mb-4">Current Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

        <h2 className="text-xl font-semibold mb-4 mt-6 text-gray-800">Technologies Used</h2>
        {technologies.map((tech, index) => (
          <div key={index} className="flex items-center mb-3">
            <input
              type="text"
              className="form-input flex-grow mr-2"
              value={tech}
              onChange={(e) => handleTechnologyChange(index, e.target.value)}
              placeholder={`Technology ${index + 1}`}
            />
            {technologies.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveTechnology(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove Technology"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTechnology}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-6"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Technology
        </button>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Client Name</label>
          <input type="text" className="form-input" value={client} onChange={(e) => setClient(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Challenge</label>
          <textarea className="form-textarea" value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={3}></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Solution</label>
          <textarea className="form-textarea" value={solution} onChange={(e) => setSolution(e.target.value)} rows={3}></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Results</label>
          <textarea className="form-textarea" value={results} onChange={(e) => setResults(e.target.value)} rows={3}></textarea>
        </div>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Project'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditProject;
