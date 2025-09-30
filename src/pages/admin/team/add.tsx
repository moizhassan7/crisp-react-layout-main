// src/pages/admin/team/add.tsx
import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout'; // Adjust path
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { IconPicker } from '@/common/IconPicker';// Adjust path// Adjust path
import ImageUpload from '@/common/ImageUpload'; // Adjust path

const AdminAddTeamMember = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState(''); // Comma separated string
  const [iconName, setIconName] = useState('Server'); // Default icon
  const [color, setColor] = useState('bg-gradient-to-br from-blue-500 to-indigo-600'); // Default color
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Stores the URL from Firebase Storage
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    setError(null); // Clear any image-related errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const expertiseArray = expertise.split(',').map(s => s.trim()).filter(s => s);

      await addDoc(collection(db, "teamMembers"), {
        name,
        role,
        bio,
        expertise: expertiseArray,
        iconName,
        color,
        imageUrl, // Save the URL
        linkedin,
        twitter,
        github,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      alert("Team member added successfully!"); // Using alert for simplicity, consider a Toast
      navigate('/admin/team'); // Redirect to team list
    } catch (err: any) {
      setError("Failed to add team member: " + err.message);
      console.error("Firestore add error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Team Member</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <input type="text" className="form-input" value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
          <textarea className="form-textarea" value={bio} onChange={(e) => setBio(e.target.value)} rows={3}></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Expertise (comma-separated)</label>
          <input type="text" className="form-input" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="e.g., React, Node.js, Cloud" />
        </div>
        
        <ImageUpload
          label="Member Image"
          onUploadSuccess={handleImageUploadSuccess}
          folderPath="team_members" // Folder in Firebase Storage
          currentImageUrl={imageUrl} // Show preview if image already uploaded
        />
        {imageUrl && <p className="text-sm text-green-600 mb-4">Image uploaded: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

        <div className="mb-4">
          <IconPicker
            label="Expertise Icon"
            value={iconName}
            onChange={setIconName}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Background Color (Tailwind Class)</label>
          <input type="text" className="form-input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g., bg-gradient-to-br from-blue-500 to-indigo-600" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">LinkedIn URL (Optional)</label>
          <input type="url" className="form-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Twitter URL (Optional)</label>
          <input type="url" className="form-input" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">GitHub URL (Optional)</label>
          <input type="url" className="form-input" value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Member'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminAddTeamMember;
