import React, { useMemo } from "react";

interface Sparkle {
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
}

export function Sparkles() {
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 14 + 8}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 4 + 4}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
