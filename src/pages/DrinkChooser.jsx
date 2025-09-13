import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function DrinkChooser() {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load current drinks
  useEffect(() => {
    loadDrinks();
  }, []);

  const loadDrinks = async () => {
    try {
      const challengeDoc = await getDoc(doc(db, 'challenges', 'wedding2025'));
      if (challengeDoc.exists()) {
        setDrinks(challengeDoc.data().drinks || []);
      } else {
        // Initialize with default drinks if document doesn't exist
        const defaultDrinks = [
          { id: "beer1", name: "Beer 1", type: "beer", description: "Description" },
          { id: "beer2", name: "Beer 2", type: "beer", description: "Description" },
          { id: "beer3", name: "Beer 3", type: "beer", description: "Description" },
          { id: "beer4", name: "Beer 4", type: "beer", description: "Description" },
          { id: "beer5", name: "Beer 5", type: "beer", description: "Description" },
          { id: "beer6", name: "Beer 6", type: "beer", description: "Description" },
          { id: "beer7", name: "Beer 7", type: "beer", description: "Description" },
          { id: "beer8", name: "Beer 8", type: "beer", description: "Description" },
          { id: "cocktail1", name: "Cocktail 1", type: "cocktail", description: "Description" },
          { id: "cocktail2", name: "Cocktail 2", type: "cocktail", description: "Description" }
        ];
        setDrinks(defaultDrinks);
      }
    } catch (error) {
      console.error('Error loading drinks:', error);
      setMessage('Error loading drinks');
    } finally {
      setLoading(false);
    }
  };

  const updateDrink = (index, field, value) => {
    const newDrinks = [...drinks];
    newDrinks[index] = { ...newDrinks[index], [field]: value };
    setDrinks(newDrinks);
  };

  const saveDrinks = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, 'challenges', 'wedding2025'), {
        name: "Le-Miles Wedding",
        date: "2025-09-13",
        venue: "MB",
        drinks: drinks
      });
      
      setMessage('✅ Drinks saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving drinks:', error);
      setMessage('❌ Error saving drinks: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const initializeWithDefaults = async () => {
    if (!window.confirm('This will reset all drinks to the wedding defaults. Continue?')) {
      return;
    }

    const defaultDrinks = [
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
        description: "This hazy, juicy pale ale evokes hints of citrus and mango - 6%"
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
        description: "Medium-bodied American classic with rich amber color - 4.5%"
      },
      { 
        id: "beer6", 
        name: "Modelo", 
        type: "beer",
        description: "4.4% ABV • Mexican pilsner-style lager with a crisp, clean taste"
      },
      { 
        id: "beer7", 
        name: "Fiddlehead", 
        type: "beer",
        description: "6.2% ABV • Vermont IPA with tropical fruit flavors"
      },
      { 
        id: "beer8", 
        name: "New Belgium - VooDoo Ranger IPA", 
        type: "beer",
        description: "7.0% ABV • Bold tropical hop flavors with grapefruit and pine"
      },
      { 
        id: "cocktail1", 
        name: "Drink 1", 
        type: "cocktail",
        description: "Signature wedding cocktail - Ask the bartender"
      },
      { 
        id: "cocktail2", 
        name: "Drink 2", 
        type: "cocktail",
        description: "Classic cocktail - Ask the bartender"
      }
    ];

    setDrinks(defaultDrinks);
    setMessage('Drinks reset to defaults. Click Save to apply.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading drinks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🍺 Drink Manager</h1>
            <Button 
              onClick={() => navigate('/')}
              variant="secondary"
              className="text-sm"
            >
              Back to App
            </Button>
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-4 ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 
              message.includes('❌') ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4 mb-6">
            {drinks.map((drink, index) => (
              <div key={drink.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={drink.name}
                      onChange={(e) => updateDrink(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={drink.type}
                      onChange={(e) => updateDrink(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="beer">🍺 Beer</option>
                      <option value="cocktail">🍹 Cocktail</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={drink.description}
                      onChange={(e) => updateDrink(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={initializeWithDefaults}
              variant="secondary"
            >
              Reset to Wedding Defaults
            </Button>
            
            <Button
              onClick={saveDrinks}
              variant="primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save All Drinks'}
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This page is not linked from the main app. 
            Access it directly at <code className="bg-yellow-100 px-1 rounded">/drink-chooser</code>
          </p>
        </div>
      </div>
    </div>
  );
}