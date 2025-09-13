import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import imageCompression from 'browser-image-compression';

export default function DrinkItem({ drink, checked, photoUrl, onToggle, participantId }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(photoUrl);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !participantId) return;

    setUploading(true);
    
    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, 
        `challenges/wedding2025/${participantId}/${drink.id}_${Date.now()}.jpg`
      );
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update Firestore
      const participantRef = doc(db, 'participants', participantId);
      
      // Get current participant data to update photo count
      const participantDoc = await getDoc(participantRef);
      const currentPhotoCount = participantDoc.data()?.photoCount || 0;
      const hasExistingPhoto = participantDoc.data()?.progress?.[drink.id]?.photoUrl;
      
      await updateDoc(participantRef, {
        [`progress.${drink.id}.photoUrl`]: downloadURL,
        photoCount: hasExistingPhoto ? currentPhotoCount : currentPhotoCount + 1
      });
      
      setPreview(downloadURL);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500 mt-1"
            id={`drink-${drink.id}`}
          />
          <label htmlFor={`drink-${drink.id}`} className="cursor-pointer flex-1">
            <h3 className="font-medium text-gray-800">{drink.name}</h3>
            <span className="text-sm text-gray-500">
              {drink.type === 'beer' ? '🍺' : '🍹'} {drink.type}
            </span>
            {drink.description && (
              <p className="text-xs text-gray-400 mt-1">{drink.description}</p>
            )}
          </label>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {preview && (
            <img 
              src={preview} 
              alt={drink.name}
              className="w-12 h-12 rounded object-cover"
            />
          )}
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              disabled={uploading || !participantId}
              className="hidden"
            />
            <div className={`px-4 py-2 rounded text-white font-medium transition-colors ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}>
              {uploading ? 'Uploading...' : preview ? '📸 Update' : '📸 Photo'}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}