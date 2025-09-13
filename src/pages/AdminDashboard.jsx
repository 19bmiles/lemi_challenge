import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalCompletions: 0,
    totalPhotos: 0,
    averageProgress: 0
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'participants'),
      (snapshot) => {
        const participants = snapshot.docs.map(doc => doc.data());
        
        const totalParticipants = participants.length;
        const totalCompletions = participants.filter(p => p.completedCount === 10).length;
        const totalPhotos = participants.reduce((sum, p) => sum + (p.photoCount || 0), 0);
        const averageProgress = totalParticipants > 0 
          ? participants.reduce((sum, p) => sum + (p.completedCount || 0), 0) / totalParticipants
          : 0;

        setStats({
          totalParticipants,
          totalCompletions,
          totalPhotos,
          averageProgress
        });
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📊 Admin Dashboard</h1>
            <Button 
              onClick={() => navigate('/')}
              variant="secondary"
              className="text-sm"
            >
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Participants</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">{stats.totalParticipants}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Completions</h3>
              <p className="text-3xl font-bold text-green-700 mt-2">{stats.totalCompletions}</p>
              {stats.totalParticipants > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  {((stats.totalCompletions / stats.totalParticipants) * 100).toFixed(1)}% completion rate
                </p>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Photos Uploaded</h3>
              <p className="text-3xl font-bold text-purple-700 mt-2">{stats.totalPhotos}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900">Average Progress</h3>
              <p className="text-3xl font-bold text-orange-700 mt-2">
                {stats.averageProgress.toFixed(1)}/10
              </p>
              <div className="mt-2 bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.averageProgress * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}