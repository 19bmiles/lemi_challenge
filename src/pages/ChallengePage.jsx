import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useParticipant } from '../hooks/useParticipant';
import { useCompletion } from '../hooks/useCompletion';
import DrinkItem from '../components/DrinkItem';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function ChallengePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { participant, loading: participantLoading } = useParticipant();
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track completion
  useCompletion(participant);

  // Load challenge data
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const challengeDoc = await getDoc(doc(db, 'challenges', 'wedding2025'));
        if (challengeDoc.exists()) {
          setDrinks(challengeDoc.data().drinks);
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
      } finally {
        setLoading(false);
      }
    };
    loadChallenge();
  }, []);

  const toggleDrink = async (drinkId) => {
    if (!currentUser) return;
    
    const participantRef = doc(db, 'participants', currentUser.uid);
    const currentStatus = participant?.progress?.[drinkId]?.checked || false;
    
    try {
      await updateDoc(participantRef, {
        [`progress.${drinkId}.checked`]: !currentStatus,
        [`progress.${drinkId}.timestamp`]: new Date(),
        completedCount: participant.completedCount + (currentStatus ? -1 : 1)
      });
    } catch (error) {
      console.error('Error toggling drink:', error);
    }
  };

  if (loading || participantLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((participant?.completedCount || 0) / 10) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">🍻 Bar Challenge</h1>
            <Button 
              onClick={() => navigate('/')}
              variant="secondary"
              className="text-sm"
            >
              Back
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-purple-600 h-4 rounded-full transition-all duration-500 animate-pulse-subtle"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center mt-2 text-gray-600">
              {participant?.completedCount || 0} of 10 drinks completed
            </p>
          </div>

          {participant?.completedCount === 10 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-slide-in">
              <p className="text-green-800 text-center font-semibold">
                🎉 Congratulations! You've completed the challenge! 🎉
              </p>
            </div>
          )}
        </div>

        {/* Drinks List */}
        <div className="space-y-4">
          {drinks.map(drink => (
            <DrinkItem
              key={drink.id}
              drink={drink}
              checked={participant?.progress?.[drink.id]?.checked || false}
              photoUrl={participant?.progress?.[drink.id]?.photoUrl}
              onToggle={() => toggleDrink(drink.id)}
              participantId={currentUser?.uid}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button 
            onClick={() => navigate('/leaderboard')}
            variant="primary"
            className="px-8"
          >
            View Leaderboard 🏆
          </Button>
        </div>
      </div>
    </div>
  );
}