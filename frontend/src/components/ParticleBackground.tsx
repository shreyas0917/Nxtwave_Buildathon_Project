import React, { useMemo } from 'react';

interface ParticleBackgroundProps {
  count?: number;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ count = 20, className = '' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 20}s`,
      size: `${2 + Math.random() * 4}px`,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <div className={`particles ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
