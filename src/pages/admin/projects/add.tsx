// src/pages/admin/projects/add.tsx
import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import ImageUpload from '@/common/ImageUpload'; // Adjust path
import { PlusCircle, MinusCircle } from 'lucide-react'; // For adding/removing features

const AdminAddProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['']); // Array of technologies, starting with one empty
  const [client, setClient] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Stores the URL from Firebase Storage
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setSubmitting(true);
    setError(null);

    const filteredTechnologies = technologies.filter(tech => tech.trim() !== ''); // Remove empty technologies

    try {
      await addDoc(collection(db, "projects"), {
        title,
        category,
        description,
        fullDescription,
        technologies: filteredTechnologies,
        client,
        challenge,
        solution,
        results,
        imageUrl, // Save the URL
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      alert("Project added successfully!");
      navigate('/admin/projects'); // Redirect to projects list
    } catch (err: any) {
      setError("Failed to add project: " + err.message);
      console.error("Firestore add error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Project</h1>
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
          folderPath="projects" // Folder in Firebase Storage
          currentImageUrl={imageUrl}
        />
        {imageUrl && <p className="text-sm text-green-600 mb-4">Image uploaded: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

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
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Project'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminAddProject;
