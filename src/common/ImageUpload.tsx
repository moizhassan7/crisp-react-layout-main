// src/components/common/ImageUpload.tsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig'; // Adjust path

interface ImageUploadProps {
  currentImageUrl?: string; // Optional: URL of the currently displayed image
  onUploadSuccess: (url: string) => void;
  folderPath: string; // e.g., "team_members", "projects"
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onUploadSuccess,
  folderPath,
  label = "Upload Image"
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a local preview URL
      setError(null);
    } else {
      setImageFile(null);
      setPreviewUrl(currentImageUrl || null); // Revert to current image if no new file
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a unique file name to avoid conflicts
      const fileName = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `${folderPath}/${fileName}`);
      
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      onUploadSuccess(downloadURL); // Pass the URL back to the parent component
      setImageFile(null); // Clear the selected file after successful upload
      setPreviewUrl(downloadURL); // Update preview to the newly uploaded image
    } catch (err: any) {
      setError("Image upload failed: " + err.message);
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      
      {previewUrl && (
        <div className="mb-4">
          <img src={previewUrl} alt="Image Preview" className="w-32 h-32 object-cover rounded-md shadow-sm" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      
      <button
        type="button"
        onClick={handleUpload}
        disabled={!imageFile || uploading}
        className={`mt-4 px-4 py-2 rounded-md text-white font-medium transition-colors ${
          !imageFile || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
