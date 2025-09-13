import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useParticipant() {
  const { currentUser } = useAuth();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const participantRef = doc(db, 'participants', currentUser.uid);
    
    // Create or update participant document
    const initParticipant = async () => {
      try {
        await setDoc(participantRef, {
          userId: currentUser.uid,
          name: currentUser.displayName || `Guest ${currentUser.uid.slice(0,6)}`,
          email: currentUser.email || null,
          isAnonymous: currentUser.isAnonymous,
          startedAt: new Date(),
          progress: {},
          completedCount: 0,
          photoCount: 0
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
  }, [currentUser]);

  return { participant, loading };
}