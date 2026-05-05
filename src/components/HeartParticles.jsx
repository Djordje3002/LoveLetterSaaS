import React, { useEffect, useState } from 'react';

const HeartParticles = ({ count = 15 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * (16 - 8) + 8,
      delay: Math.random() * 10,
      duration: Math.random() * (15 - 10) + 10,
      type: Math.random() > 0.5 ? '❤️' : '🌸',
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            bottom: '-50px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.type}
        </div>
      ))}
    </div>
  );
};

export default HeartParticles;
