// src/pages/admin/team/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout'; // Adjust path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig'; // Adjust path
import { useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '@/common/ImageUpload'; // Adjust path
import { IconPicker } from '@/common/IconPicker';// Adjust path// Adjust path // Adjust path

const AdminEditTeamMember = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [iconName, setIconName] = useState('Server');
  const [color, setColor] = useState('bg-gradient-to-br from-blue-500 to-indigo-600');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Current image URL
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No team member ID provided.");
      return;
    }

    const fetchMember = async () => {
      try {
        const docRef = doc(db, "teamMembers", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setRole(data.role || '');
          setBio(data.bio || '');
          setExpertise(data.expertise ? data.expertise.join(', ') : '');
          setIconName(data.iconName || 'Server');
          setColor(data.color || 'bg-gradient-to-br from-blue-500 to-indigo-600');
          setLinkedin(data.linkedin || '');
          setTwitter(data.twitter || '');
          setGithub(data.github || '');
          setImageUrl(data.imageUrl || '');
        } else {
          setError("Team member not found.");
        }
      } catch (err: any) {
        setError("Error fetching team member: " + err.message);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Cannot update: Team member ID is missing.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const expertiseArray = expertise.split(',').map(s => s.trim()).filter(s => s);

      const docRef = doc(db, "teamMembers", id);
      await updateDoc(docRef, {
        name,
        role,
        bio,
        expertise: expertiseArray,
        iconName,
        color,
        imageUrl,
        linkedin,
        twitter,
        github,
        updatedAt: new Date(),
      });

      alert("Team member updated successfully!");
      navigate('/admin/team'); // Redirect to team list
    } catch (err: any) {
      setError("Failed to update team member: " + err.message);
      console.error("Firestore update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading team member data...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;
  if (!id) return <AdminLayout><p>Invalid Team Member ID.</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Team Member</h1>
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
          folderPath="team_members"
          currentImageUrl={imageUrl}
        />
        {imageUrl && <p className="text-sm text-green-600 mb-4">Current Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Image</a></p>}

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
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Member'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditTeamMember;
