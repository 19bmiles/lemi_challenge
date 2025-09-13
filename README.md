# 🍻 Wedding Bar Challenge App

A fun, interactive web app for wedding guests to track drinks and compete on a real-time leaderboard!

## 🚀 Features

- ✅ **Drink Checklist** - Track 8 beers + 2 cocktails
- 📸 **Photo Uploads** - Capture memories with each drink
- 🏆 **Real-time Leaderboard** - See who's leading the challenge
- 👤 **Anonymous/Google Auth** - Play as guest or sign in
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 💾 **Offline Support** - Works even with poor connectivity

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Firebase (Firestore, Storage, Auth)
- **Styling:** Tailwind CSS
- **State:** React Context API

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)

## 🔧 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd lemi_challenge
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called "lemi-challenge-2025"
3. Enable these services:
   - **Authentication** → Enable Anonymous and Google providers
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode

4. Get your config from Project Settings → General → Your apps → Web app

### 3. Configure Firebase

Edit `src/config/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "lemi-challenge-2025",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Initialize Challenge Data

After configuring Firebase, seed the initial challenge data:

1. Open `src/utils/initializeApp.js`
2. Uncomment the last line: `// initializeChallenge();`
3. Run the app once: `npm run dev`
4. Check Firebase Console to verify data was created
5. Comment the line back out

### 5. Deploy Security Rules

In Firebase Console:

**Firestore Rules:**
Copy contents of `firestore.rules` to Firestore → Rules

**Storage Rules:**
Copy contents of `storage.rules` to Storage → Rules

## 🎮 Running Locally

```bash
npm run dev
```

Visit http://localhost:5173

## 📱 Routes

- `/` - Home page with challenge intro
- `/challenge` - Main drink tracking page
- `/leaderboard` - Real-time rankings
- `/admin` - Admin dashboard (stats overview)

## 🚀 Deployment

### Option 1: Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy
```

### Option 2: Vercel/Netlify

```bash
npm run build
# Deploy the 'dist' folder
```

## 🎨 Customization

### Change Drinks List
Edit the drinks array in `src/utils/seedData.js`

### Update Wedding Details
Modify wedding name/date in `src/utils/seedData.js`

### Theme Colors
Edit Tailwind colors in components (purple-600 is the primary)

## 📊 Admin Features

Visit `/admin` to see:
- Total participants
- Completion rate
- Photos uploaded
- Average progress

## 🔒 Security

- Anonymous users auto-created on first visit
- Users can only edit their own data
- Photos limited to 5MB images only
- All data validated on Firebase side

## 🐛 Troubleshooting

**Firebase errors:** 
- Check your Firebase config is correct
- Ensure all services are enabled in Firebase Console
- Verify security rules are deployed

**Photo upload fails:**
- Check Storage is enabled
- Verify storage rules allow uploads
- Ensure file is under 5MB

**Can't see data:**
- Run the initialize function once
- Check Firestore has the 'challenges' collection
- Verify read permissions in security rules

## 📄 License

MIT

## 🎉 Have Fun!

Perfect for weddings, parties, or any bar event. Drink responsibly! 🥂
