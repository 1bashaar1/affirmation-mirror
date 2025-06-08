import React, { useEffect, useState } from 'react';

function Dashboard({ user }) {
  const [affirmations, setAffirmations] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    })
      .then(res => res.json())
      .then(data => setAffirmations(data.affirmations));
  }, [user]);

  const deleteAffirmation = (index) => {
    fetch('/api/affirmation', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, index })
    }).then(() => {
      setAffirmations(affirmations.filter((_, i) => i !== index));
    });
  };

  const downloadAsImage = (text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 200;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(text, 50, 100);
    const link = document.createElement('a');
    link.download = 'affirmation.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const filteredAffirmations = affirmations.filter(a => a.text.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Your Past Affirmations</h2>
      <input
        type="text"
        placeholder="Search..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredAffirmations.length === 0 ? (
        <p>No affirmations match your search.</p>
      ) : (
        <ul>
          {filteredAffirmations.map((a, idx) => (
            <li key={idx}>
              <strong>{new Date(a.date).toLocaleString()}:</strong> {a.text}
              <button onClick={() => downloadAsImage(a.text)}>Download</button>
              <button onClick={() => deleteAffirmation(idx)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;