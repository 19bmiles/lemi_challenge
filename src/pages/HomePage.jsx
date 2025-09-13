import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const { userName, saveUserName, hasName } = useUser();
  const [nameInput, setNameInput] = useState(userName || '');
  const [error, setError] = useState('');

  const handleStartChallenge = () => {
    if (!nameInput.trim()) {
      setError('Please enter your name to continue');
      return;
    }
    
    if (nameInput.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    saveUserName(nameInput.trim());
    navigate('/challenge');
  };

  const handleContinueChallenge = () => {
    navigate('/challenge');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍻 Wedding Bar Challenge</h1>
          <p className="text-gray-600 mb-8">Complete all 10 drinks and climb the leaderboard!</p>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h2 className="font-semibold text-purple-900 mb-2">Challenge Rules:</h2>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>✅ Check off each drink as you try it</li>
              <li>📸 Upload a photo with each drink for bonus points</li>
              <li>🏆 Complete all 10 drinks to reach the top</li>
              <li>🎉 Have fun and drink responsibly!</li>
            </ul>
          </div>

          {hasName ? (
            <div className="space-y-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-lg font-semibold text-gray-800">{userName}!</p>
              </div>
              
              <Button 
                onClick={handleContinueChallenge}
                variant="primary"
                className="w-full text-lg py-3"
              >
                Continue Challenge 🚀
              </Button>

              <Button 
                onClick={() => navigate('/leaderboard')}
                variant="secondary"
                className="w-full"
              >
                View Leaderboard 🏆
              </Button>

              <button
                onClick={() => {
                  setNameInput('');
                  saveUserName('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline w-full text-center"
              >
                Start as different person
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your name to begin:
                </label>
                <input
                  id="name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleStartChallenge();
                    }
                  }}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={30}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <Button 
                onClick={handleStartChallenge}
                variant="primary"
                className="w-full text-lg py-3"
              >
                Start Challenge 🚀
              </Button>

              <Button 
                onClick={() => navigate('/leaderboard')}
                variant="secondary"
                className="w-full"
              >
                View Leaderboard 🏆
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}