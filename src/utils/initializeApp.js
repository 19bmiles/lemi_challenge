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

// Uncomment the line below and run the app once to seed data
// Then comment it back out
// initializeChallenge();