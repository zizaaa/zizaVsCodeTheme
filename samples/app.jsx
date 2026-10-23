// Comment: sample React component
import React, { useState, useEffect } from 'react';
import Header from './Header';

const API_URL = 'https://example.com/api';
const MAX_ITEMS = 42;

export default function Home({ title, items = [] }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 100 && !active);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active]);

  const config = { offset: 100, behavior: 'smooth', retries: MAX_ITEMS };
  const pattern = /^[a-z]+\d*$/gi;
  const message = `Hello ${title}\n`;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center" id="root" onClick={() => setActive(true)}>
      <Header active={active} />
      {items.map((item) => <p key={item.id}>{item.name}</p>)}
    </div>
  );
}

class Store extends Base {
  #count = 0;
  constructor(name) { super(); this.name = name; }
  async load() { return await fetch(API_URL).then((r) => r.json()); }
}
