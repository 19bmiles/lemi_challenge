import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Generate a unique ID for each user session
const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export function UserProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Load saved user data from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('wedding_challenge_name');
    const savedId = localStorage.getItem('wedding_challenge_id');
    
    if (savedName && savedId) {
      setUserName(savedName);
      setUserId(savedId);
    } else if (savedId) {
      // Has ID but no name (shouldn't happen but handle it)
      setUserId(savedId);
    } else {
      // Generate new ID for this session
      const newId = generateUserId();
      setUserId(newId);
      localStorage.setItem('wedding_challenge_id', newId);
    }
    
    setIsReady(true);
  }, []);

  const saveUserName = (name) => {
    setUserName(name);
    localStorage.setItem('wedding_challenge_name', name);
    
    // Ensure we have a userId
    if (!userId) {
      const newId = generateUserId();
      setUserId(newId);
      localStorage.setItem('wedding_challenge_id', newId);
    }
  };

  const clearUserData = () => {
    setUserName('');
    // Keep the userId but clear the name
    localStorage.removeItem('wedding_challenge_name');
  };

  const value = {
    userName,
    userId,
    saveUserName,
    clearUserData,
    hasName: !!userName,
    isReady
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}