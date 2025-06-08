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
    <div className="app-container">
      <h1>AI Affirmation Mirror 🪞</h1>
      {!user ? (
        <button onClick={handleLogin}>Sign in with Google</button>
      ) : (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleGoPro}>Upgrade to Pro ($5/mo)</button>
          <Recorder onUpdate={handleAffirmationUpdate} />
          {affirmations && (
            <div className="affirmation-box">
              <h3>Your Affirmations:</h3>
              <pre>{affirmations}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;