import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const seedChallenge = async () => {
  try {
    await setDoc(doc(db, 'challenges', 'wedding2025'), {
      name: "Le-Miles Wedding",
      date: "2025-09-13",
      venue: "MB",
      drinks: [
        { 
          id: "beer1", 
          name: "Manayunk Brewing Company - Light Lager", 
          type: "beer",
          description: "Brewed to give a crisp, clean, refreshing taste with very subtle malt and hop flavor. Brewed at Iron Hill Brewery - 4%"
        },
        { 
          id: "beer2", 
          name: "Manayunk Brewing Company — Schuylkill Punch", 
          type: "beer",
          description: "A berry ale brewed by our friends at Yards Brewing — 4.5%"
        },
        { 
          id: "beer3", 
          name: "Flying Fish - GO Birds", 
          type: "beer",
          description: "This hazy, juicy pale ale evokes hints of citrus and mango, perfect for the professional ornithologist or casual birder alike. Keep your eyes to the skies and raise a pint to our favorite birds - 6%"
        },
        { 
          id: "beer4", 
          name: "Coors Light", 
          type: "beer",
          description: "4.2% ABV • The Silver Bullet - Rocky Mountain cold-filtered light lager"
        },
        { 
          id: "beer5", 
          name: "Yuengling Lager", 
          type: "beer",
          description: "Yuengling Traditional Lager is a medium-bodied, American classic beer with a rich amber color and a well-balanced taste - 4.5%"
        },
        { 
          id: "beer6", 
          name: "Modelo", 
          type: "beer",
          description: "4.4% ABV • Mexican pilsner-style lager with a crisp, clean taste and light hop character"
        },
        { 
          id: "beer7", 
          name: "Fiddlehead", 
          type: "beer",
          description: "6.2% ABV • Vermont IPA with tropical fruit flavors and a balanced bitter finish"
        },
        { 
          id: "beer8", 
          name: "New Belgium - VooDoo Ranger IPA", 
          type: "beer",
          description: "7.0% ABV • Bold tropical hop flavors with grapefruit and pine, perfectly balanced"
        },
        { 
          id: "cocktail1", 
          name: "Drink 1", 
          type: "cocktail",
          description: "Signature wedding cocktail - Ask the bartender for today's special mix"
        },
        { 
          id: "cocktail2", 
          name: "Drink 2", 
          type: "cocktail",
          description: "Classic cocktail selection - Ask the bartender for today's second special mix"
        }
      ]
    });
    console.log('Challenge data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default seedChallenge;