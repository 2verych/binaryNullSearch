import React, { useState, useEffect } from 'react';

function App() {
  const [cards, setCards] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(setCards);
  }, []);

  const addCard = async () => {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, code })
    });
    if (res.ok) {
      const card = await res.json();
      setCards([...cards, card]);
      setName('');
      setCode('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Discount Cards</h1>
      <ul>
        {cards.map(c => (
          <li key={c.id}>{c.name} - {c.code}</li>
        ))}
      </ul>

      <h2>Add Card</h2>
      <input
        placeholder="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={addCard}>Add</button>
    </div>
  );
}

export default App;
