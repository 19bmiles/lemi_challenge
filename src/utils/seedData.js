import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const seedChallenge = async () => {
  try {
    await setDoc(doc(db, 'challenges', 'wedding2025'), {
      name: "Le-Miles Wedding",
      date: "2025-09-13",
      venue: "MB",
      drinks: [
        { id: "beer1", name: "Manayunk Brewing Company - Light Lager", type: "beer" },
        { id: "beer2", name: "Manayunk Brewing Company — Schuylkill Punch", type: "beer" },
        { id: "beer3", name: "Flying Fish - GO Birds", type: "beer" },
        { id: "beer4", name: "Coors Light", type: "beer" },
        { id: "beer5", name: "Yuengling Lager", type: "beer" },
        { id: "beer6", name: "Modelo", type: "beer" },
        { id: "beer7", name: "Fiddlehead", type: "beer" },
        { id: "beer8", name: "New Belgium - VooDoo Ranger IPA", type: "beer" },
        { id: "cocktail1", name: "Drink 1", type: "cocktail" },
        { id: "cocktail2", name: "Drink 2", type: "cocktail" }
      ]
    });
    console.log('Challenge data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default seedChallenge;