import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useCompletion(participant) {
  useEffect(() => {
    if (!participant) return;
    
    // Check if challenge is complete
    if (participant.completedCount === 10 && !participant.completedAt) {
      const addToLeaderboard = async () => {
        try {
          // Update participant completion time
          await setDoc(doc(db, 'participants', participant.userId), {
            completedAt: serverTimestamp()
          }, { merge: true });
          
          // Add to leaderboard
          await setDoc(doc(db, 'leaderboard', participant.userId), {
            participantId: participant.userId,
            name: participant.name,
            completedCount: participant.completedCount,
            completedAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Error updating completion:', error);
        }
      };
      
      addToLeaderboard();
    }
  }, [participant?.completedCount, participant?.completedAt, participant]);
}