# Wedding Drinking Challenge App - React + Firebase Implementation Guide

## 🎯 Project Overview

Build a web app where wedding guests can:
- ✅ Check off drinks from a list (8 beers + 2 cocktails)
- 📸 Upload photos with each drink
- 🏆 View real-time leaderboard
- 👤 Participate anonymously or with an account
- 📱 Works on mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Firestore, Storage, Auth, Hosting)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Image Handling**: Browser Image Compression

---

## 📋 Implementation Steps

### Phase 1: Project Setup (30 mins)

#### Step 1.1: Create React App
```bash
# Create new React app with Vite
npm create vite@latest wedding-challenge -- --template react
cd wedding-challenge
npm install

# Install dependencies
npm install firebase react-router-dom
npm install browser-image-compression
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Step 1.2: Setup Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "lemi-challenge-2025"
3. Enable:
   - **Authentication** → Anonymous + Google Sign-in
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode
   - **Hosting** → Set up later

#### Step 1.3: Get Firebase Config
```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Copy from Firebase Console → Project Settings
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

### Phase 2: Database Design (20 mins)

#### Step 2.1: Create Firestore Structure

```javascript
// Firestore Collections Structure

// 1. challenges (collection)
{
  id: "wedding2025",
  name: "Smith-Johnson Wedding",
  date: "2025-09-14",
  venue: "Grand Hotel",
  drinks: [
    { id: "beer1", name: "Stella Artois", type: "beer" },
    { id: "beer2", name: "Blue Moon", type: "beer" },
    { id: "beer3", name: "Heineken", type: "beer" },
    { id: "beer4", name: "Corona", type: "beer" },
    { id: "beer5", name: "Guinness", type: "beer" },
    { id: "beer6", name: "Sam Adams", type: "beer" },
    { id: "beer7", name: "IPA", type: "beer" },
    { id: "beer8", name: "Budweiser", type: "beer" },
    { id: "cocktail1", name: "Mojito", type: "cocktail" },
    { id: "cocktail2", name: "Old Fashioned", type: "cocktail" }
  ]
}

// 2. participants (collection)
{
  id: "auto-generated",
  userId: "firebase-auth-uid",
  name: "John Doe",
  isAnonymous: false,
  progress: {
    beer1: { checked: true, photoUrl: "...", timestamp: "..." },
    beer2: { checked: false },
    // ... etc
  },
  completedCount: 3,
  photoCount: 2,
  startedAt: timestamp,
  completedAt: null
}

// 3. leaderboard (collection)
{
  participantId: "...",
  name: "John Doe",
  completedCount: 10,
  photoCount: 10,
  completedAt: timestamp
}
```

#### Step 2.2: Initialize Data in Firestore
```javascript
// Run once to seed the challenge data
// src/utils/seedData.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const seedChallenge = async () => {
  await setDoc(doc(db, 'challenges', 'wedding2025'), {
    name: "Smith-Johnson Wedding",
    date: "2025-09-14",
    drinks: [
      // ... drink list from above
    ]
  });
};
```

---

### Phase 3: Authentication System (45 mins)

#### Step 3.1: Create Auth Context
```javascript
// src/contexts/AuthContext.jsx
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
        await signInAnonymously(auth);
      } else {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const upgradeToGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    if (currentUser?.isAnonymous) {
      // Link anonymous account with Google
      await linkWithPopup(currentUser, provider);
    } else {
      // Regular Google sign in
      await signInWithPopup(auth, provider);
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
```

#### Step 3.2: Create User Profile Manager
```javascript
// src/hooks/useParticipant.js
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useParticipant() {
  const { currentUser } = useAuth();
  const [participant, setParticipant] = useState(null);
  
  useEffect(() => {
    if (!currentUser) return;

    const participantRef = doc(db, 'participants', currentUser.uid);
    
    // Create or update participant document
    const initParticipant = async () => {
      await setDoc(participantRef, {
        userId: currentUser.uid,
        name: currentUser.displayName || `Guest ${currentUser.uid.slice(0,6)}`,
        email: currentUser.email,
        isAnonymous: currentUser.isAnonymous,
        startedAt: new Date(),
        progress: {},
        completedCount: 0,
        photoCount: 0
      }, { merge: true });
    };

    initParticipant();

    // Listen to participant updates
    const unsubscribe = onSnapshot(participantRef, (doc) => {
      setParticipant({ id: doc.id, ...doc.data() });
    });

    return unsubscribe;
  }, [currentUser]);

  return participant;
}
```

---

### Phase 4: Core Components (1 hour)

#### Step 4.1: Main App Structure
```jsx
// src/App.jsx
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

#### Step 4.2: Challenge Page Component
```jsx
// src/pages/ChallengePage.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useParticipant } from '../hooks/useParticipant';
import DrinkItem from '../components/DrinkItem';

export default function ChallengePage() {
  const { currentUser } = useAuth();
  const participant = useParticipant();
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load challenge data
  useEffect(() => {
    const loadChallenge = async () => {
      const challengeDoc = await getDoc(doc(db, 'challenges', 'wedding2025'));
      if (challengeDoc.exists()) {
        setDrinks(challengeDoc.data().drinks);
      }
      setLoading(false);
    };
    loadChallenge();
  }, []);

  const toggleDrink = async (drinkId) => {
    const participantRef = doc(db, 'participants', currentUser.uid);
    const currentStatus = participant?.progress?.[drinkId]?.checked || false;
    
    await updateDoc(participantRef, {
      [`progress.${drinkId}.checked`]: !currentStatus,
      [`progress.${drinkId}.timestamp`]: new Date(),
      completedCount: participant.completedCount + (currentStatus ? -1 : 1)
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Wedding Bar Challenge</h1>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-4">
          <div 
            className="bg-purple-600 h-4 rounded-full transition-all"
            style={{ width: `${(participant?.completedCount || 0) * 10}%` }}
          />
        </div>
        <p className="text-center mt-2">
          {participant?.completedCount || 0} of 10 drinks completed
        </p>
      </div>

      {/* Drinks List */}
      <div className="space-y-4">
        {drinks.map(drink => (
          <DrinkItem
            key={drink.id}
            drink={drink}
            checked={participant?.progress?.[drink.id]?.checked}
            photoUrl={participant?.progress?.[drink.id]?.photoUrl}
            onToggle={() => toggleDrink(drink.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

#### Step 4.3: Drink Item Component with Photo Upload
```jsx
// src/components/DrinkItem.jsx
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import imageCompression from 'browser-image-compression';

export default function DrinkItem({ drink, checked, photoUrl, onToggle }) {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(photoUrl);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        `challenges/wedding2025/${currentUser.uid}/${drink.id}_${Date.now()}.jpg`
      );
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update Firestore
      const participantRef = doc(db, 'participants', currentUser.uid);
      await updateDoc(participantRef, {
        [`progress.${drink.id}.photoUrl`]: downloadURL,
        photoCount: (participant?.photoCount || 0) + 1
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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="w-6 h-6 text-purple-600"
          />
          <div>
            <h3 className="font-medium">{drink.name}</h3>
            <span className="text-sm text-gray-500">
              {drink.type === 'beer' ? '🍺' : '🍹'} {drink.type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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
              disabled={uploading}
              className="hidden"
            />
            <div className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              {uploading ? 'Uploading...' : '📸 Photo'}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
```

---

### Phase 5: Leaderboard & Real-time Updates (30 mins)

#### Step 5.1: Leaderboard Component
```jsx
// src/pages/LeaderboardPage.jsx
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('completedCount', 'desc'),
      orderBy('photoCount', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(leaderData);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {leaders.map((leader, index) => (
          <div 
            key={leader.id}
            className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-400">
                #{index + 1}
              </span>
              <div>
                <p className="font-medium">{leader.name}</p>
                <p className="text-sm text-gray-500">
                  {leader.completedCount}/10 drinks
                  {leader.photoCount > 0 && ` • ${leader.photoCount} photos`}
                </p>
              </div>
            </div>
            
            {leader.completedCount === 10 && (
              <span className="text-2xl">🎉</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Step 5.2: Auto-update Leaderboard on Completion
```javascript
// src/hooks/useCompletion.js
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useCompletion(participant) {
  useEffect(() => {
    if (!participant) return;
    
    // Check if challenge is complete
    if (participant.completedCount === 10 && !participant.completedAt) {
      const addToLeaderboard = async () => {
        // Update participant completion time
        await setDoc(doc(db, 'participants', participant.userId), {
          completedAt: serverTimestamp()
        }, { merge: true });
        
        // Add to leaderboard
        await setDoc(doc(db, 'leaderboard', participant.userId), {
          participantId: participant.userId,
          name: participant.name,
          completedCount: participant.completedCount,
          photoCount: participant.photoCount,
          completedAt: serverTimestamp()
        });
      };
      
      addToLeaderboard();
    }
  }, [participant?.completedCount]);
}
```

---

### Phase 6: Security & Optimization (30 mins)

#### Step 6.1: Firebase Security Rules

**Firestore Rules:**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Read-only challenge data
    match /challenges/{challenge} {
      allow read: if true;
      allow write: if false;
    }
    
    // Users can only edit their own participant data
    match /participants/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leaderboard entries
    match /leaderboard/{entry} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == entry;
      allow update: if request.auth != null && request.auth.uid == entry;
    }
  }
}
```

**Storage Rules:**
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /challenges/wedding2025/{userId}/{filename} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 && // 5MB max
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

#### Step 6.2: Performance Optimizations

```javascript
// src/utils/performance.js

// 1. Lazy load images
export const LazyImage = ({ src, alt, className }) => {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={className}
    />
  );
};

// 2. Debounce updates
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 3. Offline support
import { enableIndexedDbPersistence } from 'firebase/firestore';

export const enableOfflineSupport = async (db) => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Offline support enabled');
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support offline persistence.');
    }
  }
};
```

---

### Phase 7: Deployment (20 mins)

#### Step 7.1: Build for Production
```bash
# Build the app
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

#### Step 7.2: Configure Custom Domain (Optional)
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. Add domain: `wedding-challenge.yourdomain.com`

---

## 🎨 Styling & UX Enhancements

### Add Tailwind Components
```jsx
// src/components/ui/Button.jsx
export function Button({ children, onClick, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Add Animations
```css
/* src/index.css */
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-pulse-subtle {
  animation: pulse 2s infinite;
}
```

---

## 📱 Mobile Optimizations

### PWA Configuration
```json
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wedding Bar Challenge',
        short_name: 'Bar Challenge',
        theme_color: '#9333ea',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
};
```

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] Test on multiple devices (iOS, Android, Desktop)
- [ ] Configure security rules properly
- [ ] Set up error tracking (Sentry)
- [ ] Test offline functionality
- [ ] Optimize images and assets
- [ ] Set up analytics (Google Analytics)

### Launch Day
- [ ] Deploy to production
- [ ] Share QR codes at venue
- [ ] Monitor real-time dashboard
- [ ] Have backup plan for tech issues

### Post-Event
- [ ] Export data for memories
- [ ] Create photo collage
- [ ] Share statistics with couple

---

## 📊 Monitoring Dashboard

### Admin View Component
```jsx
// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AdminDashboard() {
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
        
        setStats({
          totalParticipants: participants.length,
          totalCompletions: participants.filter(p => p.completedCount === 10).length,
          totalPhotos: participants.reduce((sum, p) => sum + (p.photoCount || 0), 0),
          averageProgress: participants.reduce((sum, p) => sum + (p.completedCount || 0), 0) / participants.length
        });
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Participants</h3>
        <p className="text-3xl font-bold">{stats.totalParticipants}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Completions</h3>
        <p className="text-3xl font-bold">{stats.totalCompletions}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Photos Uploaded</h3>
        <p className="text-3xl font-bold">{stats.totalPhotos}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Avg Progress</h3>
        <p className="text-3xl font-bold">{stats.averageProgress.toFixed(1)}/10</p>
      </div>
    </div>
  );
}
```

---

## 🎉 Ready to Launch!

Your wedding drinking challenge app is now ready. The app includes:
- ✅ Anonymous participation
- ✅ Optional Google sign-in
- ✅ Photo uploads with compression
- ✅ Real-time leaderboard
- ✅ Progress tracking
- ✅ Mobile-friendly design
- ✅ Offline support
- ✅ Security rules

**Next Steps:**
1. Customize the drink list for your specific wedding
2. Add wedding branding (colors, names, date)
3. Test with a few friends
4. Create QR codes for easy access
5. Have fun at the wedding! 🥂

**Support Resources:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)