import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'participants'),
      orderBy('completedCount', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const leaderData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaders(leaderData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading leaderboard:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🏆 Leaderboard</h1>
            <Button 
              onClick={() => navigate('/')}
              variant="secondary"
              className="text-sm"
            >
              Back
            </Button>
          </div>

          {leaders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No participants yet. Be the first to join!
            </div>
          ) : (
            <div className="space-y-2">
              {leaders.map((leader, index) => {
                const isComplete = leader.completedCount === 10;
                const isTop3 = index < 3;
                
                return (
                  <div 
                    key={leader.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      isTop3 ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' : 'bg-gray-50'
                    } ${isComplete ? 'animate-pulse-subtle' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-400'
                      }`}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{leader.name}</p>
                        <p className="text-sm text-gray-500">
                          {leader.completedCount}/10 drinks
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isComplete && (
                        <span className="text-2xl">🎉</span>
                      )}
                      <div className="text-right">
                        <div className="flex space-x-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < leader.completedCount ? 'bg-purple-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center space-y-3">
          <Button 
            onClick={() => navigate('/challenge')}
            variant="primary"
            className="px-8"
          >
            Join Challenge 🍻
          </Button>
        </div>
      </div>
    </div>
  );
}