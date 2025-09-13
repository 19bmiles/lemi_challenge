import seedChallenge from './seedData';

// Call this function once after setting up Firebase
// to initialize the challenge data
export const initializeChallenge = async () => {
  try {
    await seedChallenge();
    console.log('Wedding challenge initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize challenge:', error);
  }
};

// To initialize or update the challenge data:
// 1. Uncomment the line below
// 2. Refresh the app in your browser
// 3. Check the browser console for success message
// 4. Comment the line back out
// initializeChallenge();