import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '../contexts/UserContext';

export function useParticipant() {
  const { userId, userName, hasName } = useUser();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId || !hasName) {
      setLoading(false);
      return;
    }

    const participantRef = doc(db, 'participants', userId);
    
    // Create or update participant document (only update name, not progress)
    const initParticipant = async () => {
      try {
        // Only set initial values, don't overwrite progress or completedCount
        await setDoc(participantRef, {
          userId: userId,
          name: userName,
          startedAt: new Date()
        }, { merge: true });
      } catch (error) {
        console.error('Error initializing participant:', error);
      }
    };

    initParticipant();

    // Listen to participant updates
    const unsubscribe = onSnapshot(participantRef, 
      (doc) => {
        if (doc.exists()) {
          setParticipant({ id: doc.id, ...doc.data() });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to participant:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, userName, hasName]);

  return { participant, loading };
}