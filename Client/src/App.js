import React, { useState, useEffect } from 'react';
import Recorder from './components/Recorder';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import './styles.css';
import './firebase';

function App() {
  const [affirmations, setAffirmations] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
  }, []);

  const handleAffirmationUpdate = (data) => {
    setAffirmations(data.affirmations);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const handleGoPro = async () => {
    const response = await fetch('http://localhost:5000/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    });
    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 text-center">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-indigo-600">AI Affirmation Mirror 🪞</h1>
        <p className="mt-2 text-lg text-gray-700">Reflect. Recharge. Rewire your mind with AI.</p>
      </header>
      {!user ? (
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleLogin}>Sign in with Google</button>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-800">Welcome, {user.displayName}</p>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleLogout}>Logout</button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={handleGoPro}>Upgrade to Pro ($5/mo)</button>
          </div>
          <Recorder onUpdate={handleAffirmationUpdate} />
          {affirmations && (
            <div className="affirmation-box p-4 mt-6 border border-indigo-200 rounded bg-white shadow">
              <h3 className="font-semibold text-indigo-700">Your Affirmations:</h3>
              <pre className="whitespace-pre-wrap mt-2 text-gray-800">{affirmations}</pre>
            </div>
          )}
        </div>
      )}

      {/* === New Landing Sections === */}
      <section className="mt-16 text-left max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">✨ Features</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Record your thoughts and transform them into daily affirmations</li>
          <li>AI-generated messages tailored to uplift your mindset</li>
          <li>Secure Google login & private storage</li>
          <li>Daily email reminders to keep you on track</li>
        </ul>
      </section>

      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">💬 Testimonials</h2>
        <div className="bg-white p-4 rounded shadow text-gray-800">
          <p>“This mirror talks back – in the best way! I've never felt more uplifted.”</p>
          <p className="text-right text-sm mt-2">– Zara M.</p>
        </div>
      </section>

      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">💎 Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">
            <h3 className="font-semibold text-lg">Free Tier</h3>
            <p>• 1 affirmation/day</p>
            <p>• Basic voice recorder</p>
          </div>
          <div className="p-4 border rounded border-yellow-500">
            <h3 className="font-semibold text-lg text-yellow-600">Pro Tier ($5/mo)</h3>
            <p>• Unlimited affirmations</p>
            <p>• AI emotion insights</p>
            <p>• Custom themes & export</p>
          </div>
        </div>
      </section>

      <section className="mt-16 max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">❓ FAQ</h2>
        <div className="text-gray-700">
          <p className="font-semibold">Is my data private?</p>
          <p className="mb-4">Yes. Only you can access your affirmations.</p>
          <p className="font-semibold">Can I cancel Pro?</p>
          <p className="mb-4">Yes, at any time via Stripe.</p>
        </div>
      </section>

      <footer className="text-sm text-gray-400">© {new Date().getFullYear()} Affirmation Mirror</footer>
    </div>
  );
}
export default App;