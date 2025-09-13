import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  linkWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto sign in anonymously on first visit
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // No user, sign in anonymously
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error('Anonymous sign-in failed:', error);
        }
      } else {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const upgradeToGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      if (currentUser?.isAnonymous) {
        // Link anonymous account with Google
        await linkWithPopup(currentUser, provider);
      } else {
        // Regular Google sign in
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    upgradeToGoogle,
    isAnonymous: currentUser?.isAnonymous
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}