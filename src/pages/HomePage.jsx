import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, upgradeToGoogle, isAnonymous } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await upgradeToGoogle();
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
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

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/challenge')}
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

            {isAnonymous && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Playing as Guest. Sign in to save your progress!
                </p>
                <Button 
                  onClick={handleGoogleSignIn}
                  variant="primary"
                  className="w-full"
                >
                  Sign in with Google
                </Button>
              </div>
            )}

            {!isAnonymous && currentUser && (
              <div className="text-center text-sm text-gray-600">
                Signed in as: {currentUser.displayName || currentUser.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}